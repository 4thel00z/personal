'use client';

import { Dialog, DialogPanel } from '@headlessui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { search } from '@/mdx/siteSearch.mjs';

type Result = {
  url: string;
  title: string;
  pageTitle?: string;
  kind?: 'blog' | 'changelog' | 'project';
  baseUrl?: string;
};

function normalizeHref(href: string, kind?: Result['kind']): string {
  if (kind === 'blog' || kind === 'project') {
    return href.replace(/\.mdx(?=$|#)/, '');
  }
  return href;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
  return target.isContentEditable;
}

function groupResults(results: Result[]): Array<{ label: string; items: Result[] }> {
  const blog = results.filter((r) => r.kind === 'blog');
  const projects = results.filter((r) => r.kind === 'project');
  const changelog = results.filter((r) => r.kind === 'changelog');

  const groups: Array<{ label: string; items: Result[] }> = [];
  if (blog.length) groups.push({ label: 'Blog', items: blog });
  if (projects.length) groups.push({ label: 'Projects', items: projects });
  if (changelog.length) groups.push({ label: 'Changelog', items: changelog });
  return groups;
}

function getResultTitle(r: Result): string {
  if (r.kind === 'changelog') return r.pageTitle ?? r.title;
  return r.pageTitle ? `${r.pageTitle} — ${r.title}` : r.title;
}

function dedupeResults(items: Result[]): Result[] {
  const seen = new Set<string>();
  const out: Result[] = [];
  for (const item of items) {
    const key = item.url;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

export function openCommandPalette() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('personal-site:command-palette-open'));
}

export function CommandPalette() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const trimmed = query.trim();
  const isActive = trimmed.length >= 2;

  const groups = useMemo(() => groupResults(results), [results]);
  const flatResults = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      const isK = key === 'k';
      const isCmdOrCtrl = event.metaKey || event.ctrlKey;

      if (isCmdOrCtrl && isK) {
        if (isTypingTarget(event.target)) return;
        event.preventDefault();
        setOpen(true);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const key = event.key.toLowerCase();

    if (key === 'escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (key === 'arrowdown') {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(0, flatResults.length - 1)));
      return;
    }

    if (key === 'arrowup') {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
      return;
    }

    if (key === 'enter') {
      if (!flatResults.length) return;
      event.preventDefault();
      const hit = flatResults[activeIndex];
      if (!hit) return;
      setOpen(false);
      setQuery('');
      setResults([]);
      setActiveIndex(0);
      router.push(normalizeHref(hit.url, hit.kind));
    }
  }

  useEffect(() => {
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener('personal-site:command-palette-open', onOpen);
    return () => window.removeEventListener('personal-site:command-palette-open', onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (!isActive) {
      setResults([]);
      setActiveIndex(0);
      return;
    }

    const id = setTimeout(() => {
      try {
        const next = dedupeResults(search(trimmed, { limit: 20 }) as Result[]);
        setResults(next);
        setActiveIndex(0);
      } catch {
        setResults([]);
        setActiveIndex(0);
      }
    }, 120);

    return () => clearTimeout(id);
  }, [isActive, open, trimmed]);

  useEffect(() => {
    if (!open) return;
    const activeEl = document.getElementById(`command-palette-item-${activeIndex}`);
    activeEl?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const hint = useMemo(() => {
    if (!trimmed) return 'Search blog + projects…';
    if (trimmed.length < 2) return 'Type 2+ characters…';
    return `${results.length} result${results.length === 1 ? '' : 's'}`;
  }, [results.length, trimmed]);

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <div className="fixed inset-0 bg-canvas/70 backdrop-blur-sm" />

      <div className="fixed inset-0 overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto max-w-2xl">
          <DialogPanel className="panel shadow-xl shadow-black/20">
            <div className="border-b border-border/50 px-6 py-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm/6 font-semibold text-fg">Search</div>
                <div className="text-xs/6 text-subtle">
                  <kbd className="rounded-md border border-border/60 bg-surface/30 px-1.5 py-0.5 font-mono">
                    ⌘K
                  </kbd>{' '}
                  <span className="hidden sm:inline">or</span>{' '}
                  <kbd className="rounded-md border border-border/60 bg-surface/30 px-1.5 py-0.5 font-mono">
                    Ctrl K
                  </kbd>
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="command-palette-input" className="sr-only">
                  Search
                </label>
                <input
                  ref={inputRef}
                  id="command-palette-input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search…"
                  className="panel-input w-full"
                  autoComplete="off"
                  spellCheck={false}
                />
                <div className="mt-2 text-xs/6 text-subtle">{hint}</div>
              </div>
            </div>

            <div className="max-h-[min(60vh,36rem)] overflow-y-auto px-3 py-3">
              {groups.length ? (
                <div className="space-y-4">
                  {groups.map((group) => (
                    <div key={group.label}>
                      <div className="px-3 text-xs/6 font-semibold tracking-wide text-subtle uppercase">
                        {group.label}
                      </div>
                      <ul className="mt-2 space-y-1">
                        {group.items.map((r) => {
                          const index = flatResults.findIndex((x) => x.url === r.url);
                          const active = index === activeIndex;
                          const title = getResultTitle(r);
                          const href = normalizeHref(r.url, r.kind);
                          return (
                            <li
                              key={r.url}
                              id={active ? `command-palette-item-${index}` : undefined}
                            >
                              <Link
                                href={href}
                                onClick={() => {
                                  setOpen(false);
                                  setQuery('');
                                  setResults([]);
                                  setActiveIndex(0);
                                }}
                                className={`block cursor-pointer rounded-xl px-3 py-2 ${
                                  active ? 'bg-surface/40' : 'hover:bg-surface/25'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="min-w-0">
                                    <div className="truncate text-sm/6 font-semibold text-fg">
                                      {title}
                                    </div>
                                    <div className="truncate text-xs/6 text-subtle">{href}</div>
                                  </div>
                                  <span className="shrink-0 rounded-full bg-surface/25 px-2 py-0.5 text-xs/6 text-subtle">
                                    {r.kind === 'changelog'
                                      ? 'Changelog'
                                      : r.kind === 'project'
                                        ? 'Project'
                                        : 'Blog'}
                                  </span>
                                </div>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-10 text-center text-sm/6 text-subtle">
                  {trimmed.length >= 2 ? 'No results.' : 'Start typing to search.'}
                </div>
              )}
            </div>

            <div className="border-t border-border/50 px-6 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs/6 text-subtle">
                <div>
                  <kbd className="rounded-md border border-border/60 bg-surface/30 px-1.5 py-0.5 font-mono">
                    ↑
                  </kbd>{' '}
                  <kbd className="rounded-md border border-border/60 bg-surface/30 px-1.5 py-0.5 font-mono">
                    ↓
                  </kbd>{' '}
                  to navigate,{' '}
                  <kbd className="rounded-md border border-border/60 bg-surface/30 px-1.5 py-0.5 font-mono">
                    Enter
                  </kbd>{' '}
                  to open
                </div>
                <div>
                  <kbd className="rounded-md border border-border/60 bg-surface/30 px-1.5 py-0.5 font-mono">
                    Esc
                  </kbd>{' '}
                  to close
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
