// Auth.js (NextAuth v5) configuration. Login is identity-only (Google
// profile/email) — Calendar access stays a separate incremental-consent flow
// in src/lib/google.ts, and Notion settings live on the User row.
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

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
    jwt({ token, user }) {
      if (user?.id) token.userId = user.id;
      return token;
    },
    session({ session, token }) {
      if (typeof token.userId === "string") {
        session.user.id = token.userId;
      }
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
