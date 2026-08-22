import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPostBySlug, getPostById, getRelatedPosts, REVERSE_CATEGORY_MAP, getAllPosts } from "@/data/db";
import { Calendar, User, ArrowLeft, Bookmark, Heart, Share2, Info } from "lucide-react";
import CoupangAd from "@/components/CoupangAd";
import CoupangStaticAd from "@/components/CoupangStaticAd";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://todays-literature-tau.vercel.app";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    id: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = getPostBySlug(id) || getPostById(id);
  
  if (!post) {
    return { title: "글을 찾을 수 없습니다" };
  }

  const cleanTitle = (post.title || '').replace(/^["']|["']$/g, '').trim();
  const description = (post.summary || post.excerpt || "").replace(/^["']|["']$/g, '').trim();
  const rawKeywords = post.keywords
    ? post.keywords.replace(/^["']|["']$/g, '').split(",").map((k) => k.trim()).filter(Boolean)
    : [post.category, post.author, "오늘의 문학", "인문학", "고전문학", "철학"];
  const uniqueKeywords = Array.from(new Set(rawKeywords));

  // 검색엔진(네이버/구글/다음 등) 크롤링용 절대 경로 이미지 URL 구성
  const rawImage = post.coverImage || "/images/hero_library.png";
  const coverImageUrl = rawImage.startsWith('http')
    ? rawImage
    : `${SITE_URL}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;

  const currentSlug = post.slug || post.id;

  return {
    title: cleanTitle,
    description: description,
    keywords: uniqueKeywords,
    alternates: {
      canonical: `/post/${currentSlug}`,
    },
    openGraph: {
      title: `${cleanTitle} | 오늘의 문학`,
      description: description,
      url: `${SITE_URL}/post/${currentSlug}`,
      siteName: "오늘의 문학",
      type: "article",
      publishedTime: post.date ? new Date(post.date).toISOString() : undefined,
      authors: [post.author || "오늘의 문학 편집부"],
      tags: uniqueKeywords,
      images: [
        {
          url: coverImageUrl,
          width: 800,
          height: 600,
          alt: `${cleanTitle} 대표 작가 초상화`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${cleanTitle} | 오늘의 문학`,
      description: description,
      images: [coverImageUrl],
    },
  };
}

// HTML 블록을 가독성 스타일이 적용된 JSX로 변환하는 헬퍼
function renderHtmlBlock(html: string, index: number) {
  // 1. 외부 링크(<a> 태그)에 rel="nofollow sponsored noopener noreferrer" 및 target="_blank" 자동 보장
  let styled = html.replace(
    /<a\s+([^>]*?)href=(["'])(.*?)\2([^>]*)>/gi,
    (match, before, quote, href, after) => {
      const isInternal = href.startsWith("/") || href.startsWith("#") || href.includes("todays-literature");
      if (isInternal) {
        return match;
      }
      // 외부 제휴 링크인 경우 안전하게 rel 속성과 target 속성 주입
      const rest = `${before} ${after}`.replace(/\s*rel=(["']).*?\1/gi, "").replace(/\s*target=(["']).*?\1/gi, "").trim();
      return `<a href="${href}" target="_blank" rel="nofollow sponsored noopener noreferrer" ${rest ? `${rest} ` : ""}class="text-gold hover:underline">`;
    }
  );

  // 2. h2, h3, p, strong, b, blockquote 태그에 스타일 주입
  styled = styled
    .replace(
      /<h2>/g,
      '<h2 style="font-size:1.5rem;font-weight:700;margin-top:3rem;margin-bottom:1rem;padding-left:1rem;border-left:4px solid #c8a96e;color:#2d1f0f;font-family:var(--font-serif);line-height:1.4;">'
    )
    .replace(
      /<h3>/g,
      '<h3 style="font-size:1.25rem;font-weight:600;margin-top:2rem;margin-bottom:0.75rem;color:#3a2510;font-family:var(--font-serif);line-height:1.4;">'
    )
    .replace(
      /<p>/g,
      '<p style="margin-bottom:1.75rem;line-height:2;color:#2d1f0f;font-size:1.0625rem;">'
    )
    .replace(
      /<strong>/g,
      '<strong style="font-weight:700;color:#7c4b1e;">'
    )
    .replace(
      /<b>/g,
      '<b style="font-weight:700;color:#7c4b1e;">'
    )
    .replace(
      /<blockquote>/g,
      '<blockquote style="margin:2rem 0;padding:1.25rem 1.5rem;background:rgba(200,169,110,0.08);border-left:4px solid #c8a96e;border-radius:0 0.5rem 0.5rem 0;font-style:italic;color:#5a3e28;line-height:1.9;">'
    );

  return (
    <div
      key={index}
      dangerouslySetInnerHTML={{ __html: styled }}
    />
  );
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const post = getPostBySlug(id) || getPostById(id);

  if (!post) {
    notFound();
  }

  const currentSlug = post.slug || post.id;
  const relatedPosts = getRelatedPosts(post.category, currentSlug, 10);
  const categorySlug = REVERSE_CATEGORY_MAP[post.category] || "masters";

  // Parse body text into paragraphs, ads, and inline images
  let bodyWithAdBoundaries = post.bodyText
    .replace(/<!-- DYNAMIC_AD_1 -->/g, "\n\n[AD:1]\n\n")
    .replace(/<!-- DYNAMIC_AD_2 -->/g, "\n\n[AD:2]\n\n")
    .replace(/<!-- DYNAMIC_AD_3 -->/g, "\n\n[AD:3]\n\n");
  
  const blocks = bodyWithAdBoundaries.split("\n\n").map((block) => block.trim()).filter(Boolean);

  return (
    <div className="min-h-screen py-10 bg-cream">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href={`/category/${categorySlug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:text-gold-light transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {post.category} 목록으로
          </Link>
        </div>

        {/* Article Container */}
        <article className="bg-cream-dark/20 border border-gold/15 rounded-xl p-6 sm:p-10 shadow-sm">
          
          {/* Header Area */}
          <div className="space-y-4 mb-8">
            <span className="inline-block px-2.5 py-1 text-xs font-semibold bg-gold/10 text-gold rounded">
              {post.category}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-sepia-dark leading-tight tracking-tight">
              {post.title}
            </h1>
            
            {/* Meta */}
            <div className="flex items-center gap-4 text-xs sm:text-sm text-sepia-muted/95 border-b border-gold/10 pb-6">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4 text-gold" /> {post.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-gold" /> {post.date}
              </span>
            </div>
          </div>

          {/* 작가 초상화 이미지 */}
          <div className="flex justify-center mb-8">
            <div className="relative w-36 h-44 sm:w-44 sm:h-56 rounded-lg overflow-hidden border border-gold/20 shadow-md">
              <Image
                src={post.coverImage}
                alt={`${post.author} 작가 초상화`}
                fill
                className="object-cover object-top"
                sizes="(max-width: 640px) 144px, 176px"
              />
            </div>
          </div>

          {/* 🚨 Coupang Partners Required Warning Text */}
          <div className="bg-red-50/70 border border-red-200/80 rounded-lg p-4 flex gap-3 items-start animate-fadeIn mb-8">
            <Info className="w-5 h-5 text-coupang-red flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-coupang-red/90 leading-relaxed font-medium">
              이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
            </p>
          </div>

          {/* Body Text Area with dynamic elements */}
          <div className="max-w-none">
            {blocks.map((block, index) => {
              // 1. Ad blocks
              if (block === "[AD:1]") {
                return <CoupangStaticAd key={`ad-1-${index}`} type="top" />;
              }
              if (block === "[AD:2]") {
                return <CoupangAd key={`ad-2-${index}`} />;
              }
              if (block === "[AD:3]") {
                return <CoupangStaticAd key={`ad-3-${index}`} type="bottom" />;
              }

              // 2. Inline image blocks: [IMAGE: path]
              const imageMatch = block.match(/^\[IMAGE:\s*(.*?)\s*\]$/);
              if (imageMatch) {
                const imageUrl = imageMatch[1];
                return (
                  <figure key={index} className="my-10 relative rounded-lg overflow-hidden border border-gold/10 shadow-sm">
                    <div className="relative h-[300px] sm:h-[400px] w-full">
                      <Image
                        src={imageUrl}
                        alt={`${post.title} 관련 삽화 이미지`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 720px"
                      />
                    </div>
                    <figcaption className="bg-cream-dark/50 py-2 text-center text-xs text-sepia-muted italic border-t border-gold/5">
                      {post.title} 관련 예술 이미지
                    </figcaption>
                  </figure>
                );
              }

              // 3. HTML 본문 블록 — 가독성 스타일 적용
              return renderHtmlBlock(block, index);
            })}
          </div>

          {/* 🚨 Bottom Coupang Partners Notice */}
          <div className="mt-10 pt-4 pb-4 text-center border-t border-gold/10">
            <p className="text-[11px] text-sepia-muted/65 leading-relaxed font-light">
              오늘의 문학은 쿠팡 파트너스 등 다양한 제휴 마케팅 링크와 제휴 광고를 게재하여, 
              이용자가 해당 광고를 통해 상품을 구매할 경우 일정 수수료를 제공받아 매거진 제작 비용으로 사용합니다.
            </p>
          </div>

          {/* Footer Interactions */}
          <div className="flex justify-between items-center pt-6 border-t border-gold/10">
            <div className="flex gap-4">
              <button className="flex items-center gap-1 text-xs text-sepia-muted hover:text-gold transition-colors">
                <Heart className="w-4 h-4" /> <span>좋아요</span>
              </button>
              <button className="flex items-center gap-1 text-xs text-sepia-muted hover:text-gold transition-colors">
                <Bookmark className="w-4 h-4" /> <span>북마크</span>
              </button>
            </div>
            <button className="flex items-center gap-1 text-xs text-sepia-muted hover:text-gold transition-colors">
              <Share2 className="w-4 h-4" /> <span>공유하기</span>
            </button>
          </div>
        </article>

        {/* Related Posts Section */}
        <section className="mt-12 bg-cream-dark/15 border border-gold/15 rounded-xl p-6 sm:p-8 space-y-6">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-sepia-dark border-b border-gold/10 pb-3">
            이 카테고리({post.category})의 다른 이야기
          </h3>
          <ul className="divide-y divide-gold/10">
            {relatedPosts.map((relatedPost) => (
              <li key={relatedPost.slug} className="py-3.5 group">
                <Link
                  href={`/post/${relatedPost.slug}`}
                  prefetch={false}
                  className="flex justify-between items-center gap-4 text-sm sm:text-base text-sepia-dark group-hover:text-gold transition-colors"
                >
                  <span className="font-serif text-sepia-dark/95 group-hover:text-gold transition-colors line-clamp-1 leading-snug">
                    {relatedPost.title}
                  </span>
                  <span className="text-xs text-sepia-muted/70 flex-shrink-0">
                    {relatedPost.date}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

      </div>
    </div>
  );
}
