import Link from 'next/link';

import { loadBlogPosts } from '@/app/blog/loadPosts';
import { BlogLayout } from '@/src/components/blog/BlogLayout';

export const metadata = {
  title: 'Blog tags',
  description: 'Browse all blog tags.',
};

export default async function BlogTagsIndexPage() {
  const posts = await loadBlogPosts();
  const counts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.meta.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  const tags = Array.from(counts.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([tag, count]) => ({ tag, count }));

  return (
    <BlogLayout title="Tags" description="Browse posts by topic.">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/blog"
            className="cursor-pointer rounded-full px-3 py-1 text-sm/6 font-semibold ring-1 ring-border/60 text-fg hover:ring-border/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            Back to blog
          </Link>
          <Link
            href="/blog/rss.xml"
            className="cursor-pointer rounded-full px-3 py-1 text-sm/6 font-semibold ring-1 ring-border/60 text-fg hover:ring-border/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            RSS
          </Link>
        </div>

        <div className="mt-10">
          {tags.length ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {tags.map(({ tag, count }) => (
                <Link
                  key={tag}
                  href={`/blog/tags/${encodeURIComponent(tag)}`}
                  className="cursor-pointer panel panel-hover flex items-center justify-between gap-3 p-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent rounded-2xl"
                >
                  <span className="font-semibold text-fg">{tag}</span>
                  <span className="text-sm/6 text-subtle">{count}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="panel p-8">
              <p className="text-muted">No tags yet.</p>
            </div>
          )}
        </div>
      </div>
    </BlogLayout>
  );
}
