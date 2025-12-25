'use client';

import { CheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import type React from 'react';
import { useMemo, useRef, useState } from 'react';

function inferLanguageFromChildren(children: React.ReactNode): string | null {
  const kids = Array.isArray(children) ? children : [children];
  for (const child of kids) {
    if (!child) continue;
    if (typeof child !== 'object') continue;
    if (!('type' in child) || !('props' in child)) continue;

    const el = child as any;
    const isCodeTag = el.type === 'code';
    if (!isCodeTag) continue;

    const className = typeof el.props?.className === 'string' ? el.props.className : '';
    const m = className.match(/(?:^|\\s)language-([a-z0-9_-]+)(?:\\s|$)/i);
    if (m?.[1]) return m[1].toLowerCase();

    const dataLang =
      typeof el.props?.['data-language'] === 'string' ? el.props['data-language'] : '';
    if (dataLang) return dataLang.toLowerCase();
  }

  return null;
}

function trimOneTrailingNewline(value: string) {
  return value.endsWith('\\n') ? value.slice(0, -1) : value;
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers / denied permission.
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.top = '0';
      textarea.style.left = '0';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  }
}

export function CodeBlock(props: React.ComponentPropsWithoutRef<'pre'>) {
  const { children, className, ...rest } = props;
  const preRef = useRef<HTMLPreElement | null>(null);
  const [copied, setCopied] = useState(false);

  const language = useMemo(() => inferLanguageFromChildren(children), [children]);

  async function onCopy() {
    const pre = preRef.current;
    if (!pre) return;

    const codeText = pre.querySelector('code')?.textContent ?? pre.textContent ?? '';
    const cleaned = trimOneTrailingNewline(codeText);
    if (!cleaned) return;

    const ok = await copyText(cleaned);
    if (!ok) return;

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div
      className={`group mt-6 overflow-hidden rounded-xl border border-border/50 bg-surface/20 first:mt-0 ${className ?? ''}`}
    >
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="min-w-0">
          {language ? (
            <span className="text-xs/5 font-semibold tracking-wide text-subtle uppercase">
              {language}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onCopy}
          className="cursor-pointer inline-flex h-8 items-center gap-1.5 rounded-lg border border-border/60 bg-surface/30 px-2.5 text-xs font-semibold text-fg shadow-sm opacity-0 transition-opacity hover:bg-surface/45 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent group-hover:opacity-100 group-focus-within:opacity-100"
          aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
        >
          {copied ? (
            <CheckIcon aria-hidden="true" className="size-4 text-muted" />
          ) : (
            <ClipboardDocumentIcon aria-hidden="true" className="size-4 text-muted" />
          )}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <pre {...rest} ref={preRef} className="overflow-x-auto px-4 pb-4 pt-3 text-sm text-fg">
        {children}
      </pre>
    </div>
  );
}


