import Link from 'next/link';
import type React from 'react';
import { features } from '@/src/config/features';
import { personal } from '@/src/config/personal';

const links = [
  { name: 'Home', href: '/', enabled: true },
  { name: 'About', href: '/about', enabled: true },
  { name: 'Projects', href: '/projects', enabled: true },
  { name: 'Blog', href: '/blog', enabled: features.blog },
];

function socialIcon(label: string) {
  if (label.toLowerCase() === 'github') {
    return (props: React.SVGProps<SVGSVGElement>) => (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  if (label.toLowerCase() === 'x' || label.toLowerCase() === 'twitter') {
    return (props: React.SVGProps<SVGSVGElement>) => (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
      </svg>
    );
  }

  if (label.toLowerCase() === 'email') {
    return (props: React.SVGProps<SVGSVGElement>) => (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M1.5 6.75A3.75 3.75 0 0 1 5.25 3h13.5A3.75 3.75 0 0 1 22.5 6.75v10.5A3.75 3.75 0 0 1 18.75 21H5.25A3.75 3.75 0 0 1 1.5 17.25V6.75Zm3.57-.75a2.25 2.25 0 0 0-1.32 1.02l7.64 5.73c.39.29.93.29 1.32 0l7.64-5.73A2.25 2.25 0 0 0 18.93 6H5.07Z" />
      </svg>
    );
  }

  return (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1 14.5v-9l7 4.5-7 4.5Z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-canvas border-t border-border/40">
      <div className="container-page py-16">
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-10 gap-y-3 text-sm">
          {links
            .filter((item) => item.enabled)
            .map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="cursor-pointer font-semibold text-muted hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent rounded-md"
              >
                {item.name}
              </Link>
            ))}
        </nav>

        <div className="mt-10 flex justify-center gap-x-8">
          {personal.social.map((item) => {
            const Icon = socialIcon(item.label);
            return (
              <a
                key={item.label}
                href={item.href}
                className="cursor-pointer text-muted hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent rounded-md"
              >
                <span className="sr-only">{item.label}</span>
                <Icon className="size-6" />
              </a>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-subtle">
          &copy; {new Date().getFullYear()} {personal.siteTitle}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
