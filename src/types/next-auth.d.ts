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
  }
}
