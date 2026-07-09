import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-2xl font-bold">Nie znaleziono strony</h1>
        <p className="text-muted mb-6">
          Strona, której szukasz, nie istnieje lub została przeniesiona.
        </p>
        <Link href="/" className="text-primary underline hover:no-underline">
          Wróć do strony głównej
        </Link>
      </div>
    </div>
  );
}
