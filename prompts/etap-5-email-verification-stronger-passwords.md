# STAGE 5 — Email verification + stronger password policy

## Goal

1. Strengthen password requirements beyond "min 8 chars" — add complexity rules.
2. Add email verification for credentials-based accounts so only real email owners can register.
3. Optionally gate access for unverified users (soft block: banner + limited features, not hard block).

## Project context

- **Framework**: Next.js 16.2.10 (App Router), server actions + API routes
- **Auth**: NextAuth v5 (beta 31), JWT sessions. Config in `src/lib/auth.ts`
- **Passwords**: `src/lib/passwords.ts` — bcrypt, MIN_PASSWORD_LENGTH = 8, MAX_PASSWORD_LENGTH = 100
- **Registration**: `src/actions/account.ts` — `registerAccount()` server action with zod validation
- **Registration form**: `src/components/RegisterForm.tsx` — client component, hardcoded `MIN_PASSWORD = 8`
- **Login form**: `src/components/CredentialsLoginForm.tsx` — client component
- **Login page**: `src/app/login/page.tsx` — server component
- **Register page**: `src/app/register/page.tsx` — server component
- **Prisma schema**: `prisma/schema.prisma` — User model already has `emailVerified DateTime?` field (standard NextAuth field, currently only set by the Google provider automatically)
- **Existing VerificationToken model**: already in schema (standard NextAuth model) with `identifier`, `token`, `expires` fields and `@@id([identifier, token])`
- **Session**: `src/lib/session.ts` — `requireUserId()`, `getSessionUserId()`, `requireAdmin()`, `requireOwner()`
- **Proxy**: `src/proxy.ts` — Edge Runtime, JWT-only. Do NOT modify.
- **Roles**: `src/lib/roles.ts` — `"suspended" | "user" | "admin" | "owner"`

## Detailed requirements

### 1. Strengthen password validation — modify `src/lib/passwords.ts`

Add password complexity rules. The current file only has MIN/MAX length constants.

Add a `validatePasswordStrength()` function that checks:
- Minimum 8 characters (unchanged)
- Maximum 100 characters (unchanged)
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 digit

Do NOT require special characters — it frustrates users without meaningfully improving security when bcrypt + rate limiting are already in place.

```typescript
export type PasswordValidation = { valid: true } | { valid: false; error: string };

export function validatePasswordStrength(password: string): PasswordValidation {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { valid: false, error: `Hasło musi mieć co najmniej ${MIN_PASSWORD_LENGTH} znaków.` };
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return { valid: false, error: "Hasło jest za długie." };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Hasło musi zawierać co najmniej jedną małą literę." };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Hasło musi zawierać co najmniej jedną wielką literę." };
  }
  if (!/\d/.test(password)) {
    return { valid: false, error: "Hasło musi zawierać co najmniej jedną cyfrę." };
  }
  return { valid: true };
}
```

### 2. Use the new validation in registration — modify `src/actions/account.ts`

Replace the zod `.min()` / `.max()` password validation with a call to `validatePasswordStrength()`.

Current password schema (lines 14-17):
```typescript
password: z
  .string()
  .min(MIN_PASSWORD_LENGTH, `Hasło musi mieć co najmniej ${MIN_PASSWORD_LENGTH} znaków.`)
  .max(MAX_PASSWORD_LENGTH, "Hasło jest za długie."),
```

Replace with just:
```typescript
password: z.string(),
```

Then, after `schema.safeParse(input)` succeeds, add an explicit strength check:

```typescript
const parsed = schema.safeParse(input);
if (!parsed.success) {
  return { ok: false, error: parsed.error.issues[0].message };
}
const { email, password } = parsed.data;

// Password complexity check (beyond what zod validates).
const pwCheck = validatePasswordStrength(password);
if (!pwCheck.valid) {
  return { ok: false, error: pwCheck.error };
}
```

Import `validatePasswordStrength` from `@/lib/passwords` (alongside existing imports).

### 3. Update the client-side form — modify `src/components/RegisterForm.tsx`

Update the `MIN_PASSWORD` constant reference and the placeholder text to reflect the new rules.

Change line 9:
```typescript
const MIN_PASSWORD = 8; // authoritative check is server-side (src/lib/passwords.ts)
```

