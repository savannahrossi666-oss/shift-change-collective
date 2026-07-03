import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/page-shell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — Shift Change" },
      { name: "description", content: "How we handle data at Shift Change." },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <PageShell>
      <PageHeader kicker="Legal" title="Privacy policy" subtitle="Last updated July 2026." />
      <div className="mx-auto max-w-3xl px-6 py-16 space-y-8 text-white/75 leading-relaxed">
        <Section title="What we collect">
          We collect the information you give us directly — your email, profile, assessment answers, and the opportunities you save. We collect basic analytics (pages viewed, referrer) to improve the product. That's it.
        </Section>
        <Section title="What we don't do">
          We don't sell your data. We don't share your assessment answers with employers. We don't run behavioral ad networks on this site.
        </Section>
        <Section title="Where it lives">
          Your Shift Change account data is stored on our infrastructure and encrypted at rest and in transit. Assessment progress on this device is also cached locally so the app works offline.
        </Section>
        <Section title="Your controls">
          You can export or delete your data any time by emailing privacy@shiftchange.co. We honor deletion requests within 30 days.
        </Section>
        <Section title="Third parties">
          When you click through to an application link, you leave Shift Change. Those sites have their own privacy policies. We don't pass your data along in that hop.
        </Section>
        <Section title="Contact">
          Questions? Email privacy@shiftchange.co.
        </Section>
      </div>
    </PageShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-light tracking-tight text-white">{title}</h2>
      <p className="mt-3">{children}</p>
    </section>
  );
}
