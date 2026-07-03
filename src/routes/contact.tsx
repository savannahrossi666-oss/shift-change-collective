import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send } from "lucide-react";
import { PageShell, PageHeader } from "@/components/page-shell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Shift Change" },
      { name: "description", content: "Get in touch with the Shift Change team." },
      { property: "og:title", content: "Contact — Shift Change" },
      { property: "og:description", content: "Say hello. Suggest a listing. Partner with us." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  const cls = "w-full rounded-xl border border-white/15 bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/50 focus:outline-none";
  return (
    <PageShell>
      <PageHeader kicker="Contact" title="Say hello." subtitle="Suggest a listing, propose a partnership, or just tell us what you're working on." />
      <div className="mx-auto max-w-2xl px-6 py-16">
        {sent ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
            <div className="text-2xl font-light">Thanks — we'll be in touch.</div>
            <p className="mt-2 text-sm text-white/60">You'll hear back within two business days.</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="space-y-5"
          >
            <input required name="name" placeholder="Your name" className={cls} />
            <input required type="email" name="email" placeholder="Email" className={cls} />
            <select className={cls} defaultValue="">
              <option value="" disabled>What's this about?</option>
              <option>Suggest an opportunity</option>
              <option>Partnership</option>
              <option>Press</option>
              <option>Feedback</option>
              <option>Something else</option>
            </select>
            <textarea required name="msg" placeholder="A few sentences." rows={6} className={`${cls} resize-none`} />
            <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs uppercase tracking-[0.3em] text-black hover:bg-white/90 transition">
              <Send className="h-3 w-3" /> Send
            </button>
          </form>
        )}
      </div>
    </PageShell>
  );
}
