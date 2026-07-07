// Access roles. Kept as a plain string on User.role so adding a role later
// (e.g. "editor", "support") is a code change, not a migration. Client-safe.

export const ROLES = ["user", "admin", "owner"] as const;
export type Role = (typeof ROLES)[number];

export function normalizeRole(value: unknown): Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value)
    ? (value as Role)
    : "user";
}

/** Admin-level access (admins and the owner). */
export function isAdminRole(role: Role): boolean {
  return role === "admin" || role === "owner";
}

/** The owner is the protected super-admin (only the owner can manage admins). */
export function isOwnerRole(role: Role): boolean {
  return role === "owner";
}

/**
 * Env-based promotion applied once at sign-in: OWNER_EMAIL → owner,
 * any address in ADMIN_EMAILS → admin. Never downgrades an existing higher
 * role (demotion stays a manual/admin action).
 */
export function bootstrapRole(email: string, current: Role): Role {
  const addr = email.trim().toLowerCase();
  const owner = (process.env.OWNER_EMAIL ?? "").trim().toLowerCase();
  if (owner && addr === owner) return "owner";
  if (current === "owner") return "owner";
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .toLowerCase()
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (admins.includes(addr)) return "admin";
  return current;
}
