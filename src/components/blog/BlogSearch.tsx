'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { search } from '@/mdx/siteSearch.mjs';

type Result = {
  url: string;
  title: string;
  pageTitle?: string;
  kind?: 'blog' | 'changelog' | 'project';
};

function normalizeHref(href: string): string {
  return href.replace(/\.mdx(?=$|#)/, '');
}

function dedupeResults(items: Result[]): Result[] {
  const seen = new Set<string>();
  const out: Result[] = [];
  for (const item of items) {
    if (seen.has(item.url)) continue;
    seen.add(item.url);
    out.push(item);
  }
  return out;
}

export function BlogSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);

  const trimmed = query.trim();
  const isActive = trimmed.length >= 2;

  const label = useMemo(() => {
    if (!trimmed) return 'Search posts';
    if (trimmed.length < 2) return 'Type 2+ characters…';
    return `${results.length} result${results.length === 1 ? '' : 's'}`;
  }, [trimmed, results.length]);

  useEffect(() => {
    if (!isActive) {
      setResults([]);
      return;
    }

    const id = setTimeout(() => {
      try {
        const next = dedupeResults(
          (search(trimmed, { limit: 10 }) as Result[]).filter((r) => r.kind === 'blog'),
        );
        setResults(next);
      } catch {
        setResults([]);
      }
    }, 120);

    return () => clearTimeout(id);
  }, [isActive, trimmed]);

  return (
    <div className="panel p-6">
      <label className="text-sm/6 font-semibold text-fg" htmlFor="blog-search">
        {label}
      </label>
      <input
        id="blog-search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search…"
        className="panel-input mt-3 w-full"
        autoComplete="off"
        spellCheck={false}
      />

      {results.length ? (
        <ul className="mt-4 divide-y divide-border/40">
          {results.map((r) => (
            <li key={r.url} className="py-3">
              <Link href={normalizeHref(r.url)} className="block cursor-pointer">
                <div className="text-sm/6 font-semibold text-fg hover:underline underline-offset-4">
                  {r.pageTitle ? `${r.pageTitle} — ${r.title}` : r.title}
                </div>
                <div className="mt-1 text-xs/6 text-subtle">{normalizeHref(r.url)}</div>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
