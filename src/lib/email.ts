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

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
  // Read at call time, not module load: the module may be evaluated during the
  // build, before runtime env vars exist.
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`[EMAIL] To: ${to}\nSubject: ${subject}\n${html}`);
    return true;
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
      return false;
    }
    return true;
  } catch (e) {
    console.error("[EMAIL] Send failed:", e);
    return false;
  }
}
