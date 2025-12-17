import Link from 'next/link';

import { loadBlogPosts } from '@/app/blog/loadPosts';
import { loadProjects } from '@/app/projects/loadProjects';
import { SiteLayout } from '@/src/components/site/SiteLayout';
import { Card } from '@/src/components/ui/Card';
import { Container } from '@/src/components/ui/Container';
import { Section } from '@/src/components/ui/Section';
import { features } from '@/src/config/features';
import { personal } from '@/src/config/personal';
import { formatDate } from '@/src/lib/formatDate';

export default async function Home() {
  const posts = await loadBlogPosts();
  const latestPosts = posts.slice(0, 3);

  const projects = features.projectsMdx ? await loadProjects() : [];
  const featuredProjects = features.projectsMdx
    ? projects.filter((p) => p.meta.featured).slice(0, 4)
    : [];

  return (
    <SiteLayout>
      <div id="top" />

      <section className="pt-16 pb-12">
        <Container size="content">
          <div className="max-w-2xl">
            <p className="text-sm/6 font-semibold text-subtle">
              {personal.role} · {personal.location}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-fg sm:text-5xl leading-tight">
              {personal.name}
            </h1>
            <p className="mt-6 text-base/7 text-muted leading-relaxed">{personal.description}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {personal.social.map((s) => (
                <a key={s.label} href={s.href} className="btn-secondary">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container size="content">
          <div className="space-y-16">
            <Section title="Blog">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm/6 text-muted">Latest posts</p>
                <Link href="/blog" className="text-sm/6 font-semibold text-fg hover:text-accent">
                  All posts
                </Link>
              </div>

              <ol className="mt-8 space-y-10">
                {latestPosts.map((post) => (
                  <Card as="li" key={post.slug}>
                    <Card.Title href={`/blog/${post.slug}`}>{post.meta.title}</Card.Title>
                    <Card.Eyebrow as="time" dateTime={post.meta.date} decorate>
                      {formatDate(post.meta.date)}
                    </Card.Eyebrow>
                    <Card.Description>{post.meta.description}</Card.Description>
                    <div className="relative z-10 mt-4 flex flex-wrap gap-2">
                      {post.meta.tags.slice(0, 4).map((tag) => (
                        <Link
                          key={tag}
                          href={`/blog/tags/${encodeURIComponent(tag)}`}
                          className="rounded-full bg-surface/25 px-3 py-1 text-xs/5 text-muted hover:bg-surface/40 hover:text-fg"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                    <Card.Cta>Read</Card.Cta>
                  </Card>
                ))}
              </ol>
            </Section>

            <Section title="Projects">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm/6 text-muted">Selected work</p>
                <Link
                  href="/projects"
                  className="text-sm/6 font-semibold text-fg hover:text-accent"
                >
                  All projects
                </Link>
              </div>

              <ul className="mt-8 grid grid-cols-1 gap-x-12 gap-y-12 sm:grid-cols-2">
                {features.projectsMdx
                  ? featuredProjects.map((project) => (
                      <Card as="li" key={project.slug}>
                        <Card.Title href={`/projects/${project.slug}`}>
                          {project.meta.title}
                        </Card.Title>
                        <Card.Description>{project.meta.description}</Card.Description>
                        {project.meta.tags?.length ? (
                          <div className="relative z-10 mt-4 flex flex-wrap gap-2">
                            {project.meta.tags.slice(0, 4).map((t) => (
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
            </Section>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
