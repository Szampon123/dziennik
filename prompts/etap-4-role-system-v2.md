# STAGE 4 — Role system v2: suspended role, admin panel, audit log, hardened auth

## Goal

Harden the role system so it can support a real multi-user production environment. This means:

1. Add a `"suspended"` role that completely blocks access at proxy + session level.
2. Refresh the user's role from the DB on every JWT callback (not just at sign-in) so role changes take effect immediately.
3. Create `requireAdmin()` and `requireOwner()` session helpers.
4. Add a `RoleChange` audit log table so every role mutation is traceable.
5. Build a minimal admin panel (user list, role management, audit history).
6. Create a `/suspended` page shown to suspended users.
7. Remove `allowDangerousEmailAccountLinking: true` from the Google provider.

## Project context

- **Framework**: Next.js 16.2.10 (App Router), `src/proxy.ts` is the Edge proxy (replaces deprecated middleware convention)
- **Auth**: NextAuth v5 (beta 31), JWT sessions, Credentials + Google providers in `src/lib/auth.ts`
- **Roles**: `src/lib/roles.ts` — currently `"user" | "admin" | "owner"`, validated by `normalizeRole()`, promoted by `bootstrapRole()` at sign-in
- **Session**: `src/lib/session.ts` — `requireUserId()` and `getSessionUserId()` verify user exists in DB
- **Proxy**: `src/proxy.ts` — Edge Runtime, JWT-only check via `getToken()`. No Prisma imports allowed here.
- **Rate limiting**: `src/lib/rate-limit.ts` — in-memory, used in auth.ts, forum.ts, account.ts, API routes
- **Encryption**: `src/lib/crypto.ts` — AES-256-GCM for tokens at rest
- **Type augmentation**: `src/types/next-auth.d.ts` — extends Session with `{ id: string; role: Role }` and JWT with `{ userId?: string; role?: Role }`

## Detailed requirements

### 1. Extend the role system — modify `src/lib/roles.ts`

Current `ROLES` array on line 4: `["user", "admin", "owner"]`

**Change to**: `["suspended", "user", "admin", "owner"]`

The `Role` type is derived from this array, so it updates automatically.

Update `normalizeRole()` (line 7-11): the fallback should remain `"user"` (an unknown value must never produce `"suspended"`).

Update `bootstrapRole()` (line 28-40): add a guard — if `current === "suspended"`, return `"suspended"` immediately. A suspended user must NOT be auto-promoted by env vars. Add this check at the very top of the function body, before any other logic:

```typescript
if (current === "suspended") return "suspended";
```

Add a new helper function:

```typescript
/** User is suspended — all access denied. */
export function isSuspendedRole(role: Role): boolean {
  return role === "suspended";
}
```

### 2. Refresh role from DB on every JWT callback — modify `src/lib/auth.ts`

**Current behavior** (lines 86-101): the `jwt` callback only reads the role from DB when `user` is set (i.e., at sign-in). After that, the role is baked into the JWT and never refreshed. This means if an admin suspends a user, that user keeps their old role until their JWT expires.

**New behavior**: on EVERY `jwt` callback invocation, if `token.userId` is set, fetch the current role from DB and update the token. This guarantees role changes (including suspension) take effect within seconds, not hours.

Replace the entire `jwt` callback with:

```typescript
async jwt({ token, user }) {
  // First sign-in: resolve userId and bootstrap role from env vars.
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

  // Subsequent requests: refresh role from DB so changes (suspension,
  // promotion, demotion) take effect immediately — not after JWT expiry.
  if (typeof token.userId === "string") {
    const dbUser = await prisma.user.findUnique({
      where: { id: token.userId },
      select: { role: true },
    });
    if (!dbUser) {
      // User was deleted — invalidate the token.
      token.userId = undefined;
      token.role = undefined;
      return token;
    }
    token.role = normalizeRole(dbUser.role);
  }

  return token;
},
```

