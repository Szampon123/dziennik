import { listRoleChanges } from "@/actions/admin";

export default async function AdminHistoryPage() {
  const changes = await listRoleChanges();
  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Historia zmian ról</h2>
      {changes.length === 0 ? (
        <p className="text-neutral-500">Brak zmian ról.</p>
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
                <td className="py-2 text-neutral-500">{c.reason ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
