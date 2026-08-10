import { getAllPosts } from '@/data/db';

export const dynamic = 'force-static';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://todays-literature.com';
  const posts = getAllPosts();

  const itemsXml = posts
    .map((post) => {
      const pubDate = new Date(post.date).toUTCString();
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/post/${post.id}</link>
      <guid isPermaLink="true">${baseUrl}/post/${post.id}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
      <author><![CDATA[${post.author}]]></author>
      <category><![CDATA[${post.category}]]></category>
    </item>`;
    })
    .join('');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>오늘의 문학 | 프리미엄 인문학 웹 매거진</title>
    <link>${baseUrl}</link>
    <description>철학, 사상, 문학, 시, 음악, 역사, 현대 에세이를 통해 영혼을 살찌우는 고풍스러운 인문학 웹 매거진입니다.</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
