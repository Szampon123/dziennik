// Auth.js (NextAuth v5) configuration. Login is identity-only (Google profile
// or email+password) — Calendar access stays a separate incremental-consent
// flow in src/lib/google.ts, and Notion settings live on the User row.
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/passwords";
import { normalizeRole, bootstrapRole } from "@/lib/roles";
import { rateLimit } from "@/lib/rate-limit";

// Dev-only login (no Google keys needed): active only in development with
// DEV_LOGIN=1. Lets you exercise the multi-user flow with fake accounts.
const devLoginEnabled = process.env.NODE_ENV === "development" && process.env.DEV_LOGIN === "1";

const providers = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

// Email + password accounts (real users). Uses JWT sessions (below), so no
// Account row is created — the password hash on User is the credential.
providers.push(
  Credentials({
    id: "credentials",
    name: "E-mail i hasło",
    credentials: { email: {}, password: {} },
    async authorize(creds) {
      const email = typeof creds?.email === "string" ? creds.email.trim().toLowerCase() : "";
      const password = typeof creds?.password === "string" ? creds.password : "";
      if (!email || !password) return null;

      // Brute-force guard, keyed per email: authorize() never sees the request,
      // so there is no IP to key on — but an attacker grinding one account keeps
      // sending the same address. A rejection is indistinguishable from a wrong
      // password, which is what we want.
      if (!rateLimit(`login:${email}`, 5, 15 * 60).allowed) return null;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user?.passwordHash) return null; // no account, or Google-only account
      const valid = await verifyPassword(password, user.passwordHash);
      if (!valid) return null;

      return { id: user.id, email: user.email, name: user.name };
    },
  })
);

if (devLoginEnabled) {
  providers.push(
    Credentials({
      id: "dev-login",
      name: "Dev login",
      credentials: { email: { label: "E-mail", type: "email" } },
      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email.trim() : "";
        if (!email || !email.includes("@")) return null;
        const user = await prisma.user.upsert({
          where: { email },
          update: {},
          create: { email, name: email.split("@")[0] },
        });
        return { id: user.id, email: user.email, name: user.name };
      },
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  // Credentials provider cannot use database sessions — JWT works for both.
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      // First sign-in: resolve userId and bootstrap the role from env vars.
      if (user?.id) {
        token.userId = user.id;
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true, email: true },
        });
        let role = normalizeRole(dbUser?.role);
        const desired = bootstrapRole(dbUser?.email ?? user.email ?? "", role);
        if (desired !== role) {
          await prisma.user.update({ where: { id: user.id }, data: { role: desired } });
          role = desired;
        }
        token.role = role;
        return token;
      }

      // Every later request: re-read the role so a suspension, promotion or
      // demotion takes effect on the next page load instead of at JWT expiry.
      // One indexed primary-key lookup — cheap enough to pay per request.
      if (typeof token.userId === "string") {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.userId },
          select: { role: true },
        });
        if (!dbUser) {
          // The User row is gone (deleted account, DB reset) — strip the claims
          // so nothing downstream trusts this token.
          token.userId = undefined;
          token.role = undefined;
          return token;
        }
        token.role = normalizeRole(dbUser.role);
      }

      return token;
    },
    session({ session, token }) {
      if (typeof token.userId === "string") {
        session.user.id = token.userId;
      }
      session.user.role = normalizeRole(token.role);
      return session;
    },
  },
});

export function isDevLoginEnabled(): boolean {
  return devLoginEnabled;
}

export function isGoogleLoginConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}
