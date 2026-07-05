import { useRef, useState } from "react";
import { Upload, X, Link2 } from "lucide-react";
import type { AcceptKind, SubmissionAnswer } from "@/lib/assessments";

const MIME: Record<AcceptKind, string> = {
  image: "image/*",
  video: "video/*",
  audio: "audio/*",
  doc: ".pdf,.doc,.docx,.txt,.md",
  link: "",
};

const SOFT_CAP_MB = 5;

export function SubmissionUploader({
  accepts = ["image"],
  value,
  onChange,
}: {
  accepts?: AcceptKind[];
  value: SubmissionAnswer;
  onChange: (v: SubmissionAnswer) => void;
}) {
  const [err, setErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supportsLinks = accepts.includes("link");
  const fileAccepts = accepts.filter((a) => a !== "link");
  const acceptAttr = fileAccepts.map((a) => MIME[a]).filter(Boolean).join(",");

  function handleFiles(files: FileList | null) {
    if (!files || !files.length) return;
    setErr(null);
    const readers: Promise<{ name: string; dataUrl: string; type: string; size: number }>[] = [];
    for (const f of Array.from(files)) {
      if (f.size > SOFT_CAP_MB * 1024 * 1024) {
        setErr(`${f.name} is larger than ${SOFT_CAP_MB}MB. Large files won't fit in local storage — attach a link instead for now.`);
        continue;
      }
      readers.push(
        new Promise((resolve) => {
          const r = new FileReader();
          r.onload = () => resolve({ name: f.name, dataUrl: String(r.result), type: f.type, size: f.size });
          r.readAsDataURL(f);
        }),
      );
    }
    Promise.all(readers).then((next) => {
      onChange({ ...value, files: [...(value.files ?? []), ...next] });
    });
  }

  function removeFile(i: number) {
    const next = [...(value.files ?? [])];
    next.splice(i, 1);
    onChange({ ...value, files: next });
  }

  function updateLink(i: number, v: string) {
    const next = [...(value.links ?? [])];
    next[i] = v;
    onChange({ ...value, links: next });
  }

  function addLink() {
    onChange({ ...value, links: [...(value.links ?? []), ""] });
  }

  return (
    <div className="space-y-4">
      {fileAccepts.length > 0 && (
        <>
          <label
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-8 text-center text-sm text-white/60 cursor-pointer hover:bg-white/[0.04]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
          >
            <Upload className="h-5 w-5 text-white/40" />
            <span>Drop files or click to upload</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
              {fileAccepts.join(" · ")} · soft cap {SOFT_CAP_MB}MB
            </span>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept={acceptAttr}
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
          {err && <div className="text-xs text-amber-300">{err}</div>}
          {(value.files?.length ?? 0) > 0 && (
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {value.files!.map((f, i) => (
                <li key={i} className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
                  {f.type.startsWith("image/") ? (
                    <img src={f.dataUrl} alt={f.name} className="h-32 w-full object-cover" />
                  ) : f.type.startsWith("video/") ? (
                    <video src={f.dataUrl} className="h-32 w-full object-cover" muted />
                  ) : f.type.startsWith("audio/") ? (
                    <audio src={f.dataUrl} controls className="w-full" />
                  ) : (
                    <div className="flex h-32 items-center justify-center text-xs text-white/50 px-3 text-center">{f.name}</div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
                    aria-label="Remove"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="truncate border-t border-white/10 px-2 py-1 text-[10px] text-white/50">{f.name}</div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
      {supportsLinks && (
        <div className="space-y-2">
          {(value.links ?? []).map((l, i) => (
            <div key={i} className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-white/40" />
              <input
                value={l}
                onChange={(e) => updateLink(i, e.target.value)}
                placeholder="https://…"
                className="w-full rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/50 focus:outline-none"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addLink}
            className="text-[10px] uppercase tracking-[0.3em] text-white/50 hover:text-white/80"
          >
            + Add link
          </button>
        </div>
      )}
    </div>
  );
}
