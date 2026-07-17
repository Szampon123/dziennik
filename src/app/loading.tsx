// Global navigation fallback. Every app route is force-dynamic, so without a
// Suspense boundary the tab freezes on the old page until the server responds.
// This skeleton mirrors the generic page shape: a title bar and a couple of
// cards. Purely decorative — no text to translate.
export default function Loading() {
  return (
    <div className="flex flex-col gap-6" aria-hidden>
      <div className="h-8 w-40 animate-pulse rounded-lg bg-neutral-100" />
      <div className="h-40 animate-pulse rounded-card border border-neutral-200 bg-neutral-0" />
      <div className="h-40 animate-pulse rounded-card border border-neutral-200 bg-neutral-0" />
    </div>
  );
}
