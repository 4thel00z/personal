import { loadBlogPosts } from '@/app/blog/loadPosts';
import { personal } from '@/src/config/personal';

function escapeXml(input: string): string {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function siteUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_URL ??
    'http://localhost:3000';

  if (fromEnv.startsWith('http://') || fromEnv.startsWith('https://')) {
    return fromEnv.replace(/\/$/, '');
  }

  return `https://${fromEnv}`.replace(/\/$/, '');
}

export async function GET() {
  const base = siteUrl();
  const posts = await loadBlogPosts();

  const items = posts
    .map((post) => {
      const url = `${base}/blog/${post.slug}`;
      const title = escapeXml(post.meta.title);
      const description = escapeXml(post.meta.description);
      const pubDate = new Date(`${post.meta.date}T00:00:00Z`).toUTCString();

      return `
        <item>
          <title>${title}</title>
          <link>${url}</link>
          <guid>${url}</guid>
          <pubDate>${pubDate}</pubDate>
          <description>${description}</description>
        </item>
      `.trim();
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(`${personal.siteTitle} — Blog`)}</title>
    <link>${base}/blog</link>
    <description>${escapeXml(`Posts by ${personal.name}.`)}</description>
    ${items}
  </channel>
</rss>
`;

  return new Response(rss, {
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'cache-control': 'public, max-age=0, must-revalidate',
    },
  });
}
