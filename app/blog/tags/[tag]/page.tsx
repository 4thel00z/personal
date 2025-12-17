import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { loadAllBlogTags, loadBlogPosts } from '@/app/blog/loadPosts';
import { BlogLayout } from '@/src/components/blog/BlogLayout';
import { PostCard } from '@/src/components/blog/PostCard';

export async function generateStaticParams(): Promise<Array<{ tag: string }>> {
  const tags = await loadAllBlogTags();
  return tags.map((tag) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await props.params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `Tag: ${decoded}`,
    description: `Blog posts tagged “${decoded}”.`,
  };
}

export default async function BlogTagPage(props: { params: Promise<{ tag: string }> }) {
  const { tag } = await props.params;
  const decoded = decodeURIComponent(tag);

  const posts = await loadBlogPosts();
  const filtered = posts.filter((p) => p.meta.tags.includes(decoded));

  if (!filtered.length) {
    notFound();
  }

  return (
    <BlogLayout
      title={decoded}
      description={`${filtered.length} post${filtered.length === 1 ? '' : 's'} tagged “${decoded}”.`}
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/blog"
            className="cursor-pointer rounded-full px-3 py-1 text-sm/6 font-semibold ring-1 ring-border/60 text-fg hover:ring-border/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            Back to blog
          </Link>
          <Link
            href="/blog/tags"
            className="cursor-pointer rounded-full px-3 py-1 text-sm/6 font-semibold ring-1 ring-border/60 text-fg hover:ring-border/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            All tags
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </BlogLayout>
  );
}
