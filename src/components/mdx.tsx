import Link from 'next/link';
import type React from 'react';
import { CodeBlock } from '@/src/components/mdx/CodeBlock';
import { Logo } from '@/src/components/site/Logo';

function formatDate(value: unknown): string | null {
  if (typeof value !== 'string' || !value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date);
}

export function a(props: React.ComponentPropsWithoutRef<'a'>) {
  const href = typeof props.href === 'string' ? props.href : '';
  const className = `cursor-pointer font-semibold underline underline-offset-4 decoration-subtle/60 hover:text-fg hover:decoration-fg/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent rounded-sm ${props.className ?? ''}`;

  if (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('#')
  ) {
    return <a {...props} className={className} />;
  }

  return (
    <Link href={href} className={className}>
      {props.children}
    </Link>
  );
}

export function h2(props: React.ComponentPropsWithoutRef<'h2'>) {
  return (
    <h2
      {...props}
      className={`mt-10 text-2xl font-semibold tracking-tight text-fg first:mt-0 sm:text-3xl leading-tight ${props.className ?? ''}`}
    />
  );
}

export function h1(props: React.ComponentPropsWithoutRef<'h1'>) {
  return (
    <h1
      {...props}
      className={`mt-10 text-3xl font-semibold tracking-tight text-fg first:mt-0 sm:text-4xl leading-tight ${props.className ?? ''}`}
    />
  );
}

export function h3(props: React.ComponentPropsWithoutRef<'h3'>) {
  return (
    <h3
      {...props}
      className={`mt-8 text-lg font-semibold text-fg first:mt-0 leading-tight ${props.className ?? ''}`}
    />
  );
}

export function p(props: React.ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      {...props}
      className={`mt-4 text-base/7 text-muted leading-relaxed first:mt-0 ${props.className ?? ''}`}
    />
  );
}

export function ul(props: React.ComponentPropsWithoutRef<'ul'>) {
  return (
    <ul
      {...props}
      className={`mt-4 list-disc pl-6 text-muted leading-relaxed first:mt-0 ${props.className ?? ''}`}
    />
  );
}

export function ol(props: React.ComponentPropsWithoutRef<'ol'>) {
  return (
    <ol
      {...props}
      className={`mt-4 list-decimal pl-6 text-muted leading-relaxed first:mt-0 ${props.className ?? ''}`}
    />
  );
}

export function li(props: React.ComponentPropsWithoutRef<'li'>) {
  return <li {...props} className={`mt-2 ${props.className ?? ''}`} />;
}

export function strong(props: React.ComponentPropsWithoutRef<'strong'>) {
  return <strong {...props} className={`font-semibold text-fg ${props.className ?? ''}`} />;
}

export function blockquote(props: React.ComponentPropsWithoutRef<'blockquote'>) {
  return (
    <blockquote
      {...props}
      className={`mt-6 border-l border-border/60 pl-4 text-muted first:mt-0 ${props.className ?? ''}`}
    />
  );
}

export function kbd(props: React.ComponentPropsWithoutRef<'kbd'>) {
  return (
    <kbd
      {...props}
      className={`rounded-md border border-border/60 bg-surface/30 px-1.5 py-0.5 font-mono text-xs text-fg ${props.className ?? ''}`}
    />
  );
}

export function pre(props: React.ComponentPropsWithoutRef<'pre'>) {
  return <CodeBlock {...props} />;
}

export function code(props: React.ComponentPropsWithoutRef<'code'>) {
  return (
    <code
      {...props}
      className={`rounded bg-surface/30 px-1.5 py-0.5 font-mono text-[0.9em] text-fg ${props.className ?? ''}`}
    />
  );
}

export function img(props: React.ComponentPropsWithoutRef<'img'>) {
  const { alt, ...rest } = props;
  const src = typeof rest.src === 'string' ? rest.src : '';

  if (src === '/logo.svg' || src === '/logo-inverted.svg') {
    const label = typeof alt === 'string' && alt.trim() ? alt : undefined;
    const title = typeof rest.title === 'string' ? rest.title : undefined;
    return (
      <div className="mt-6 flex items-center justify-center overflow-hidden rounded-2xl border border-border/50 bg-surface/20 p-8 first:mt-0">
        <Logo size="2xl" className={props.className ?? ''} label={label} title={title} />
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-border/50 bg-surface/20 first:mt-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...rest} alt={alt ?? ''} className={`h-auto w-full ${props.className ?? ''}`} />
    </div>
  );
}

export function article(
  props: React.ComponentPropsWithoutRef<'article'> & {
    date?: string;
    title?: string;
  },
) {
  const dateLabel = formatDate(props.date);
  const id = typeof props.id === 'string' ? props.id : undefined;
  const { children, className, date, title, ...rest } = props;

  return (
    <article
      {...rest}
      id={id}
      className={`relative scroll-mt-24 ${className ?? ''}`}
      data-date={date}
      data-title={title}
    >
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="relative pl-8">
          <div className="absolute left-1 top-2 h-full w-px bg-border/70" aria-hidden="true" />
          <div
            className="absolute left-1 top-2 size-2 -translate-x-1/2 rounded-full bg-accent"
            aria-hidden="true"
          />

          {dateLabel ? (
            <div className="text-sm/6 font-semibold text-subtle">{dateLabel}</div>
          ) : null}

          <div className="mt-3">{children}</div>
        </div>
      </div>
    </article>
  );
}
