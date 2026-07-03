import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/page-shell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — Shift Change" },
      { name: "description", content: "Terms of service for Shift Change." },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <PageShell>
      <PageHeader kicker="Legal" title="Terms of service" subtitle="Last updated July 2026." />
      <div className="mx-auto max-w-3xl px-6 py-16 space-y-8 text-white/75 leading-relaxed">
        <Section title="Using Shift Change">
          You need to be 16+ to use Shift Change. You're responsible for what you post about yourself. Don't impersonate anyone or scrape the site.
        </Section>
        <Section title="Opportunities are third-party">
          We curate opportunities but we don't employ, endorse, or guarantee any company or program listed. Your relationship with an opportunity is between you and them. Read their terms before applying.
        </Section>
        <Section title="Content">
          Anything you submit (bios, discussion posts, suggestions) — you own. You grant us a license to display it on Shift Change.
        </Section>
        <Section title="Termination">
          You can close your account any time. We reserve the right to remove accounts that harass others, spam the platform, or violate these terms.
        </Section>
        <Section title="Liability">
          Shift Change is provided "as is." To the extent permitted by law, we're not liable for indirect damages arising from your use of the platform.
        </Section>
        <Section title="Changes">
          We'll notify you at least 30 days before material changes. Continued use after that means you accept the new terms.
        </Section>
        <Section title="Contact">
          Legal questions: legal@shiftchange.co.
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
