"use client";

import { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { CATEGORY_MAP, CATEGORY_INTRO, getPaginatedPostsByCategory } from "@/data/db";
import { buildCategoryHref } from "@/lib/category";
import { Calendar, User, ArrowRight, Info } from "lucide-react";
import CoupangPartnerCards from "@/components/CoupangPartnerCards";

// 추천 카드 3종 순환 렌더 헬퍼
function RotatingAd({ adIndex }: { adIndex: number }) {
  const slot = adIndex % 3; // 0 → 키링, 1 → 도서, 2 → 독서등
  if (slot === 0) return <CoupangPartnerCards variant="keyring" />;
  if (slot === 1) return <CoupangPartnerCards variant="book" />;
  return <CoupangPartnerCards variant="light" />;
}

interface CategoryClientProps {
  /** page.tsx 서버 컴포넌트에서 내려주는 카테고리 slug (useParams() 하이드레이션 레이스 방지) */
  categoryId: string;
}

export default function CategoryClient({ categoryId }: CategoryClientProps) {
  // ── 모든 훅은 조건문 이전에 선언해야 한다 (React 훅 규칙) ──────────
  const searchParams = useSearchParams();
  const router = useRouter();

  // ── navigateTo 헬퍼 ──────────────────────────────────────────────
  // SSG(output:'export') 환경에서 <Link href="?page=N">은 대응 HTML 파일이 없어
  // 라우팅이 중단된다. useRouter().push()로 클라이언트 사이드 전환을 강제한다.
  // buildCategoryHref()가 URL 인코딩과 경로 조합을 담당한다.
  const navigateTo = useCallback(
    (page: number) => {
      router.push(buildCategoryHref(categoryId, page));
    },
    [router, categoryId]
  );

  // ── 유효성 검사는 모든 훅 선언 이후에 수행 ───────────────────────
  const categoryKorean = CATEGORY_MAP[categoryId];
  if (!categoryKorean) return null;

  // ── currentPage 결정 ──────────────────────────────────────────────
  // output:'export' SSG 환경에서는 정적 HTML이 항상 page=1 껍데기로 빌드됨.
  // useSearchParams()는 클라이언트 하이드레이션 후에만 실제 값을 반환하므로
  // 아래 파싱 + clamping이 런타임 진입점 역할을 한다.
  const rawPage = searchParams.get("page");
  const parsedPage = rawPage ? parseInt(rawPage, 10) : 1;
  // NaN·0 이하·Infinity 등 비정상 값은 모두 1로 고정
  const requestedPage = Number.isFinite(parsedPage) && parsedPage >= 1 ? parsedPage : 1;

  const { items: posts, pagination } = getPaginatedPostsByCategory(
    categoryKorean,
    requestedPage,
    20
  );
  // db.ts의 getPaginatedPostsByCategory 내부에서 Math.max(1, Math.min(page, totalPages))로
  // 이미 clamping 하지만, currentPage는 pagination.currentPage를 신뢰함(이중 방어)
  const intro = CATEGORY_INTRO[categoryKorean];

  return (
    <div className="min-h-screen pb-16">
      {/* Upper Thin Cover Image Banner */}
      <section className="relative h-[250px] w-full flex items-center justify-center border-b border-gold/20 overflow-hidden bg-sepia-dark">
        <div className="absolute inset-0 z-0">
          <Image
            src={intro.banner}
            alt={`${categoryKorean} 카테고리 소개 배너 이미지`}
            fill
            className="object-cover brightness-[0.3]"
            priority
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl space-y-3">
          <span className="text-xs font-bold tracking-widest text-gold uppercase">
            Category
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cream tracking-wide">
            {categoryKorean}
          </h1>
          <p className="text-sm text-cream/70 max-w-xl mx-auto font-light leading-relaxed">
            {intro.desc}
          </p>
        </div>
      </section>

      {/* Main List Layout */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* 🚨 Top Coupang Partners Warning Notice */}
        <div className="mb-8 bg-red-50/70 border border-red-200/80 rounded-lg p-4 flex gap-3 items-start animate-fadeIn">
          <Info className="w-5 h-5 text-coupang-red flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-coupang-red block">
              수익화 안내 및 고지
            </span>
            <p className="text-xs sm:text-sm text-coupang-red/90 leading-relaxed font-medium">
              이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {posts.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-gold/20 rounded-lg">
              <p className="text-sepia-muted text-md">등록된 글이 존재하지 않습니다.</p>
            </div>
          ) : (
            <>
              {posts.map((post, index) => {
                // 5개 간격으로 광고 삽입 (5번째, 10번째, ... 글 다음)
                const showAdAfter = (index + 1) % 5 === 0 && index + 1 < posts.length;
                const adSlotIndex = Math.floor((index + 1) / 5) - 1; // 0-based rotation index

                return (
                  <div key={post.slug} className="space-y-8">
                    <Link
                      href={`/post/${post.slug}`}
                      prefetch={false}
                      className="flex flex-col md:flex-row bg-cream-dark/30 hover:bg-cream-dark/60 border border-gold/10 hover:border-gold/30 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md group"
                    >
                      {/* Image Section */}
                      <div
                        className="relative h-48 md:h-auto md:w-[280px] flex-shrink-0 overflow-hidden"
                      >
                        <Image
                          src={post.coverImage}
                          alt={`${post.title}의 대표 이미지`}
                          fill
                          className="object-cover group-hover:scale-103 transition-transform duration-500"
                          sizes="(max-w-768px) 100vw, 280px"
                        />
                      </div>

                      {/* Text Content Section */}
                      <div className="flex-grow p-6 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          {/* Meta */}
                          <div className="flex items-center gap-3 text-xs text-sepia-muted">
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5 text-gold" /> {post.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-gold" /> {post.date}
                            </span>
                          </div>

                          {/* Title */}
                          <h2 className="font-serif text-lg sm:text-xl font-bold text-sepia-dark leading-snug group-hover:text-gold transition-colors duration-300">
                            {post.title}
                          </h2>

                          {/* Excerpt */}
                          <p className="text-sm text-sepia-muted/95 leading-relaxed line-clamp-3">
                            {post.excerpt}
                          </p>
                        </div>

                        <div>
                          <span
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gold group-hover:text-gold-light transition-colors"
                          >
                            더 깊이 읽어보기 <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </Link>

                    {/* 5개 간격 광고 로테이션 */}
                    {showAdAfter && (
                      <div className="my-4">
                        <RotatingAd adIndex={adSlotIndex} />
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <nav className="flex justify-center items-center gap-2 mt-12 border-t border-gold/10 pt-8" aria-label="Pagination">
            {/* Prev Button */}
            {pagination.hasPrevPage ? (
              <button
                onClick={() => navigateTo(pagination.currentPage - 1)}
                className="px-4 py-2 border border-gold/20 text-sepia-dark hover:bg-gold hover:text-cream rounded-md transition-all duration-300"
              >
                이전
              </button>
            ) : (
              <span className="px-4 py-2 border border-gold/5 text-sepia-muted/40 cursor-not-allowed rounded-md">
                이전
              </span>
            )}

            {/* Page Numbers */}
            <div className="flex gap-1.5">
              {Array.from({ length: pagination.totalPages }, (_, index) => {
                const pageNum = index + 1;
                const isActive = pageNum === pagination.currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => navigateTo(pageNum)}
                    className={`w-10 h-10 flex items-center justify-center border font-serif rounded-md transition-all duration-300 ${
                      isActive
                        ? "bg-gold border-gold text-cream font-bold"
                        : "border-gold/20 text-sepia-dark hover:bg-cream-dark"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            {pagination.hasNextPage ? (
              <button
                onClick={() => navigateTo(pagination.currentPage + 1)}
                className="px-4 py-2 border border-gold/20 text-sepia-dark hover:bg-gold hover:text-cream rounded-md transition-all duration-300"
              >
                다음
              </button>
            ) : (
              <span className="px-4 py-2 border border-gold/5 text-sepia-muted/40 cursor-not-allowed rounded-md">
                다음
              </span>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
