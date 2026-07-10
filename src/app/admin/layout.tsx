import type { Metadata } from "next";
import { requireAdmin } from "@/lib/session";
import { getT } from "@/lib/i18n/server";

// The suffix comes from the root layout's "%s — Vincendio" template, as on
// every other page; spelling it out here bypassed that.
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("page.admin.title") };
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Panel administracyjny</h1>
      {children}
    </div>
  );
}
