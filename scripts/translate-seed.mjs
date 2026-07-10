// Backfills the *En/*De/*Es columns on Activity and Milestone from the canonical
// Polish, using the Microsoft (Azure) Translator v3 REST API.
//
// This is a LOCAL tool. It is never run on Vercel, and MICROSOFT_TRANSLATOR_KEY
// must never be added to the deployment's env vars. Point it at a database and
// let it run; the app renders Polish for any row it hasn't reached yet.
//
//   MICROSOFT_TRANSLATOR_KEY=... MICROSOFT_TRANSLATOR_REGION=westeurope \
//   DATABASE_URL=... DIRECT_URL=... node scripts/translate-seed.mjs
//
// Flags:
//   --dry-run   Report what would be sent and the exact billed character count.
//               Makes no network calls and writes nothing.
//   --force     Re-translate rows that already have a translation. See the
//               warning under BILLING before using this.
//   --limit=N   Only process the first N source strings (smoke tests).
//
// ── BILLING ────────────────────────────────────────────────────────────────
// Azure bills source characters × number of target languages. The full seed is
// ~586k source characters, so one complete run costs ~1.76M billed characters
// against the F0 free grant of 2M/month. It fits exactly once. A --force re-run
// in the same calendar month will overrun the grant and start charging.
//
// The F0 tier also meters ~2M characters/hour and expects even consumption, so
// this throttles to ~33k billed chars/minute rather than firing as fast as the
// API will accept. A full run therefore takes roughly an hour. That is
// intentional — bursting earns a 429 and a long Retry-After.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// The global endpoint. A resource provisioned with a custom subdomain has its
// own host, so allow an override.
const ENDPOINT =
  process.env.MICROSOFT_TRANSLATOR_ENDPOINT ?? "https://api.cognitive.microsofttranslator.com/translate";
const SOURCE = "pl";
const TARGETS = ["en", "de", "es"];

// Azure caps a request at 1,000 array elements and 50,000 characters. The
// character cap is documented against the request body, but billing counts
// source × targets — so we budget against the billed figure, which is the
// conservative reading and safe under either interpretation.
const MAX_ELEMENTS = 1000;
const MAX_BILLED_CHARS_PER_REQUEST = 50_000;
const MAX_SOURCE_CHARS_PER_REQUEST = Math.floor(MAX_BILLED_CHARS_PER_REQUEST / TARGETS.length);

// Even-consumption target for F0 (~2M billed chars/hour).
const BILLED_CHARS_PER_MINUTE = 33_000;

const MAX_ATTEMPTS = 6;

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const FORCE = args.includes("--force");
const LIMIT = Number(args.find((a) => a.startsWith("--limit="))?.split("=")[1] ?? 0) || 0;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Spends from a character budget that refills at BILLED_CHARS_PER_MINUTE.
 * Starts full, so a small run never waits.
 */
function makeThrottle() {
  const perMs = BILLED_CHARS_PER_MINUTE / 60_000;
  let available = BILLED_CHARS_PER_MINUTE;
  let last = Date.now();
  return async function spend(billedChars) {
    for (;;) {
      const now = Date.now();
      available = Math.min(BILLED_CHARS_PER_MINUTE, available + (now - last) * perMs);
      last = now;
      if (available >= billedChars || billedChars > BILLED_CHARS_PER_MINUTE) {
        // A batch larger than one minute's budget can never be covered; let it
        // through once the bucket is full rather than deadlocking.
        available -= billedChars;
        return;
      }
      await sleep(Math.ceil((billedChars - available) / perMs));
    }
  };
}

