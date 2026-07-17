import Link from "next/link";
import { SearchX } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import { getT } from "@/lib/i18n/server";

export default async function NotFoundPage() {
  const { t } = await getT();
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="max-w-md rounded-card border border-neutral-200 bg-neutral-0 p-8 text-center shadow-card">
        <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-700">
          <SearchX aria-hidden className="h-6 w-6" />
        </span>
        <h1 className="text-xl font-semibold text-neutral-900">{t("notFound.title")}</h1>
        <p className="mt-2 text-sm text-neutral-600">{t("notFound.body")}</p>
        <Link href="/" className={buttonClass("primary", "mt-6")}>
          {t("notFound.home")}
        </Link>
      </div>
    </div>
  );
}
