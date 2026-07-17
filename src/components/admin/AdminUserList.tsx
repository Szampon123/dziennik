"use client";

import { useState, useTransition } from "react";
import { changeUserRole, type AdminUserRow } from "@/actions/admin";
import { buttonClass } from "@/components/ui/Button";
import { selectClass } from "@/components/ui/Input";
import { useT } from "@/components/i18n/I18nProvider";

// "owner" is deliberately absent: it is granted only by the OWNER_EMAIL env var.
const ASSIGNABLE_ROLES = ["suspended", "user", "admin"] as const;

export function AdminUserList({ users }: { users: AdminUserRow[] }) {
  const t = useT();
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("admin.usersHeading", { count: users.length })}</h2>
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
  const t = useT();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const isOwner = user.role === "owner";
  const changed = selectedRole !== user.role;

  function save() {
    startTransition(async () => {
      setMessage("");
      const res = await changeUserRole({ targetUserId: user.id, newRole: selectedRole });
      setMessage(res.ok ? "Zapisano" : res.error);
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
            className={`${selectClass} w-auto py-2`}
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
            {isPending ? t("common.saving") : t("common.save")}
          </button>
        )}
        {message && (
          <span
            className={`ml-2 text-xs ${message === "Zapisano" ? "text-success" : "text-danger"}`}
          >
            {message}
          </span>
        )}
      </td>
    </tr>
  );
}
