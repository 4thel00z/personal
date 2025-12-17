import { readdir } from 'node:fs/promises';
import path from 'node:path';
import type { ComponentType } from 'react';

export type ProjectMeta = {
  title: string;
  description: string;
  href?: string;
  repo?: string;
  tags?: string[];
  featured?: boolean;
};

export type ProjectSummary = {
  slug: string;
  meta: ProjectMeta;
};

type ProjectModule = {
  default: ComponentType<Record<string, never>>;
  meta?: unknown;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeMeta(meta: unknown, slug: string): ProjectMeta {
  if (!isPlainObject(meta)) {
    throw new Error(`Project "${slug}" is missing a valid exported meta object.`);
  }

  const title = typeof meta.title === 'string' ? meta.title : '';
  const description = typeof meta.description === 'string' ? meta.description : '';
  const href = typeof meta.href === 'string' ? meta.href : undefined;
  const repo = typeof meta.repo === 'string' ? meta.repo : undefined;
  const featured = typeof meta.featured === 'boolean' ? meta.featured : false;
  const tags = Array.isArray(meta.tags)
    ? meta.tags.filter((t) => typeof t === 'string')
    : undefined;

  if (!title || !description) {
    throw new Error(
      `Project "${slug}" meta must include { title, description } as non-empty strings.`,
    );
  }

  return {
    title,
    description,
    href,
    repo,
    featured,
    tags: tags?.map((t) => t.trim()).filter(Boolean),
  };
}

function projectsDirAbsolutePath(): string {
  return path.join(process.cwd(), 'app', 'projects', 'projects');
}

function slugFromFilename(filename: string): string {
  return filename.replace(/\.mdx$/, '');
}

async function listProjectFiles(): Promise<string[]> {
  const files = await readdir(projectsDirAbsolutePath());
  return files.filter((file) => file.endsWith('.mdx')).sort((a, b) => a.localeCompare(b));
}

async function importProjectModule(filename: string): Promise<ProjectModule> {
  const mod = await import(
    /* webpackInclude: /\.mdx$/ */
    `./projects/${filename}`
  );
  return mod as ProjectModule;
}

export async function loadProjects(): Promise<ProjectSummary[]> {
  const files = await listProjectFiles();
  const items = await Promise.all(
    files.map(async (filename) => {
      const slug = slugFromFilename(filename);
      const mod = await importProjectModule(filename);
      const meta = normalizeMeta(mod.meta, slug);
      return { slug, meta };
    }),
  );

  return items.sort((a, b) => {
    const af = a.meta.featured ? 1 : 0;
    const bf = b.meta.featured ? 1 : 0;
    if (af !== bf) return bf - af;
    return a.meta.title.localeCompare(b.meta.title);
  });
}

export async function getProject(slug: string): Promise<{
  slug: string;
  meta: ProjectMeta;
  Content: ComponentType<Record<string, never>>;
}> {
  const safeSlug = slug.replace(/[^a-z0-9-]/gi, '');
  const filename = `${safeSlug}.mdx`;

  const mod = await importProjectModule(filename);
  if (typeof mod.default !== 'function') {
    throw new Error(`Project "${slug}" does not have a default MDX export.`);
  }

  const meta = normalizeMeta(mod.meta, safeSlug);
  return { slug: safeSlug, meta, Content: mod.default };
}
