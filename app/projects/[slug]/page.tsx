import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getProject, loadProjects } from '@/app/projects/loadProjects';
import { SiteLayout } from '@/src/components/site/SiteLayout';
import { features } from '@/src/config/features';

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  if (!features.projectsMdx) return [];
  const projects = await loadProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  try {
    const project = await getProject(slug);
    return {
      title: project.meta.title,
      description: project.meta.description,
    };
  } catch {
    return { title: 'Project not found' };
  }
}

export default async function ProjectPage(props: { params: Promise<{ slug: string }> }) {
  if (!features.projectsMdx) notFound();

  const { slug } = await props.params;

  let project: Awaited<ReturnType<typeof getProject>> | null = null;
  try {
    project = await getProject(slug);
  } catch {
    notFound();
  }

  if (!project) notFound();

  const { Content, meta } = project;

  return (
    <SiteLayout>
      <main className="pb-24">
        <section className="mx-auto max-w-3xl px-6 pt-16 pb-10">
          <nav aria-label="Breadcrumb" className="text-sm/6 text-subtle">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <li>
                <Link href="/" className="font-semibold text-muted hover:text-fg">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/projects" className="font-semibold text-muted hover:text-fg">
                  Projects
                </Link>
              </li>
            </ol>
          </nav>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance text-fg sm:text-5xl leading-tight">
            {meta.title}
          </h1>
          <p className="mt-4 text-base/7 text-muted leading-relaxed">{meta.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm/6">
            {meta.href ? (
              <a href={meta.href} target="_blank" rel="noreferrer" className="btn-secondary">
                Visit
              </a>
            ) : null}
            {meta.repo ? (
              <a href={meta.repo} target="_blank" rel="noreferrer" className="btn-secondary">
                Repo
              </a>
            ) : null}
          </div>
        </section>

        <article className="mx-auto max-w-3xl px-6">
          <div className="panel p-8 sm:p-10">
            <div className="max-w-none">
              <Content />
            </div>
          </div>
        </article>
      </main>
    </SiteLayout>
  );
}
