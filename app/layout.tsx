import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

import { CommandPalette } from '@/src/components/search/CommandPalette';
import { personal } from '@/src/config/personal';
import { type ThemeMode, type ThemeName, themes } from '@/src/content/themes';
import { THEME_STORAGE_KEY, ThemeProvider } from '@/src/stores/themeStore';

export const metadata: Metadata = {
  title: {
    default: personal.siteTitle,
    template: `%s · ${personal.siteTitle}`,
  },
  description: personal.description,
};

function safeTheme(value: string | undefined) {
  if (value && (themes as readonly string[]).includes(value)) return value as ThemeName;
  return 'default' as ThemeName;
}

function safeMode(value: string | undefined) {
  if (value === 'dark' || value === 'light' || value === 'system') return value as ThemeMode;
  return 'system' as ThemeMode;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = safeTheme(process.env.NEXT_PUBLIC_THEME);
  const mode = safeMode(process.env.NEXT_PUBLIC_MODE);

  return (
    <html lang="en" data-theme={theme} data-mode={mode} suppressHydrationWarning>
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
        >{`(function(){try{var raw=localStorage.getItem(${JSON.stringify(
          THEME_STORAGE_KEY,
        )});if(!raw)return;var parsed=JSON.parse(raw)||{};var state=parsed.state||parsed;var t=state.theme;var m=state.mode;var el=document.documentElement;if(t)el.dataset.theme=t;if(m)el.dataset.mode=m;}catch(e){}})();`}</Script>
      </head>
      <body className="antialiased bg-canvas text-fg">
        <ThemeProvider>
          {children}
          <CommandPalette />
        </ThemeProvider>
      </body>
    </html>
  );
}