Update the client-side validation in the `submit()` function (line 23-26) to add basic checks that match the server-side rules. These are convenience checks — the server is authoritative:

```typescript
if (password.length < MIN_PASSWORD) {
  setError(`Hasło musi mieć co najmniej ${MIN_PASSWORD} znaków.`);
  return;
}
if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
  setError("Hasło musi zawierać małą literę, wielką literę i cyfrę.");
  return;
}
```

Update the password input placeholder (line 69):
```typescript
placeholder={`Hasło (min. ${MIN_PASSWORD} zn., mała + wielka litera + cyfra)`}
```

### 4. Email verification — create `src/lib/email.ts`

Create a utility module for sending emails. Use **Resend** as the email provider — it has a generous free tier (100 emails/day), excellent Next.js integration, and a simple API.

```typescript
// Email sending via Resend. The RESEND_API_KEY env var must be set.
// Falls back to console.log in development if the key is missing
// (so local dev works without an email provider).

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || "Dziennik <noreply@yourdomain.com>";

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
  if (!RESEND_API_KEY) {
    // Dev fallback: log to console instead of sending.
    console.log(`[EMAIL] To: ${to}\nSubject: ${subject}\n${html}`);
    return true;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
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
```

Note: we use the raw `fetch()` API instead of the `resend` npm package — zero new dependencies. The Resend REST API is simple enough that a direct fetch is cleaner.

### 5. Email verification logic — create `src/lib/verification.ts`

