import type { DefaultSession } from "next-auth";
import type { Role } from "@/lib/roles";

// Expose the user id and access role on the session (set in the session callback).
declare module "next-auth" {
  interface Session {
    user: { id: string; role: Role } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    role?: Role;
    /**
     * When this session began, in epoch milliseconds. Our own claim, not the
     * standard `iat`: Auth.js re-signs the cookie on every write and stamps a
     * fresh `iat` each time, so `iat` means "last cookie write", not "sign-in".
     * Compared against User.sessionsValidFrom in the jwt callback.
     */
    authAt?: number;
  }
}
