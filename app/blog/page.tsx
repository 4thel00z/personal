import Link from 'next/link';

import { loadAllBlogTags, loadBlogPosts } from '@/app/blog/loadPosts';
import { BlogLayout } from '@/src/components/blog/BlogLayout';
import { BlogSearch } from '@/src/components/blog/BlogSearch';
import { PostCard } from '@/src/components/blog/PostCard';
import { Logo } from '@/src/components/site/Logo';
import { personal } from '@/src/config/personal';

export const metadata = {
  title: 'Blog',
  description: `Posts by ${personal.name}.`,
};

export default async function BlogIndexPage() {
  const posts = await loadBlogPosts();
  const tags = await loadAllBlogTags();

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <BlogLayout title="Blog" description="Notes on product, engineering, and shipping with polish.">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-8">
          <div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-surface/20 shadow-sm">
            <a
              href="/logo-inverted.svg"
              aria-label="Open /logo-inverted.svg"
              className="logo-link-for-dark absolute inset-0 z-10 rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <span className="sr-only">Open /logo-inverted.svg</span>
            </a>
            <a
              href="/logo.svg"
              aria-label="Open /logo.svg"
              className="logo-link-for-light absolute inset-0 z-10 rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <span className="sr-only">Open /logo.svg</span>
            </a>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=2400&q=80"
              alt="A clean workspace with a laptop and notebook"
              className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              loading="eager"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas/75 via-canvas/10 to-transparent"
            />
            <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-canvas/70 px-4 py-3 ring-1 ring-border/60 backdrop-blur">
              <Logo size="lg" />
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-fg">Logo</div>
                <div className="text-xs/6 text-subtle">
                  <span className="logo-for-dark">Open /logo-inverted.svg</span>
                  <span className="logo-for-light">Open /logo.svg</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <BlogSearch />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/blog/tags"
              className="cursor-pointer rounded-full px-3 py-1 text-sm/6 font-semibold ring-1 ring-border/60 text-fg hover:ring-border/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              Browse tags
            </Link>
            <Link
              href="/blog/rss.xml"
              className="cursor-pointer rounded-full px-3 py-1 text-sm/6 font-semibold ring-1 ring-border/60 text-fg hover:ring-border/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              RSS
            </Link>
          </div>
        </div>

        {tags.length ? (
          <div className="mt-8 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tags/${encodeURIComponent(tag)}`}
                className="cursor-pointer rounded-full bg-surface/25 px-3 py-1 text-sm/6 text-muted hover:bg-surface/40 hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                {tag}
              </Link>
            ))}
          </div>
        ) : null}

        <div className="mt-10 grid grid-cols-1 gap-4">
          {featured ? <PostCard post={featured} /> : null}
          {rest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </BlogLayout>
  );
}
