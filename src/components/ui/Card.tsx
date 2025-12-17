import Link from 'next/link';
import type React from 'react';
import { cn } from '@/src/lib/cn';

function ChevronRightIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6.75 5.75 9.25 8l-2.5 2.25"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Card<T extends React.ElementType = 'div'>({
  as,
  className,
  children,
  ...props
}: Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'className'> & {
  as?: T;
  className?: string;
}) {
  const Component = as ?? 'div';

  return (
    <Component
      // @ts-expect-error - generic polymorphic component
      {...props}
      className={cn(className, 'group relative flex flex-col items-start')}
    >
      {children}
    </Component>
  );
}

Card.Link = function CardLink({ children, ...props }: React.ComponentPropsWithoutRef<typeof Link>) {
  return (
    <>
      <div className="absolute -inset-x-4 -inset-y-6 z-0 scale-95 rounded-2xl bg-surface/25 opacity-0 shadow-sm ring-1 ring-border/50 transition group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6" />
      <Link {...props}>
        <span className="absolute -inset-x-4 -inset-y-6 z-20 rounded-2xl sm:-inset-x-6" />
        <span className="relative z-10">{children}</span>
      </Link>
    </>
  );
};

Card.Title = function CardTitle<T extends React.ElementType = 'h2'>({
  as,
  href,
  linkProps,
  children,
  ...props
}: Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'href'> & {
  as?: T;
  href?: string;
  linkProps?: Omit<React.ComponentPropsWithoutRef<typeof Link>, 'href' | 'children'>;
}) {
  const Component = as ?? 'h2';

  return (
    <Component
      // @ts-expect-error - generic polymorphic component
      {...props}
      className="text-base font-semibold tracking-tight text-fg"
    >
      {href ? (
        <Card.Link href={href} {...linkProps}>
          {children}
        </Card.Link>
      ) : (
        children
      )}
    </Component>
  );
};

Card.Description = function CardDescription({ children }: { children: React.ReactNode }) {
  return <p className="relative z-10 mt-2 text-sm/6 text-muted">{children}</p>;
};

Card.Cta = function CardCta({ children }: { children: React.ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className="relative z-10 mt-4 flex items-center text-sm/6 font-semibold text-accent"
    >
      {children}
      <ChevronRightIcon className="ml-1 size-4 stroke-current" />
    </div>
  );
};

Card.Eyebrow = function CardEyebrow<T extends React.ElementType = 'p'>({
  as,
  decorate = false,
  className,
  children,
  ...props
}: Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'decorate'> & {
  as?: T;
  decorate?: boolean;
}) {
  const Component = as ?? 'p';

  return (
    <Component
      // @ts-expect-error - generic polymorphic component
      {...props}
      className={cn(
        className,
        'relative z-10 order-first mb-3 flex items-center text-sm/6 text-subtle',
        decorate && 'pl-3.5',
      )}
    >
      {decorate && (
        <span className="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
          <span className="h-4 w-0.5 rounded-full bg-border/80" />
        </span>
      )}
      {children}
    </Component>
  );
};
