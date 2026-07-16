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
//   --sport=slug[,slug]
//               Restrict to one or more activities by slug (e.g.
//               --sport=plywanie,lyzwiarstwo-figurowe). Without it, the whole
//               untranslated backlog is processed. Unknown slugs abort.
//   --targets=lang[,lang]
//               Which languages to fill: en, de, es (default all three). Bills
//               source × (number of targets), so --targets=en costs a third of
//               the full run. Lets the seed be translated in monthly stages
//               within the renewable F0 grant. A row is "done" per language, so
//               a later --targets=de run still finds rows even if English is set.
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

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const FORCE = args.includes("--force");
const LIMIT = Number(args.find((a) => a.startsWith("--limit="))?.split("=")[1] ?? 0) || 0;
const SPORTS = (args.find((a) => a.startsWith("--sport="))?.split("=")[1] ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// The languages this run fills. Defaults to all three, but the seed is
// translated in monthly stages within the renewable F0 grant (e.g. --targets=en
// this month, --targets=de the next), so the active set must be selectable. Each
// field's translation column is `field + LANG_SUFFIX[lang]` (e.g. name + En).
const LANG_SUFFIX = { en: "En", de: "De", es: "Es" };
const TARGETS = (() => {
  const raw = args.find((a) => a.startsWith("--targets="))?.split("=")[1];
  if (!raw) return Object.keys(LANG_SUFFIX);
  const list = raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const bad = list.filter((t) => !(t in LANG_SUFFIX));
  if (bad.length) {
    console.error(`Unknown --targets: ${bad.join(", ")}. Valid: ${Object.keys(LANG_SUFFIX).join(", ")}`);
    process.exit(1);
  }
  return list;
})();

// Azure caps a request at 1,000 array elements and 50,000 characters. The
// character cap is documented against the request body, but billing counts
// source × targets — so we budget against the billed figure, which is the
// conservative reading and safe under either interpretation.
const MAX_ELEMENTS = 1000;
// 50,000 is Azure's absolute per-request body cap (all tiers), but the F0 free
// tier separately rejects any single request that bills more than ~15,000
// characters (source × targets) with 429001 — measured: 15k billed succeeds,
// 30k fails hard even after backoff. Cap well under that so F0 accepts every
// request; the throttle below then paces the requests across time.
const MAX_BILLED_CHARS_PER_REQUEST = 12_000;
const MAX_SOURCE_CHARS_PER_REQUEST = Math.floor(MAX_BILLED_CHARS_PER_REQUEST / TARGETS.length);

// Even-consumption target for F0 (~2M billed chars/hour).
const BILLED_CHARS_PER_MINUTE = 33_000;

const MAX_ATTEMPTS = 6;

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
  // Optional --sport scope: resolve slugs to activity ids and constrain both
  // queries. An unknown slug is almost always a typo that would silently
  // translate nothing, so abort loudly instead.
  let activityIds = null;
  if (SPORTS.length) {
    const scoped = await prisma.activity.findMany({
      where: { slug: { in: SPORTS } },
      select: { id: true, slug: true },
    });
    const found = new Set(scoped.map((a) => a.slug));
    const missing = SPORTS.filter((s) => !found.has(s));
    if (missing.length) {
      console.error(`Unknown --sport slug(s): ${missing.join(", ")}`);
      process.exit(1);
    }
    activityIds = scoped.map((a) => a.id);
  }

  // A (row, field) needs work when any active target's column is still null (or
  // always, under --force). Staged runs fill one language at a time, so English
  // can't be the sentinel — each active target is checked on its own column.
  const needs = (row, field) => FORCE || TARGETS.some((lang) => row[field + LANG_SUFFIX[lang]] == null);

  const activities = await prisma.activity.findMany({
    where: activityIds ? { id: { in: activityIds } } : {},
    select: { id: true, name: true, nameEn: true, nameDe: true, nameEs: true },
  });
  const milestones = await prisma.milestone.findMany({
    where: activityIds ? { activityId: { in: activityIds } } : {},
    select: {
      id: true,
      title: true,
      titleEn: true,
      titleDe: true,
      titleEs: true,
      detail: true,
      detailEn: true,
      detailDe: true,
      detailEs: true,
    },
  });

  /** @type {{table:'activity'|'milestone', id:string, field:'name'|'title'|'detail', text:string}[]} */
  const work = [];
  for (const a of activities) {
    if (needs(a, "name")) work.push({ table: "activity", id: a.id, field: "name", text: a.name });
  }
  for (const m of milestones) {
    if (needs(m, "title")) work.push({ table: "milestone", id: m.id, field: "title", text: m.title });
    if (m.detail && needs(m, "detail")) {
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
  // Only the active TARGETS are written; a staged run must not touch the columns
  // for languages it didn't translate (tr has no entry for them).
  const dataFor = (field) => Object.fromEntries(TARGETS.map((lang) => [field + LANG_SUFFIX[lang], tr[lang]]));

  const activityIds = items.filter((i) => i.table === "activity").map((i) => i.id);
  const titleIds = items.filter((i) => i.table === "milestone" && i.field === "title").map((i) => i.id);
  const detailIds = items.filter((i) => i.table === "milestone" && i.field === "detail").map((i) => i.id);

  const ops = [];
  if (activityIds.length) {
    ops.push(prisma.activity.updateMany({ where: { id: { in: activityIds } }, data: dataFor("name") }));
  }
  if (titleIds.length) {
    ops.push(prisma.milestone.updateMany({ where: { id: { in: titleIds } }, data: dataFor("title") }));
  }
  if (detailIds.length) {
    ops.push(prisma.milestone.updateMany({ where: { id: { in: detailIds } }, data: dataFor("detail") }));
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
