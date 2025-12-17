export type SocialLink = {
  label: string;
  href: string;
};

export type NavItem = {
  label: string;
  href: string;
};

export type Project = {
  name: string;
  description: string;
  href: string;
  tech?: string[];
};

export type WorkItem = {
  company: string;
  role: string;
  start: string;
  end: string;
  href?: string;
};

export const personal = {
  name: 'Your Name',
  siteTitle: 'Your Name',
  role: 'Software engineer',
  location: 'City, Country',
  description: 'Personal site featuring blog posts, selected projects, and a short bio.',
  nav: [
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Blog', href: '/blog' },
  ] satisfies NavItem[],
  social: [
    { label: 'GitHub', href: 'https://github.com/your-handle' },
    { label: 'X', href: 'https://x.com/your-handle' },
    { label: 'Email', href: 'mailto:you@example.com' },
  ] satisfies SocialLink[],
  about: {
    headline: `I’m ${'Your Name'}. I build software with taste and restraint.`,
    intro:
      'I care about clarity, performance, and shipping. I like small systems that compose well.',
    body: [
      'This is where you tell your story: what you work on, what you believe, and what you’re exploring right now.',
      'Keep it concrete. Mention the kinds of problems you’ve solved and the kind of work you’re looking for.',
    ],
  },
  work: [
    {
      company: 'Company',
      role: 'Role',
      start: '2024',
      end: 'Present',
      href: 'https://example.com',
    },
    { company: 'Previous Company', role: 'Role', start: '2021', end: '2024' },
  ] satisfies WorkItem[],
  featuredProjects: [
    {
      name: 'Project One',
      description: 'A short, concrete sentence about what it does and who it helps.',
      href: 'https://example.com',
      tech: ['TypeScript', 'Next.js'],
    },
    {
      name: 'Project Two',
      description: 'A short, concrete sentence about the impact or idea.',
      href: 'https://example.com',
      tech: ['Python', 'LLMs'],
    },
  ] satisfies Project[],
} as const;
