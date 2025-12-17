import Link from 'next/link';

import type { BlogPostSummary } from '@/app/blog/loadPosts';

export function PostCard({ post }: { post: BlogPostSummary }) {
  return (
    <article className="panel panel-hover p-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm/6 text-subtle">
        <span>{post.meta.date}</span>
        {post.meta.tags.map((tag) => (
          <Link
            key={tag}
            href={`/blog/tags/${encodeURIComponent(tag)}`}
            className="cursor-pointer hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent rounded-md"
          >
            {tag}
          </Link>
        ))}
      </div>

      <h3 className="mt-3 text-xl font-semibold tracking-tight text-fg leading-tight">
        <Link
          href={`/blog/${post.slug}`}
          className="cursor-pointer hover:underline underline-offset-4"
        >
          {post.meta.title}
        </Link>
      </h3>
      <p className="mt-2 text-base/7 text-muted leading-relaxed">{post.meta.description}</p>
    </article>
  );
}
