import type { Metadata } from 'next';
import { loadProjects } from '@/app/projects/loadProjects';
import { SiteLayout } from '@/src/components/site/SiteLayout';
import { Card } from '@/src/components/ui/Card';
import { SimpleLayout } from '@/src/components/ui/SimpleLayout';
import { features } from '@/src/config/features';
import { personal } from '@/src/config/personal';

export const metadata: Metadata = {
  title: 'Projects',
  description: `Projects by ${personal.name}.`,
};

export default async function ProjectsPage() {
  const projects = features.projectsMdx ? await loadProjects() : [];
  return (
    <SiteLayout>
      <SimpleLayout
        title="Projects"
        intro="A small selection of things I’ve built. If something looks useful, take it, fork it, or reach out."
      >
        <ul
          role="list"
          className="grid grid-cols-1 gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.projectsMdx
            ? projects.map((project) => (
                <Card as="li" key={project.slug}>
                  <Card.Title href={`/projects/${project.slug}`}>{project.meta.title}</Card.Title>
                  <Card.Description>{project.meta.description}</Card.Description>
                  {project.meta.tags?.length ? (
                    <div className="relative z-10 mt-4 flex flex-wrap gap-2">
                      {project.meta.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-surface/25 px-3 py-1 text-xs/5 text-subtle"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <Card.Cta>Read</Card.Cta>
                </Card>
              ))
            : personal.featuredProjects.map((project) => (
                <Card as="li" key={project.name}>
                  <Card.Title
                    href={project.href}
                    linkProps={{ target: '_blank', rel: 'noreferrer' }}
                  >
                    {project.name}
                  </Card.Title>
                  <Card.Description>{project.description}</Card.Description>
                  {project.tech?.length ? (
                    <div className="relative z-10 mt-4 flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-surface/25 px-3 py-1 text-xs/5 text-subtle"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <Card.Cta>Visit</Card.Cta>
                </Card>
              ))}
        </ul>

        {features.projectsMdx ? (
          <p className="mt-10 text-sm/6 text-subtle">
            Projects are authored in MDX under{' '}
            <code className="font-mono">app/projects/projects</code>.
          </p>
        ) : null}
      </SimpleLayout>
    </SiteLayout>
  );
}