**Also in `src/lib/auth.ts`** — remove `allowDangerousEmailAccountLinking: true` from the Google provider (lines 21-28). The entire property must be removed. This prevents an attacker from linking their Google account to an existing email+password account they don't own.

After removal, the Google provider block should look like:

```typescript
Google({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
})
```

Remove the comment above it too (lines 24-26 about "A user who already registered...").

### 3. Block suspended users in the proxy — modify `src/proxy.ts`

The proxy runs in Edge Runtime and already has access to the decoded JWT via `getToken()`. The `role` field is stored in the JWT (set by the jwt callback).

After the existing `if (!token)` block (line 40-50), add a suspended-user check:

```typescript
// Suspended users are locked out entirely. Let them see only the
// /suspended page (and the auth routes so they can sign out).
if (token.role === "suspended") {
  const allowed = pathname === "/suspended" || pathname.startsWith("/api/auth");
  if (!allowed) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Account suspended" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/suspended", req.nextUrl));
  }
}
```

Also add `/suspended` to the `PUBLIC_PATHS` array so unauthenticated users hitting `/suspended` directly don't get redirected to login:

```typescript
const PUBLIC_PATHS = ["/login", "/register", "/suspended", "/api/auth", "/_next", "/favicon.ico"];
```

### 4. Add requireAdmin() and requireOwner() — modify `src/lib/session.ts`

Add imports at the top:

```typescript
import { normalizeRole, isAdminRole, isOwnerRole, isSuspendedRole } from "@/lib/roles";
```

Add two new exported functions after `getSessionUserId()`:

```typescript
/**
 * For admin pages/actions: returns userId or redirects to / if not admin+.
 * Also rejects suspended users (defence-in-depth — proxy blocks them first).
 */
export async function requireAdmin(): Promise<string> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });
  if (!user) redirect("/login");

  const role = normalizeRole(user.role);
  if (isSuspendedRole(role) || !isAdminRole(role)) redirect("/");

  return user.id;
}

/**
 * For owner-only actions (e.g. managing admins): returns userId or redirects.
 */
export async function requireOwner(): Promise<string> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });
  if (!user) redirect("/login");

  const role = normalizeRole(user.role);
  if (!isOwnerRole(role)) redirect("/");

  return user.id;
}
```

### 5. Add RoleChange audit log — modify `prisma/schema.prisma`

Add a new model at the end of the file (before the closing `OAuthToken` model or after it):

```prisma
// ---------- Admin audit log ----------
// Every role change is recorded: who changed whose role, from what to what,
// and when. Immutable — rows are never updated or deleted.

model RoleChange {
  id         String   @id @default(cuid())
  targetId   String   // the user whose role was changed
  changedBy  String   // the admin/owner who made the change
  oldRole    String
  newRole    String
  reason     String?  // optional note from the admin
  createdAt  DateTime @default(now())

  target     User     @relation("RoleChangeTarget", fields: [targetId], references: [id], onDelete: Cascade)
  changer    User     @relation("RoleChangeChanger", fields: [changedBy], references: [id], onDelete: Cascade)

  @@index([targetId])
  @@index([changedBy])
  @@index([createdAt])
}
```

This requires adding the reverse relations on the `User` model. Add these two lines inside the `User` model (after the `forumVotes` line):

```prisma
roleChangesReceived RoleChange[] @relation("RoleChangeTarget")
roleChangesMade     RoleChange[] @relation("RoleChangeChanger")
```

After modifying the schema, run:
```bash
npx prisma migrate dev --name add-role-change-audit-log
npx prisma generate
```

### 6. Create admin actions — new file `src/actions/admin.ts`

