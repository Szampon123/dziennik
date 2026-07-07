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

// Dev-only login (no Google keys needed): active only in development with
// DEV_LOGIN=1. Lets you exercise the multi-user flow with fake accounts.
const devLoginEnabled = process.env.NODE_ENV === "development" && process.env.DEV_LOGIN === "1";

const providers = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // A user who already registered with email+password (verified by us) can
      // also sign in with Google using the same address — link to that account.
      allowDangerousEmailAccountLinking: true,
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
      // `user` is only set at sign-in — resolve the role once here (not per request).
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
