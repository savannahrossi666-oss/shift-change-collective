import type { ReactNode } from "react";
import { SiteNav } from "./site-nav";
import { SiteFooter } from "./site-footer";

export function PageShell({
  children,
  transparentNav = false,
  hideFooter = false,
}: {
  children: ReactNode;
  transparentNav?: boolean;
  hideFooter?: boolean;
}) {
  return (
    <div className="min-h-screen bg-black text-white antialiased selection:bg-white selection:text-black">
      <SiteNav transparent={transparentNav} />
      <main>{children}</main>
      {!hideFooter && <SiteFooter />}
    </div>
  );
}

export function PageHeader({
  kicker,
  title,
  subtitle,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="border-b border-white/10 pt-32 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        {kicker && (
          <div className="text-[10px] uppercase tracking-[0.4em] text-white/40">{kicker}</div>
        )}
        <h1 className="mt-4 text-4xl md:text-6xl font-light tracking-tight">{title}</h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-base md:text-lg text-white/60 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
