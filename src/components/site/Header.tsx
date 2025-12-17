'use client';

import { Dialog, DialogPanel } from '@headlessui/react';
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { usePrefersReducedMotion } from '@/src/components/motion/motion';
import { openCommandPalette } from '@/src/components/search/CommandPalette';
import { Logo } from '@/src/components/site/Logo';
import { features } from '@/src/config/features';
import { personal } from '@/src/config/personal';
import { customThemes, daisyUiThemes, type ThemeName } from '@/src/content/themes';
import { useEffectiveMode, useThemeStore } from '@/src/stores/themeStore';

type NavItem = {
  name: string;
  href: string;
};

function themeLabel(value: string): string {
  if (value === 'default') return 'Default';
  return value;
}

function NavLink({
  item,
  className,
  onClick,
}: {
  item: NavItem;
  className: string;
  onClick?: () => void;
}) {
  return (
    <Link href={item.href} className={className} onClick={onClick}>
      {item.name}
    </Link>
  );
}

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  usePathname();

  const theme = useThemeStore((s) => s.theme);
  const mode = useThemeStore((s) => s.mode);
  const setTheme = useThemeStore((s) => s.setTheme);
  const toggleMode = useThemeStore((s) => s.toggleMode);
  const effectiveMode = useEffectiveMode(mode);
  const prefersReducedMotion = usePrefersReducedMotion();

  const desktopNav = useMemo<NavItem[]>(() => {
    return personal.nav
      .filter((i) => i.href !== '/blog' || features.blog)
      .map((i) => ({ name: i.label, href: i.href }));
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-canvas/80 backdrop-blur supports-[backdrop-filter]:bg-canvas/60">
      <div className="container-page">
        <nav aria-label="Global" className="flex items-center justify-between py-4">
          <Link
            href="/"
            aria-label="Home"
            className="-m-1.5 p-1.5 flex items-center cursor-pointer"
          >
            <Logo size="4xl" animated className="relative top-px" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {desktopNav.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                className="cursor-pointer text-sm/6 font-semibold text-muted hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent rounded-md"
              />
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {features.search && (
              <button
                type="button"
                onClick={() => openCommandPalette()}
                className="cursor-pointer inline-flex h-10 items-center gap-2 rounded-xl border border-border/60 bg-surface/30 px-3 text-sm font-semibold text-fg shadow-sm hover:bg-surface/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <MagnifyingGlassIcon aria-hidden="true" className="size-4 text-muted" />
                <span className="hidden lg:inline">Search</span>
                <span className="hidden lg:inline-flex items-center gap-1 text-subtle">
                  <kbd className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-border/60 bg-surface/30 font-mono text-[11px]/none">
                    ⌘
                  </kbd>
                  <kbd className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-border/60 bg-surface/30 font-mono text-[11px]/none">
                    K
                  </kbd>
                </span>
              </button>
            )}

            {features.themeSwitcher && (
              <div className="flex items-center gap-2">
                <label className="sr-only" htmlFor="theme-picker">
                  Theme
                </label>
                <select
                  id="theme-picker"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as ThemeName)}
                  className="cursor-pointer h-10 rounded-xl border border-border/60 bg-surface/30 px-3 text-sm font-semibold text-fg shadow-sm hover:bg-surface/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <optgroup label="Custom">
                    {customThemes.map((t) => (
                      <option key={t} value={t}>
                        {themeLabel(t)}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="DaisyUI">
                    {daisyUiThemes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </optgroup>
                </select>

                <button
                  type="button"
                  onClick={toggleMode}
                  className="cursor-pointer inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-surface/30 text-muted shadow-sm hover:bg-surface/40 hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  aria-label={
                    effectiveMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
                  }
                  title={effectiveMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {effectiveMode === 'dark' ? (
                    <SunIcon aria-hidden="true" className="size-5" />
                  ) : (
                    <MoonIcon aria-hidden="true" className="size-5" />
                  )}
                </button>
              </div>
            )}
          </div>

          <motion.button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="cursor-pointer md:hidden -m-2.5 inline-flex items-center justify-center rounded-lg p-2.5 text-muted hover:text-fg hover:bg-surface/30 transition-colors"
            aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
            aria-expanded={mobileMenuOpen}
            whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
          >
            <AnimatePresence initial={false} mode="wait">
              {mobileMenuOpen ? (
                <motion.span
                  key="close"
                  initial={prefersReducedMotion ? false : { opacity: 0, rotate: -90, scale: 0.9 }}
                  animate={
                    prefersReducedMotion ? { opacity: 1 } : { opacity: 1, rotate: 0, scale: 1 }
                  }
                  exit={
                    prefersReducedMotion ? { opacity: 0 } : { opacity: 0, rotate: 90, scale: 0.9 }
                  }
                  transition={
                    prefersReducedMotion ? { duration: 0 } : { duration: 0.18, ease: 'easeOut' }
                  }
                  className="inline-flex"
                >
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={prefersReducedMotion ? false : { opacity: 0, rotate: 90, scale: 0.9 }}
                  animate={
                    prefersReducedMotion ? { opacity: 1 } : { opacity: 1, rotate: 0, scale: 1 }
                  }
                  exit={
                    prefersReducedMotion ? { opacity: 0 } : { opacity: 0, rotate: -90, scale: 0.9 }
                  }
                  transition={
                    prefersReducedMotion ? { duration: 0 } : { duration: 0.18, ease: 'easeOut' }
                  }
                  className="inline-flex"
                >
                  <Bars3Icon aria-hidden="true" className="size-6" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </nav>
      </div>

      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="md:hidden">
        <div className="fixed inset-0 z-50 bg-canvas/50 backdrop-blur-sm" />
        <DialogPanel className="fixed inset-x-0 top-0 z-50 rounded-b-2xl bg-canvas p-6 shadow-xl ring-1 ring-border/50">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="-m-1.5 p-1.5 flex items-center gap-3 cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Logo size="2xl" animated className="relative top-px" />
              <span className="text-sm font-semibold text-fg">{personal.siteTitle}</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="cursor-pointer -m-2.5 rounded-lg p-2.5 text-muted hover:text-fg hover:bg-surface/30"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>

          <div className="mt-6 space-y-1">
            {desktopNav.map((item) => (
              <NavLink
                key={`mobile:${item.href}`}
                item={item}
                className="cursor-pointer block rounded-xl px-3 py-2 text-base/7 font-semibold text-fg hover:bg-surface/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                onClick={() => setMobileMenuOpen(false)}
              />
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2">
            {features.themeSwitcher && (
              <>
                <label className="sr-only" htmlFor="theme-picker-mobile">
                  Theme
                </label>
                <select
                  id="theme-picker-mobile"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as ThemeName)}
                  className="cursor-pointer h-11 flex-1 rounded-xl border border-border/60 bg-surface/30 px-3 text-sm font-semibold text-fg shadow-sm hover:bg-surface/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <optgroup label="Custom">
                    {customThemes.map((t) => (
                      <option key={t} value={t}>
                        {themeLabel(t)}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="DaisyUI">
                    {daisyUiThemes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </optgroup>
                </select>

                <button
                  type="button"
                  onClick={toggleMode}
                  className="cursor-pointer inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 bg-surface/30 text-muted shadow-sm hover:bg-surface/40 hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  aria-label={
                    effectiveMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
                  }
                  title={effectiveMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {effectiveMode === 'dark' ? (
                    <SunIcon aria-hidden="true" className="size-5" />
                  ) : (
                    <MoonIcon aria-hidden="true" className="size-5" />
                  )}
                </button>
              </>
            )}
          </div>

          <div className="mt-6">
            <a
              href={personal.social.find((s) => s.label.toLowerCase() === 'email')?.href ?? '#'}
              className="btn-accent w-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              Email me
            </a>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
