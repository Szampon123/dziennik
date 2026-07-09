import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Panel administracyjny — Dziennik" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Panel administracyjny</h1>
      {children}
    </div>
  );
}
