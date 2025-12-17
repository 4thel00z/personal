import type { Metadata } from 'next';
import Link from 'next/link';

import { SiteLayout } from '@/src/components/site/SiteLayout';
import { Card } from '@/src/components/ui/Card';
import { Container } from '@/src/components/ui/Container';
import { SimpleLayout } from '@/src/components/ui/SimpleLayout';
import { personal } from '@/src/config/personal';

export const metadata: Metadata = {
  title: 'About',
  description: `About ${personal.name}.`,
};

export default function AboutPage() {
  const email = personal.social.find((s) => s.label.toLowerCase() === 'email')?.href ?? '#';

  return (
    <SiteLayout>
      <SimpleLayout title={personal.about.headline} intro={personal.about.intro}>
        <div className="space-y-16">
          <section className="max-w-2xl space-y-6">
            {personal.about.body.map((p) => (
              <p key={p} className="text-base/7 text-muted leading-relaxed">
                {p}
              </p>
            ))}
          </section>

          <section>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-sm/6 font-semibold text-fg">Work</h2>
              <a href={email} className="text-sm/6 font-semibold text-fg hover:text-accent">
                Contact
              </a>
            </div>

            <ol className="mt-8 space-y-8">
              {personal.work.map((w) => (
                <Card as="li" key={`${w.company}:${w.start}`}>
                  <Card.Title
                    href={w.href}
                    linkProps={w.href ? { target: '_blank', rel: 'noreferrer' } : undefined}
                  >
                    {w.company}
                  </Card.Title>
                  <Card.Eyebrow decorate>
                    {w.role} · {w.start} — {w.end}
                  </Card.Eyebrow>
                  {w.href ? (
                    <p className="relative z-10 mt-2 text-sm/6 text-muted">
                      <Link
                        href={w.href}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-fg"
                      >
                        {w.href}
                      </Link>
                    </p>
                  ) : null}
                </Card>
              ))}
            </ol>
          </section>

          <section>
            <Container size="content" className="px-0">
              <div className="panel p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-fg leading-tight">
                  Want to get in touch?
                </h2>
                <p className="mt-3 max-w-2xl text-base/7 text-muted leading-relaxed">
                  Email is best. I read everything and reply when I can.
                </p>
                <div className="mt-6">
                  <a href={email} className="btn-accent">
                    Email me
                  </a>
                </div>
              </div>
            </Container>
          </section>
        </div>
      </SimpleLayout>
    </SiteLayout>
  );
}
