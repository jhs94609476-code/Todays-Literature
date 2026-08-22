import type { MetadataRoute } from 'next';
import { getAllPosts, NAV_ITEMS } from '@/data/db';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  // ▼ 이 부분을 환경변수 없이 Vercel 주소로만 확정 지었습니다.
  const baseUrl = 'https://todays-literature-tau.vercel.app';
  const posts = getAllPosts();

  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/post/${post.slug}`,
    lastModified: new Date(post.date || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const categoryUrls: MetadataRoute.Sitemap = NAV_ITEMS.map((item) => ({
    url: `${baseUrl}${item.href}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...categoryUrls,
    ...postUrls,
  ];
}