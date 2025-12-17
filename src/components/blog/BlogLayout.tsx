import type React from 'react';

import { SiteFooter } from '@/src/components/site/Footer';
import { SiteHeader } from '@/src/components/site/Header';
import { personal } from '@/src/config/personal';

export function BlogLayout({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="min-h-dvh bg-canvas">
      <SiteHeader />
      <main className="pb-24">
        <section className="mx-auto max-w-5xl px-6 pt-16 pb-10">
          <p className="text-sm/6 font-semibold text-subtle">{personal.siteTitle}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance text-fg sm:text-5xl leading-tight">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base/7 text-muted leading-relaxed">{description}</p>
        </section>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