```typescript
"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin, requireOwner } from "@/lib/session";
import { normalizeRole, isOwnerRole, isAdminRole, type Role, ROLES } from "@/lib/roles";

export type AdminUserRow = {
  id: string;
  email: string | null;
  name: string | null;
  role: string;
  createdAt: string; // ISO string for serialisation
};

export type RoleChangeRow = {
  id: string;
  targetEmail: string | null;
  targetName: string | null;
  changerEmail: string | null;
  changerName: string | null;
  oldRole: string;
  newRole: string;
  reason: string | null;
  createdAt: string;
};

/** List all users (admin+ only). */
export async function listUsers(): Promise<AdminUserRow[]> {
  await requireAdmin();
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() }));
}

/** Change a user's role (with audit logging). */
export async function changeUserRole(input: {
  targetUserId: string;
  newRole: string;
  reason?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const { targetUserId, newRole: newRoleRaw, reason } = input;

  // Validate the new role is a known value (but not "owner" — owners can't be
  // created via the UI, only via OWNER_EMAIL env var bootstrap).
  if (!ROLES.includes(newRoleRaw as Role)) {
    return { ok: false, error: "Invalid role." };
  }
  const newRole = newRoleRaw as Role;

  // Who's acting?
  const target = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true, role: true },
  });
  if (!target) return { ok: false, error: "User not found." };
  const oldRole = normalizeRole(target.role);

  if (oldRole === newRole) return { ok: true }; // no-op

  // Permission matrix:
  // - Only the owner can promote/demote admins or set the "owner" role.
  // - Admins can suspend/unsuspend regular users and set "user" role.
  // - Nobody can change the owner's role (not even the owner themselves via UI).
  if (isOwnerRole(oldRole)) {
    return { ok: false, error: "The owner's role cannot be changed via the admin panel." };
  }

  if (isOwnerRole(newRole)) {
    return { ok: false, error: "The owner role can only be assigned via the OWNER_EMAIL env var." };
  }

  if (isAdminRole(oldRole) || isAdminRole(newRole)) {
    // Promoting to admin or demoting an admin → owner only.
    const actorId = await requireOwner();
    await prisma.$transaction([
      prisma.user.update({ where: { id: targetUserId }, data: { role: newRole } }),
      prisma.roleChange.create({
        data: { targetId: targetUserId, changedBy: actorId, oldRole, newRole, reason },
      }),
    ]);
    return { ok: true };
  }

  // Regular user ↔ suspended — any admin can do this.
  const actorId = await requireAdmin();
  await prisma.$transaction([
    prisma.user.update({ where: { id: targetUserId }, data: { role: newRole } }),
    prisma.roleChange.create({
      data: { targetId: targetUserId, changedBy: actorId, oldRole, newRole, reason },
    }),
  ]);
  return { ok: true };
}

/** Recent role changes (admin+ only). */
export async function listRoleChanges(limit = 50): Promise<RoleChangeRow[]> {
  await requireAdmin();
  const changes = await prisma.roleChange.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      target: { select: { email: true, name: true } },
      changer: { select: { email: true, name: true } },
    },
  });
  return changes.map((c) => ({
    id: c.id,
    targetEmail: c.target.email,
    targetName: c.target.name,
    changerEmail: c.changer.email,
    changerName: c.changer.name,
    oldRole: c.oldRole,
    newRole: c.newRole,
    reason: c.reason,
    createdAt: c.createdAt.toISOString(),
  }));
}
```

### 7. Create admin pages

#### 7a. Layout — new file `src/app/admin/layout.tsx`

A simple layout that wraps admin pages. It calls `requireAdmin()` so any non-admin user is redirected before the page even renders.

```tsx
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Panel administracyjny — Dziennik" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Panel administracyjny</h1>
      {children}
    </div>
  );
}
```

#### 7b. User list page — new file `src/app/admin/page.tsx`

```tsx
import { listUsers } from "@/actions/admin";
import { AdminUserList } from "@/components/admin/AdminUserList";

export default async function AdminPage() {
  const users = await listUsers();
  return <AdminUserList users={users} />;
}
```

