import type React from 'react';
import { SiteFooter } from '@/src/components/site/Footer';
import { SiteHeader } from '@/src/components/site/Header';
import { SiteBackdrop } from '@/src/components/site/SiteBackdrop';

export function SiteLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="relative min-h-dvh">
      <SiteBackdrop />
      <div className="relative flex min-h-dvh flex-col">
        <SiteHeader />
        <main className={className ?? ''}>{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}
