"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Paperclip, ImagePlus, X } from "lucide-react";
import { createPost } from "@/actions/forum";
import { levelLabel } from "@/lib/forum";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

// Compose a message. Top-level (in a skill+level space) or a reply when
// parentId is set. Supports an optional link + photo attachment.
export function PostComposer({
  activitySlug,
  level,
  parentId,
  variant = "post",
}: {
  activitySlug: string;
  level: number | null;
  parentId?: string;
  variant?: "post" | "reply";
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [body, setBody] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [showExtras, setShowExtras] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function reset() {
    setBody("");
    setLinkUrl("");
    setPhotoName("");
    if (fileRef.current) fileRef.current.value = "";
    setShowExtras(false);
  }

  function submit() {
    if (!body.trim()) return;
    setError("");
    const fd = new FormData();
    fd.set("activitySlug", activitySlug);
    if (level !== null) fd.set("level", String(level));
    if (parentId) fd.set("parentId", parentId);
    fd.set("body", body);
    if (linkUrl.trim()) fd.set("linkUrl", linkUrl.trim());
    const file = fileRef.current?.files?.[0];
    if (file) fd.set("photo", file);

    startTransition(async () => {
      const result = await createPost(fd);
      if (result.ok) {
        reset();
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  const placeholder =
    variant === "reply"
      ? "Napisz odpowiedź…"
      : `Napisz coś w: ${levelLabel(level)}…`;

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder={placeholder}
        aria-label="Treść wiadomości"
      />

      {showExtras && (
        <div className="flex flex-col gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
          <label className="flex flex-col gap-1">
            <span className="text-[12px] font-medium text-neutral-700">Link do materiału</span>
            <Input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://…"
              aria-label="Link do materiału"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[12px] font-medium text-neutral-700">Zdjęcie (maks. 4 MB)</span>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? "")}
              aria-label="Załącz zdjęcie"
              className="text-[13px] text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-100 file:px-3 file:py-1.5 file:text-[13px] file:font-medium file:text-violet-700 hover:file:bg-violet-200"
            />
            {photoName && (
              <span className="inline-flex items-center gap-1 text-[12px] text-neutral-500">
                {photoName}
                <button
                  type="button"
                  onClick={() => {
                    setPhotoName("");
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  aria-label="Usuń wybrane zdjęcie"
                  className="rounded-full p-0.5 hover:text-danger"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            )}
          </label>
        </div>
      )}

      {error && <p className="text-[13px] text-danger">{error}</p>}

      <div className="flex items-center gap-2">
        <Button onClick={submit} disabled={isPending || !body.trim()}>
          {isPending ? "Wysyłanie…" : variant === "reply" ? "Odpowiedz" : "Opublikuj"}
        </Button>
        {!showExtras && (
          <Button variant="ghost" onClick={() => setShowExtras(true)}>
            <Paperclip aria-hidden className="h-4 w-4" /> Dodaj zdjęcie lub link
          </Button>
        )}
        {showExtras && (
          <span className="inline-flex items-center gap-1 text-[13px] text-neutral-500">
            <ImagePlus aria-hidden className="h-4 w-4" /> Załącznik opcjonalny
          </span>
        )}
      </div>
    </div>
  );
}
