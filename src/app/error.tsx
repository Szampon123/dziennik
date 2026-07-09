"use client";

// Catch-all boundary for render/server errors. Next.js redacts `error.message`
// in production; we never render it anyway. The digest is a safe hash that
// correlates with the server log entry.
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-2xl font-bold">Coś poszło nie tak</h1>
        <p className="text-muted mb-6">
          Wystąpił nieoczekiwany błąd. Spróbuj odświeżyć stronę.
          {error.digest && (
            <span className="mt-2 block text-xs text-neutral-400">Kod błędu: {error.digest}</span>
          )}
        </p>
        <button onClick={reset} className="text-primary underline hover:no-underline">
          Spróbuj ponownie
        </button>
      </div>
    </div>
  );
}