function requireEnv(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing ${name}. This script is local-only; do not set it on Vercel.`);
    process.exit(1);
  }
  return v;
}

/** POST one batch of strings. Returns { translations, metered }. */
async function translateBatch(texts, key, region) {
  const url = `${ENDPOINT}?api-version=3.0&from=${SOURCE}${TARGETS.map((t) => `&to=${t}`).join("")}`;
  const body = JSON.stringify(texts.map((Text) => ({ Text })));

  for (let attempt = 1; ; attempt++) {
    let res;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": key,
          "Ocp-Apim-Subscription-Region": region,
          "Content-Type": "application/json; charset=UTF-8",
        },
        body,
      });
    } catch (err) {
      if (attempt >= MAX_ATTEMPTS) throw err;
      const wait = 2 ** attempt * 1000;
      console.warn(`  network error (${err.message}); retrying in ${wait / 1000}s`);
      await sleep(wait);
      continue;
    }

    if (res.status === 429 || res.status >= 500) {
      if (attempt >= MAX_ATTEMPTS) {
        throw new Error(`${res.status} after ${MAX_ATTEMPTS} attempts: ${await res.text()}`);
      }
      // Retry-After is authoritative on 429; fall back to exponential backoff.
      const retryAfter = Number(res.headers.get("retry-after"));
      const wait = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 2 ** attempt * 1000;
      console.warn(`  ${res.status}; waiting ${wait / 1000}s (attempt ${attempt}/${MAX_ATTEMPTS})`);
      await sleep(wait);
      continue;
    }

    if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);

    const metered = Number(res.headers.get("x-metered-usage")) || 0;
    const json = await res.json();
    if (!Array.isArray(json) || json.length !== texts.length) {
      throw new Error(`expected ${texts.length} results, got ${JSON.stringify(json).slice(0, 200)}`);
    }
    // Map each result to { en, de, es }. Azure echoes the target in `to`.
    const translations = json.map((entry) => {
      const out = {};
      for (const tr of entry.translations ?? []) out[tr.to] = tr.text;
      for (const t of TARGETS) {
        if (typeof out[t] !== "string") throw new Error(`missing '${t}' in ${JSON.stringify(entry)}`);
      }
      return out;
    });
    return { translations, metered };
  }
}

/** Collect every (row, field) still needing a translation. */
async function collectWork() {
  const activityWhere = FORCE ? {} : { nameEn: null };
  const activities = await prisma.activity.findMany({
    where: activityWhere,
    select: { id: true, name: true },
  });

  const milestones = await prisma.milestone.findMany({
    where: FORCE ? {} : { OR: [{ titleEn: null }, { AND: [{ detail: { not: null } }, { detailEn: null }] }] },
    select: { id: true, title: true, titleEn: true, detail: true, detailEn: true },
  });

  /** @type {{table:'activity'|'milestone', id:string, field:'name'|'title'|'detail', text:string}[]} */
  const work = [];
  for (const a of activities) work.push({ table: "activity", id: a.id, field: "name", text: a.name });
  for (const m of milestones) {
    if (FORCE || m.titleEn === null) {
      work.push({ table: "milestone", id: m.id, field: "title", text: m.title });
    }
    if (m.detail && (FORCE || m.detailEn === null)) {
      work.push({ table: "milestone", id: m.id, field: "detail", text: m.detail });
    }
  }
  return LIMIT ? work.slice(0, LIMIT) : work;
}

/**
 * Group work items by their exact source text. The ladders repeat phrasing
 * heavily, and Azure bills per character sent — translating "Bez zatrzymywania
 * się." once instead of 40 times is a straight saving.
 */
function dedupe(work) {
  const byText = new Map();
  for (const item of work) {
    const bucket = byText.get(item.text);
    if (bucket) bucket.push(item);
    else byText.set(item.text, [item]);
  }
  return byText;
}

/** Split unique texts into requests obeying both Azure caps. */
function makeBatches(texts) {
  const batches = [];
  let current = [];
  let chars = 0;
  for (const text of texts) {
    const len = [...text].length;
    if (current.length && (current.length >= MAX_ELEMENTS || chars + len > MAX_SOURCE_CHARS_PER_REQUEST)) {
      batches.push(current);
      current = [];
      chars = 0;
    }
    current.push(text);
    chars += len;
  }
  if (current.length) batches.push(current);
  return batches;
}

/** Persist one text's translations to every row that shares that text. */
async function writeBack(items, tr) {
  const activityIds = items.filter((i) => i.table === "activity").map((i) => i.id);
  const titleIds = items.filter((i) => i.table === "milestone" && i.field === "title").map((i) => i.id);
  const detailIds = items.filter((i) => i.table === "milestone" && i.field === "detail").map((i) => i.id);

  const ops = [];
  if (activityIds.length) {
    ops.push(
      prisma.activity.updateMany({
        where: { id: { in: activityIds } },
        data: { nameEn: tr.en, nameDe: tr.de, nameEs: tr.es },
      })
    );
  }
  if (titleIds.length) {
    ops.push(
      prisma.milestone.updateMany({
        where: { id: { in: titleIds } },
        data: { titleEn: tr.en, titleDe: tr.de, titleEs: tr.es },
      })
    );
  }
  if (detailIds.length) {
    ops.push(
      prisma.milestone.updateMany({
        where: { id: { in: detailIds } },
        data: { detailEn: tr.en, detailDe: tr.de, detailEs: tr.es },
      })
    );
  }
  if (ops.length) await prisma.$transaction(ops);
}

async function main() {
  const work = await collectWork();
  if (work.length === 0) {
    console.log("Nothing to translate — every row already has a translation.");
    return;
  }

  const byText = dedupe(work);
  const uniqueTexts = [...byText.keys()];
  const sourceChars = uniqueTexts.reduce((n, t) => n + [...t].length, 0);
  const billed = sourceChars * TARGETS.length;
  const batches = makeBatches(uniqueTexts);

  const rawChars = work.reduce((n, i) => n + [...i.text].length, 0);
  console.log(`rows to fill      : ${work.length}`);
  console.log(`unique strings    : ${uniqueTexts.length} (deduped ${work.length - uniqueTexts.length})`);
  console.log(`source characters : ${sourceChars.toLocaleString()} (${(rawChars - sourceChars).toLocaleString()} saved by dedupe)`);
  console.log(`billed characters : ${billed.toLocaleString()} (× ${TARGETS.length} targets)`);
  // Surfaced because a cap violation is a 400 from Azure, and mid-run is a
  // costly place to discover one.
  const widest = Math.max(...batches.map((b) => b.length));
  const fattest = Math.max(...batches.map((b) => b.reduce((n, t) => n + [...t].length, 0)));
  console.log(`requests          : ${batches.length}`);
  console.log(
    `largest request   : ${widest}/${MAX_ELEMENTS} elements, ` +
      `${fattest.toLocaleString()}/${MAX_SOURCE_CHARS_PER_REQUEST.toLocaleString()} source chars`
  );
  if (widest > MAX_ELEMENTS || fattest > MAX_SOURCE_CHARS_PER_REQUEST) {
    throw new Error("batching produced a request that exceeds an Azure limit");
  }
  console.log(`est. wall clock   : ~${Math.ceil(billed / BILLED_CHARS_PER_MINUTE)} min at ${BILLED_CHARS_PER_MINUTE.toLocaleString()} billed chars/min`);

  if (billed > 2_000_000) {
    console.warn(`\n!! ${billed.toLocaleString()} billed chars exceeds the 2,000,000/month F0 grant.`);
  }
  if (FORCE) {
    console.warn("!! --force re-translates rows that already have translations.");
  }
  if (DRY_RUN) {
    console.log("\n--dry-run: no requests sent, nothing written.");
    return;
  }

  const key = requireEnv("MICROSOFT_TRANSLATOR_KEY");
  const region = requireEnv("MICROSOFT_TRANSLATOR_REGION");
  const throttle = makeThrottle();

  let done = 0;
  let metered = 0;
  const startedAt = Date.now();

  for (const [i, batch] of batches.entries()) {
    const batchBilled = batch.reduce((n, t) => n + [...t].length, 0) * TARGETS.length;
    await throttle(batchBilled);

    const { translations, metered: used } = await translateBatch(batch, key, region);
    metered += used;

    // Write inside the loop: an interrupted run keeps everything it paid for,
    // and the `*En IS NULL` filter makes the next run resume where it stopped.
    for (const [j, text] of batch.entries()) {
      await writeBack(byText.get(text), translations[j]);
    }

    done += batch.length;
    const mins = (Date.now() - startedAt) / 60_000;
    console.log(
      `[${i + 1}/${batches.length}] ${done}/${uniqueTexts.length} strings · ` +
        `${metered.toLocaleString()} billed · ${mins.toFixed(1)} min elapsed`
    );
  }

  console.log(`\nDone. Azure metered ${metered.toLocaleString()} characters.`);
  if (metered && Math.abs(metered - billed) / billed > 0.05) {
    console.warn(`(estimate was ${billed.toLocaleString()}; Azure is authoritative)`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