#### 7c. Audit log page — new file `src/app/admin/history/page.tsx`

```tsx
import { listRoleChanges } from "@/actions/admin";

export default async function AdminHistoryPage() {
  const changes = await listRoleChanges();
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Historia zmian ról</h2>
      {changes.length === 0 ? (
        <p className="text-muted">Brak zmian ról.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Data</th>
              <th className="py-2">Użytkownik</th>
              <th className="py-2">Zmiana</th>
              <th className="py-2">Kto zmienił</th>
              <th className="py-2">Powód</th>
            </tr>
          </thead>
          <tbody>
            {changes.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="py-2">{new Date(c.createdAt).toLocaleString("pl-PL")}</td>
                <td className="py-2">{c.targetName ?? c.targetEmail ?? "—"}</td>
                <td className="py-2">
                  <span className="text-danger">{c.oldRole}</span>
                  {" → "}
                  <span className="text-success">{c.newRole}</span>
                </td>
                <td className="py-2">{c.changerName ?? c.changerEmail ?? "—"}</td>
                <td className="py-2 text-muted">{c.reason ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
```

#### 7d. Client component — new file `src/components/admin/AdminUserList.tsx`

A client component for the user list with role-change controls. Keep it simple — a table with a role dropdown per user and a "Save" button that calls `changeUserRole()`.

```tsx
"use client";

import { useState, useTransition } from "react";
import { changeUserRole, type AdminUserRow } from "@/actions/admin";
import { buttonClass } from "@/components/ui/Button";

const ASSIGNABLE_ROLES = ["suspended", "user", "admin"] as const;

export function AdminUserList({ users }: { users: AdminUserRow[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Użytkownicy ({users.length})</h2>
        <a href="/admin/history" className={buttonClass("secondary", "text-sm")}>
          Historia zmian
        </a>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2">Nazwa</th>
            <th className="py-2">E-mail</th>
            <th className="py-2">Rola</th>
            <th className="py-2">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UserRow({ user }: { user: AdminUserRow }) {
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const isOwner = user.role === "owner";
  const changed = selectedRole !== user.role;

  function save() {
    startTransition(async () => {
      setMessage("");
      const res = await changeUserRole({
        targetUserId: user.id,
        newRole: selectedRole,
      });
      if (res.ok) {
        setMessage("Zapisano");
      } else {
        setMessage(res.error);
      }
    });
  }

  return (
    <tr className="border-b">
      <td className="py-2">{user.name ?? "—"}</td>
      <td className="py-2">{user.email ?? "—"}</td>
      <td className="py-2">
        {isOwner ? (
          <span className="font-semibold">owner</span>
        ) : (
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
            disabled={isPending}
          >
            {ASSIGNABLE_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        )}
      </td>
      <td className="py-2">
        {!isOwner && changed && (
          <button onClick={save} disabled={isPending} className={buttonClass("primary", "text-sm")}>
            {isPending ? "Zapisuję…" : "Zapisz"}
          </button>
        )}
        {message && (
          <span className={`ml-2 text-xs ${message === "Zapisano" ? "text-success" : "text-danger"}`}>
            {message}
          </span>
        )}
      </td>
    </tr>
  );
}
```

### 8. Create the /suspended page — new file `src/app/suspended/page.tsx`

```tsx
import { signOut } from "@/lib/auth";

export const metadata = { title: "Konto zawieszone — Dziennik" };

export default function SuspendedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Konto zawieszone</h1>
        <p className="text-muted mb-6">
          Twoje konto zostało zawieszone przez administratora. Jeśli uważasz, że to pomyłka,
          skontaktuj się z administracją.
        </p>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button type="submit" className="underline text-primary">
            Wyloguj się
          </button>
        </form>
      </div>
    </div>
  );
}
```

### 9. Update forum.ts to use the new role helpers (optional cleanup)

In `src/actions/forum.ts`, the `deletePost()` function (line 111-143) already does a manual admin check. This can stay as-is for now — it works correctly. No changes needed.

