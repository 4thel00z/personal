import type React from 'react';
import { Container } from '@/src/components/ui/Container';

export function SimpleLayout({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children?: React.ReactNode;
}) {
  return (
    <Container className="pt-16 pb-24" size="content">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight text-fg sm:text-5xl leading-tight">
          {title}
        </h1>
        <p className="mt-6 text-base/7 text-muted leading-relaxed">{intro}</p>
      </header>
      {children ? <div className="mt-16 sm:mt-20">{children}</div> : null}
    </Container>
  );
}
