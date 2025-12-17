import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getBlogPost, loadBlogPosts } from '@/app/blog/loadPosts';
import { ReadingProgressBar } from '@/src/components/blog/ReadingProgressBar';
import { SiteLayout } from '@/src/components/site/SiteLayout';
import { features } from '@/src/config/features';
import { personal } from '@/src/config/personal';
import { formatDate } from '@/src/lib/formatDate';

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const posts = await loadBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  try {
    const post = await getBlogPost(slug);
    const title = post.meta.title;
    const description = post.meta.description;
    return {
      title,
      description,
      openGraph: {
        type: 'article',
        title,
        description,
      },
    };
  } catch {
    return { title: 'Post not found' };
  }
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  let post: Awaited<ReturnType<typeof getBlogPost>> | null = null;
  try {
    post = await getBlogPost(slug);
  } catch {
    notFound();
  }

  if (!post) {
    notFound();
  }

  const { Content, meta } = post;

  return (
    <SiteLayout>
      {features.blogReadingProgress ? (
        <ReadingProgressBar targetId="blog-article" topOffsetPx={72} />
      ) : null}

      <main className="pb-24">
        <section className="mx-auto max-w-3xl px-6 pt-16 pb-10">
          {features.blogBreadcrumbs ? (
            <nav aria-label="Breadcrumb" className="text-sm/6 text-subtle">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <li>
                  <Link href="/" className="font-semibold text-muted hover:text-fg">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-subtle">
                  /
                </li>
                <li>
                  <Link href="/blog" className="font-semibold text-muted hover:text-fg">
                    Blog
                  </Link>
                </li>
                <li aria-hidden="true" className="text-subtle">
                  /
                </li>
                <li className="font-semibold text-fg">{meta.title}</li>
              </ol>
            </nav>
          ) : (
            <p className="text-sm/6 font-semibold text-subtle">{personal.siteTitle}</p>
          )}

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance text-fg sm:text-5xl leading-tight">
            {meta.title}
          </h1>
          <p className="mt-4 text-base/7 text-muted leading-relaxed">{meta.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm/6 text-subtle">
            <span>{formatDate(meta.date)}</span>
            {features.blogReadingTime && meta.readingTimeMinutes ? (
              <>
                <span aria-hidden="true">·</span>
                <span>{`~${meta.readingTimeMinutes} min read`}</span>
              </>
            ) : null}
            {meta.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tags/${encodeURIComponent(tag)}`}
                className="cursor-pointer hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent rounded-md"
              >
                {tag}
              </Link>
            ))}
          </div>
        </section>

        <article id="blog-article" className="mx-auto max-w-3xl px-6">
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