## Files to CREATE

- `src/actions/admin.ts` — admin server actions
- `src/app/admin/layout.tsx` — admin layout with requireAdmin() gate
- `src/app/admin/page.tsx` — user list page
- `src/app/admin/history/page.tsx` — audit log page
- `src/components/admin/AdminUserList.tsx` — client component for user management
- `src/app/suspended/page.tsx` — suspended user landing page

## Files to MODIFY

- `src/lib/roles.ts` — add `"suspended"` to ROLES, add `isSuspendedRole()`, guard in `bootstrapRole()`
- `src/lib/auth.ts` — refresh role from DB on every jwt callback, remove `allowDangerousEmailAccountLinking`
- `src/proxy.ts` — add suspended-user redirect, add `/suspended` to PUBLIC_PATHS
- `src/lib/session.ts` — add `requireAdmin()` and `requireOwner()` helpers
- `prisma/schema.prisma` — add `RoleChange` model + reverse relations on User
- `src/types/next-auth.d.ts` — NO changes needed (Role type updates automatically from roles.ts)

## Files to NOT modify

- `src/lib/rate-limit.ts` — no changes
- `src/lib/crypto.ts` — no changes
- `src/actions/account.ts` — no changes
- `src/actions/forum.ts` — no changes (existing admin check works fine)
- `src/components/CredentialsLoginForm.tsx` — no changes
- Any API route handlers — no changes
- Any existing page components — no changes

## Migration command

After modifying `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name add-role-change-audit-log
npx prisma generate
```

## Security notes

1. **Role refresh on every request**: The jwt callback now hits the DB on every request to read the role. This is a single `SELECT id, role FROM User WHERE id = ?` query — very fast with the primary key index. The trade-off (one extra query per request) is worth it for instant role enforcement.

2. **Suspended users cannot do anything**: The proxy blocks them before any page or API route runs. Defence-in-depth: `requireAdmin()` and `requireOwner()` also reject suspended users.

3. **Permission matrix for role changes**:
   - Owner's role: cannot be changed via admin panel (only via OWNER_EMAIL env var)
   - Promote/demote admin: owner only
   - Suspend/unsuspend regular user: any admin or owner
   - Set "owner" role: impossible via UI (env var only)

4. **Removing allowDangerousEmailAccountLinking**: After this change, a Google sign-in where the email already has a credentials account will fail with an "account already linked" error instead of silently merging. This is the correct security posture. Users who want to add Google login to their existing account should use a proper account-linking flow (not in scope for this stage).

## Testing

After implementation:

1. **Role refresh**: Change a user's role directly in the DB (`UPDATE "User" SET role = 'admin' WHERE email = '...'`). The change should take effect on the user's next page load without re-login.

2. **Suspended user flow**: 
   - Set a test user's role to `"suspended"` via the admin panel
   - That user should be redirected to `/suspended` on every page
   - API calls from that user should get 403
   - The user can sign out from the `/suspended` page
   - A suspended user should NOT be auto-promoted by OWNER_EMAIL or ADMIN_EMAILS

3. **Admin panel access**:
   - Regular users redirected away from `/admin`
   - Admins can see user list and change regular users' roles
   - Admins cannot promote users to admin (only owner can)
   - Owner can promote/demote admins

4. **Audit log**: Every role change via the admin panel creates a RoleChange row visible in `/admin/history`.

5. **Google sign-in without allowDangerousEmailAccountLinking**: 
   - A user with only credentials login tries Google sign-in with the same email → should see an error (not silently merge)
   - A user who registered via Google can still sign in via Google normally

6. **Build check**: `npm run build` passes without errors.

## Expected result

6 new files, 5 modified files, 1 new Prisma migration. The role system is production-ready: instant role enforcement, suspended-user blocking, admin panel with audit trail, and the dangerous email linking flag removed.
