import type React from 'react';

import { SiteFooter } from '@/src/components/site/Footer';
import { SiteHeader } from '@/src/components/site/Header';
import { personal } from '@/src/config/personal';

export function ChangelogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-canvas">
      <SiteHeader />
      <main className="pb-24">
        <section className="mx-auto max-w-5xl px-6 pt-16 pb-8">
          <p className="text-sm/6 font-semibold text-subtle">{personal.siteTitle}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance text-fg sm:text-5xl leading-tight">
            Changelog
          </h1>
          <p className="mt-6 max-w-2xl text-base/7 text-muted leading-relaxed">
            Product updates, improvements, and fixes — shipped continuously.
          </p>
        </section>
        {children}
        <section className="mx-auto max-w-5xl px-6 pt-8 pb-16">
          <div className="panel p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-fg leading-tight">
              Want updates in your inbox?
            </h2>
            <p className="mt-3 max-w-2xl text-base/7 text-muted leading-relaxed">
              Subscribe to get product news and changelog updates. No spam.
            </p>
            <form className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <label htmlFor="changelog-email" className="sr-only">
                Email address
              </label>
              <input
                id="changelog-email"
                name="email"
                type="email"
                required
                placeholder="you@company.com"
                autoComplete="email"
                className="panel-input w-full flex-1 text-base sm:text-sm/6"
              />
              <button
                type="submit"
                className="cursor-pointer inline-flex justify-center rounded-xl bg-accent px-4 py-2 text-sm/6 font-semibold text-surface shadow-sm hover:bg-accentHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-4 text-sm/6 text-subtle">
              We care about your data. Read our{' '}
              <a
                href="/privacy"
                className="cursor-pointer font-semibold text-fg underline underline-offset-4 decoration-subtle/60 hover:decoration-fg/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent rounded-sm"
              >
                privacy policy
              </a>
              .
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
