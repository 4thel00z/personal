'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createStore, type StoreApi, useStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { modes, type ThemeMode, type ThemeName, themes } from '@/src/content/themes';

export const THEME_STORAGE_KEY = 'personal-site-theme';

function isTheme(value: string | null | undefined): value is ThemeName {
  return Boolean(value) && (themes as readonly string[]).includes(value as string);
}

function isMode(value: string | null | undefined): value is ThemeMode {
  return Boolean(value) && (modes as readonly string[]).includes(value as string);
}

function getInitialTheme(): ThemeName {
  const fromDom =
    typeof document === 'undefined' ? undefined : document.documentElement.dataset.theme;
  if (isTheme(fromDom)) return fromDom;
  return 'default';
}

function getInitialMode(): ThemeMode {
  const fromDom =
    typeof document === 'undefined' ? undefined : document.documentElement.dataset.mode;
  if (isMode(fromDom)) return fromDom;
  return 'system';
}

function applyToDom(theme: ThemeName, mode: ThemeMode) {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.mode = mode;
}

function prefersDark() {
  if (typeof window === 'undefined') return true;
  return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? true;
}

export interface ThemeState {
  theme: ThemeName;
  mode: ThemeMode;
  setTheme: (theme: ThemeName) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

function createThemeStore() {
  return createStore<ThemeState>()(
    persist(
      (set, get) => ({
        theme: getInitialTheme(),
        mode: getInitialMode(),
        setTheme: (theme) => {
          set({ theme });
          applyToDom(theme, get().mode);
        },
        setMode: (mode) => {
          set({ mode });
          applyToDom(get().theme, mode);
        },
        toggleMode: () => {
          const current = get().mode;
          const effective = current === 'system' ? (prefersDark() ? 'dark' : 'light') : current;
          const next: ThemeMode = effective === 'dark' ? 'light' : 'dark';
          set({ mode: next });
          applyToDom(get().theme, next);
        },
      }),
      {
        name: THEME_STORAGE_KEY,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ theme: state.theme, mode: state.mode }),
        version: 1,
        onRehydrateStorage: () => (state) => {
          if (!state) return;
          const nextTheme = isTheme(state.theme) ? state.theme : getInitialTheme();
          const nextMode = isMode(state.mode) ? state.mode : getInitialMode();

          if (state.mode !== nextMode) state.setMode(nextMode);
          if (state.theme !== nextTheme) state.setTheme(nextTheme);
          applyToDom(nextTheme, nextMode);
        },
      },
    ),
  );
}

const ThemeStoreContext = createContext<StoreApi<ThemeState> | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(() => createThemeStore());

  // Ensure DOM attributes are set even if the initial DOM had no theme/mode.
  useEffect(() => {
    const { theme, mode } = store.getState();
    applyToDom(theme, mode);
  }, [store]);

  return <ThemeStoreContext.Provider value={store}>{children}</ThemeStoreContext.Provider>;
}

export function useThemeStore<T>(selector: (state: ThemeState) => T) {
  const store = useContext(ThemeStoreContext);
  return useStore(store!, selector);
}

export function useEffectiveMode(mode: ThemeMode) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (mode !== 'system') return;
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return;
    const update = () => setIsDark(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, [mode]);

  return useMemo(() => {
    if (mode === 'dark') return 'dark';
    if (mode === 'light') return 'light';
    return isDark ? 'dark' : 'light';
  }, [isDark, mode]);
}
