// Transactional email via the Resend REST API. Called with fetch() rather than
// the `resend` package — the API is one POST, so a dependency buys nothing.
//
// Without RESEND_API_KEY the message is logged instead of sent, so local dev
// (and CI) works with no email provider configured.

const EMAIL_FROM = process.env.EMAIL_FROM || "Dziennik <noreply@yourdomain.com>";

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

/**
 * Shell for a transactional "click this button" email — verification, password
 * reset. Every string is passed in already translated: this file has no opinion
 * about language.
 *
 * The wordmark stays "Dziennik" on purpose. It names the product to someone who
 * already uses it, which is a different job from SITE_NAME in src/lib/seo.ts.
 */
export function actionEmailHtml(params: {
  url: string;
  body: string;
  button: string;
  expiry: string;
}): string {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>Dziennik</h2>
      <p>${params.body}</p>
      <p>
        <a href="${params.url}" style="display: inline-block; padding: 12px 24px; background: #6e56cf; color: white; text-decoration: none; border-radius: 6px;">
          ${params.button}
        </a>
      </p>
      <p style="color: #666; font-size: 13px;">${params.expiry}</p>
    </div>
  `;
}

/**
 * Outcome of a send. `permanent` is the part callers actually need: it says the
 * identical request will fail the identical way, so inviting a retry is a lie.
 *
 * The distinction is real and it bit us in production: with an unverified sender
 * domain Resend answers 403 and will keep answering 403 forever, but the banner
 * said "please try again" — so the user retried, spent their whole resend budget,
 * and still had no mail. A 5xx or a dropped connection is the opposite: nothing is
 * wrong with the request and the next one may well work.
 */
export type SendResult = { ok: true } | { ok: false; permanent: boolean };

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<SendResult> {
  // Read at call time, not module load: the module may be evaluated during the
  // build, before runtime env vars exist.
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`[EMAIL] To: ${to}\nSubject: ${subject}\n${html}`);
    return { ok: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ from: EMAIL_FROM, to, subject, html }),
    });
    if (!res.ok) {
      console.error("[EMAIL] Resend error:", res.status, await res.text());
      // 4xx is us: a rejected key, a sender domain that was never verified, an
      // address Resend refuses. Retrying re-sends the same rejected request.
      // 429 is the exception — Resend is throttling, not refusing, so it passes.
      const permanent = res.status >= 400 && res.status < 500 && res.status !== 429;
      return { ok: false, permanent };
    }
    return { ok: true };
  } catch (e) {
    // Network-level: nothing says the request itself is wrong. Treat as transient.
    console.error("[EMAIL] Send failed:", e);
    return { ok: false, permanent: false };
  }
}
