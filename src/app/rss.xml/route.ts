import { getAllPosts } from '@/data/db';

export const dynamic = 'force-static';

const SITE_URL = 'https://todays-literature-tau.vercel.app';

export async function GET() {
  const posts = getAllPosts();

  const itemsXml = posts
    .map((post) => {
      const pubDate = new Date(post.date).toUTCString();
      const postUrl = `${SITE_URL}/post/${post.slug}`;
      const title = post.title
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      const description = (post.excerpt || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      return `    <item>
      <title>${title}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
    </item>`;
    })
    .join('\n');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>오늘의 문학</title>
    <link>${SITE_URL}</link>
    <description>철학, 사상, 문학, 시, 음악, 역사, 현대 에세이를 다루는 인문학 웹 매거진</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
