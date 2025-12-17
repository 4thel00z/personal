import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { ComponentType } from 'react';

import { features } from '@/src/config/features';

export type BlogAuthor = {
  name: string;
  href?: string;
};

export type BlogPostMeta = {
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  tags: string[];
  image?: string;
  authors?: BlogAuthor[];
  readingTimeMinutes?: number;
};

export type BlogPostSummary = {
  slug: string;
  meta: BlogPostMeta;
};

type BlogPostModule = {
  default: ComponentType<Record<string, never>>;
  meta?: unknown;
};

function slugFromFilename(filename: string): string {
  return filename.replace(/\.mdx$/, '');
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeMeta(meta: unknown, slug: string): BlogPostMeta {
  if (!isPlainObject(meta)) {
    throw new Error(`Blog post "${slug}" is missing a valid exported meta object.`);
  }

  const title = typeof meta.title === 'string' ? meta.title : '';
  const description = typeof meta.description === 'string' ? meta.description : '';
  const date = typeof meta.date === 'string' ? meta.date : '';
  const tags = Array.isArray(meta.tags) ? meta.tags.filter((t) => typeof t === 'string') : [];
  const image = typeof meta.image === 'string' ? meta.image : undefined;

  const authors = Array.isArray(meta.authors)
    ? meta.authors
        .filter((a) => isPlainObject(a) && typeof a.name === 'string')
        .map((a) => ({
          name: String(a.name),
          href: typeof a.href === 'string' ? a.href : undefined,
        }))
    : undefined;

  if (!title || !description || !date) {
    throw new Error(
      `Blog post "${slug}" meta must include { title, description, date } as non-empty strings.`,
    );
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Blog post "${slug}" meta.date must be YYYY-MM-DD (got "${date}").`);
  }

  return {
    title,
    description,
    date,
    tags: Array.from(new Set(tags.map((t) => t.trim()).filter(Boolean))).sort((a, b) =>
      a.localeCompare(b),
    ),
    image,
    authors,
  };
}

function postsDirAbsolutePath(): string {
  return path.join(process.cwd(), 'app', 'blog', 'posts');
}

function estimateReadingTimeMinutes(source: string): number | null {
  const cleaned = source
    // remove imports
    .replaceAll(/^import[\s\S]*?;$/gm, '')
    // remove exported meta blocks
    .replaceAll(/export\s+const\s+meta\s*=\s*\{[\s\S]*?\}\s*;?/g, '')
    // remove fenced code blocks
    .replaceAll(/```[\s\S]*?```/g, '')
    // simplify markdown links: [text](url) -> text
    .replaceAll(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    // strip JSX/HTML tags
    .replaceAll(/<\/?[^>]+>/g, ' ')
    .trim();

  const words = cleaned.match(/[A-Za-z0-9]+(?:'[A-Za-z0-9]+)?/g)?.length ?? 0;
  if (words <= 0) return null;
  return Math.max(1, Math.ceil(words / 200));
}

async function readingTimeMinutesForFile(filename: string): Promise<number | null> {
  if (!features.blogReadingTime) return null;
  const abs = path.join(postsDirAbsolutePath(), filename);
  const source = await readFile(abs, 'utf8');
  return estimateReadingTimeMinutes(source);
}

async function listPostFiles(): Promise<string[]> {
  const files = await readdir(postsDirAbsolutePath());
  return files.filter((file) => file.endsWith('.mdx')).sort((a, b) => a.localeCompare(b));
}

async function importPostModule(filename: string): Promise<BlogPostModule> {
  // webpackInclude ensures we only bundle mdx files from this folder.
  const mod = await import(
    /* webpackInclude: /\.mdx$/ */
    `./posts/${filename}`
  );
  return mod as BlogPostModule;
}

export async function loadBlogPosts(): Promise<BlogPostSummary[]> {
  const files = await listPostFiles();
  const modules: BlogPostSummary[] = await Promise.all(
    files.map(async (filename) => {
      const slug = slugFromFilename(filename);
      const mod = await importPostModule(filename);
      const meta = normalizeMeta(mod.meta, slug);
      return {
        slug,
        meta: {
          ...meta,
          readingTimeMinutes: (await readingTimeMinutesForFile(filename)) ?? undefined,
        },
      };
    }),
  );

  return modules.sort((a, b) => {
    const byDate = b.meta.date.localeCompare(a.meta.date);
    if (byDate !== 0) return byDate;
    return a.meta.title.localeCompare(b.meta.title);
  });
}

export async function getBlogPost(slug: string): Promise<{
  slug: string;
  meta: BlogPostMeta;
  Content: ComponentType<Record<string, never>>;
}> {
  const safeSlug = slug.replace(/[^a-z0-9-]/gi, '');
  const filename = `${safeSlug}.mdx`;

  const mod = await importPostModule(filename);
  if (typeof mod.default !== 'function') {
    throw new Error(`Blog post "${slug}" does not have a default MDX export.`);
  }

  const meta = normalizeMeta(mod.meta, safeSlug);
  const readingTimeMinutes = await readingTimeMinutesForFile(filename);
  return {
    slug: safeSlug,
    meta: {
      ...meta,
      readingTimeMinutes: readingTimeMinutes ?? undefined,
    },
    Content: mod.default,
  };
}

export async function loadAllBlogTags(): Promise<string[]> {
  const posts = await loadBlogPosts();
  const tags = posts.flatMap((p) => p.meta.tags);
  return Array.from(new Set(tags)).sort((a, b) => a.localeCompare(b));
}