```typescript
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

const VERIFICATION_EXPIRY_HOURS = 24;

/**
 * Generate a verification token, store it in VerificationToken, and send
 * a verification email. Uses the existing NextAuth VerificationToken model.
 */
export async function sendVerificationEmail(email: string): Promise<boolean> {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + VERIFICATION_EXPIRY_HOURS * 60 * 60 * 1000);

  // Remove any existing tokens for this email (only one pending at a time).
  await prisma.verificationToken.deleteMany({ where: { identifier: email } });

  await prisma.verificationToken.create({
    data: { identifier: email, token, expires },
  });

  const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
  const verifyUrl = `${baseUrl}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

  return sendEmail({
    to: email,
    subject: "Potwierdź swój adres e-mail — Dziennik",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Witaj w Dzienniku!</h2>
        <p>Kliknij poniższy link, aby potwierdzić swój adres e-mail:</p>
        <p>
          <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background: #7c3aed; color: white; text-decoration: none; border-radius: 6px;">
            Potwierdź e-mail
          </a>
        </p>
        <p style="color: #666; font-size: 13px;">
          Link wygasa za ${VERIFICATION_EXPIRY_HOURS} godzin. Jeśli nie zakładałeś konta w Dzienniku, zignoruj tę wiadomość.
        </p>
      </div>
    `,
  });
}

/**
 * Verify a token: check it exists and hasn't expired, then mark the user
 * as verified and delete the token.
 */
export async function verifyEmailToken(
  email: string,
  token: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const record = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: email, token } },
  });

  if (!record) {
    return { ok: false, error: "Nieprawidłowy lub wygasły link weryfikacyjny." };
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: email, token } },
    });
    return { ok: false, error: "Link weryfikacyjny wygasł. Zarejestruj się ponownie lub poproś o nowy link." };
  }

  // Mark user as verified and clean up.
  await prisma.$transaction([
    prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationToken.delete({
      where: { identifier_token: { identifier: email, token } },
    }),
  ]);

  return { ok: true };
}
```

### 6. Send verification email on registration — modify `src/actions/account.ts`

After creating the user (line 52: `await prisma.user.create(...)`), send the verification email:

```typescript
import { sendVerificationEmail } from "@/lib/verification";

// ... after prisma.user.create:
// Best-effort — don't fail registration if the email doesn't send.
await sendVerificationEmail(email).catch((e) =>
  console.error("[REGISTER] Verification email failed:", e)
);
```

### 7. Create verification page — new file `src/app/verify-email/page.tsx`

```tsx
import { verifyEmailToken } from "@/lib/verification";
import { AuthShell } from "@/components/AuthShell";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = { title: "Weryfikacja e-mail — Dziennik" };

type Props = { searchParams: Promise<{ token?: string; email?: string }> };

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { token, email } = await searchParams;

  if (!token || !email) {
    return (
      <AuthShell subtitle="Weryfikacja e-mail">
        <p className="text-center text-danger">Brak wymaganych parametrów w linku.</p>
        <Link href="/login" className="block text-center text-violet-600 hover:underline text-sm">
          Przejdź do logowania
        </Link>
      </AuthShell>
    );
  }

  const result = await verifyEmailToken(email, token);

  return (
    <AuthShell subtitle="Weryfikacja e-mail">
      {result.ok ? (
        <>
          <p className="text-center text-success font-medium">
            Adres e-mail został potwierdzony!
          </p>
          <Link href="/login" className="block text-center text-violet-600 hover:underline text-sm">
            Zaloguj się
          </Link>
        </>
      ) : (
        <>
          <p className="text-center text-danger">{result.error}</p>
          <Link href="/register" className="block text-center text-violet-600 hover:underline text-sm">
            Zarejestruj się ponownie
          </Link>
        </>
      )}
    </AuthShell>
  );
}
```

### 8. Add /verify-email to public paths — modify `src/proxy.ts`

Add `/verify-email` to the `PUBLIC_PATHS` array (the user clicks this link from their email before logging in):

```typescript
const PUBLIC_PATHS = ["/login", "/register", "/suspended", "/verify-email", "/api/auth", "/_next", "/favicon.ico"];
```

### 9. Create resend-verification action — new file `src/actions/verification.ts`

Allow users to request a new verification email (e.g., from a banner on the dashboard):

```typescript
"use server";

import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { sendVerificationEmail } from "@/lib/verification";
import { rateLimit } from "@/lib/rate-limit";

export async function resendVerificationEmail(): Promise<{ ok: boolean; error?: string }> {
  const userId = await requireUserId();

  // Rate limit: max 3 resends per hour per user.
  if (!rateLimit(`verify:resend:${userId}`, 3, 60 * 60).allowed) {
    return { ok: false, error: "Zbyt wiele prób. Spróbuj ponownie za godzinę." };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, emailVerified: true },
  });

  if (!user?.email) return { ok: false, error: "Brak adresu e-mail." };
  if (user.emailVerified) return { ok: true }; // already verified, no-op

  const sent = await sendVerificationEmail(user.email);
  if (!sent) return { ok: false, error: "Nie udało się wysłać e-maila. Spróbuj ponownie." };

  return { ok: true };
}
```

### 10. Show verification banner — new file `src/components/VerificationBanner.tsx`

A small banner shown on the main layout when the user's email is not verified. This is a "soft" reminder, not a hard block — unverified users can still use the app.

```tsx
"use client";

import { useState, useTransition } from "react";
import { resendVerificationEmail } from "@/actions/verification";

export function VerificationBanner() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function resend() {
    startTransition(async () => {
      setError("");
      const res = await resendVerificationEmail();
      if (res.ok) {
        setSent(true);
      } else {
        setError(res.error ?? "Błąd");
      }
    });
  }

  if (sent) {
    return (
      <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-center text-sm text-emerald-800">
        Wysłano link weryfikacyjny. Sprawdź swoją skrzynkę e-mail.
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-sm text-amber-800">
      Twój adres e-mail nie jest zweryfikowany.{" "}
      <button
        onClick={resend}
        disabled={isPending}
        className="underline font-medium hover:no-underline"
      >
        {isPending ? "Wysyłanie…" : "Wyślij link weryfikacyjny"}
      </button>
      {error && <span className="ml-2 text-danger">{error}</span>}
    </div>
  );
}
```

### 11. Integrate the banner into the main layout

Find the main app layout (likely `src/app/layout.tsx` or `src/app/(app)/layout.tsx` — whichever wraps the authenticated pages). Add the verification banner conditionally:

The layout needs to check if the user is logged in and if `emailVerified` is null. Since the layout is a server component, it can read the session and query the DB:

```tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VerificationBanner } from "@/components/VerificationBanner";

// Inside the layout's render, after confirming the user is logged in:
const session = await auth();
let showVerificationBanner = false;
if (session?.user?.id) {
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { emailVerified: true },
  });
  showVerificationBanner = user != null && user.emailVerified == null;
}

// Then in JSX:
{showVerificationBanner && <VerificationBanner />}
```

**Important**: the exact placement depends on the layout structure. The banner should appear at the top of the page, above the main content but below any navigation. Inspect the layout file to determine the right insertion point. If there's no clear place, add it right inside the `<body>` or main wrapper.

**Google-only users**: users who signed in via Google already have `emailVerified` set by NextAuth automatically, so they will never see this banner. The banner only appears for credentials accounts that haven't verified.

### 12. Add new env vars to `.env.local.example`

Add these lines:

```
# Email verification (Resend — https://resend.com)
# RESEND_API_KEY=re_xxxxxxxxxxxx
# EMAIL_FROM="Dziennik <noreply@yourdomain.com>"
```

## Files to CREATE

- `src/lib/email.ts` — email sending utility (Resend API via fetch)
- `src/lib/verification.ts` — verification token logic
- `src/app/verify-email/page.tsx` — verification landing page
- `src/actions/verification.ts` — resend verification action
- `src/components/VerificationBanner.tsx` — unverified email banner

## Files to MODIFY

- `src/lib/passwords.ts` — add `validatePasswordStrength()` and `PasswordValidation` type
- `src/actions/account.ts` — use new password validation, send verification email on registration
- `src/components/RegisterForm.tsx` — update client-side validation and placeholder text
- `src/proxy.ts` — add `/verify-email` to PUBLIC_PATHS
- `.env.local.example` — add RESEND_API_KEY and EMAIL_FROM
- The main authenticated layout file — add VerificationBanner

## Files to NOT modify

- `prisma/schema.prisma` — NO changes (emailVerified and VerificationToken already exist)
- `src/lib/auth.ts` — no changes
- `src/lib/session.ts` — no changes
- `src/lib/roles.ts` — no changes
- `src/lib/rate-limit.ts` — no changes
- `src/lib/crypto.ts` — no changes
- `src/actions/admin.ts` — no changes
- `src/actions/forum.ts` — no changes

## No new dependencies

The Resend integration uses `fetch()` directly — no npm package needed. The `crypto` module is Node.js built-in.

## Password policy summary

| Rule               | Old            | New                              |
|--------------------|----------------|----------------------------------|
| Min length         | 8 chars        | 8 chars (unchanged)              |
| Max length         | 100 chars      | 100 chars (unchanged)            |
| Lowercase letter   | not required   | at least 1 required              |
| Uppercase letter   | not required   | at least 1 required              |
| Digit              | not required   | at least 1 required              |
| Special character  | not required   | not required (intentional)       |

## Email verification flow

1. User registers via `RegisterForm` → `registerAccount()` creates the user with `emailVerified: null`
2. `sendVerificationEmail()` generates a random token, stores it in `VerificationToken`, sends an email with a link to `/verify-email?token=...&email=...`
3. User clicks the link → `verify-email/page.tsx` calls `verifyEmailToken()` which validates the token, sets `emailVerified` to now(), deletes the token
4. If the user didn't verify, a yellow banner appears on every page with a "Resend" button
5. Google users are auto-verified by NextAuth — they never see the banner

## Verification approach: soft block (banner only)

We intentionally do NOT hard-block unverified users. Reasons:
- It would lock out users if the email provider is misconfigured
- The app is a personal journal — low risk of abuse from unverified accounts
- Rate limiting (Stage 3) already prevents spam
- Suspended role (Stage 4) handles actual bad actors

The banner is a persistent, visible reminder that encourages verification without blocking access.

## Testing

1. **Password strength**: Try registering with "abcdefgh" (no uppercase/digit) — should be rejected with a specific error. Try "Abcdefg1" — should succeed.
2. **Verification email in dev**: Without RESEND_API_KEY, registration should succeed and log the email to console. Check the console for the verification link.
3. **Verification link**: Click the logged link → should land on `/verify-email` page → should show success → user's `emailVerified` should be set.
4. **Expired token**: Manually set a token's `expires` to the past in the DB, then try the link → should show "wygasł" error.
5. **Resend button**: Log in as an unverified user → banner should appear → click "Wyślij link weryfikacyjny" → should rate-limit after 3 attempts.
6. **Google users**: Sign in with Google → no banner should appear (emailVerified is auto-set).
7. **Build check**: `npm run build` passes.

## Expected result

5 new files, ~4-5 modified files. No new dependencies. No schema changes. Stronger passwords enforced on registration. Email verification flow with soft-block banner. Works in dev without an email provider (console fallback).
