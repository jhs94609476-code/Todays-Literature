/**
 * src/lib/category.ts
 * ─────────────────────────────────────────────────────────────────
 * 카테고리 URL 인코딩/디코딩 공통 유틸리티
 *
 * 이 프로젝트의 카테고리 URL 구조:
 *   /category/{slug}          예: /category/essay
 *   /category/{slug}?page=N   예: /category/essay?page=2
 *
 * CATEGORY_MAP의 키(slug)는 ASCII 문자열이므로 encodeURIComponent가
 * 실질적으로 변환하지 않지만, 향후 slug 체계 변경이나 직접 카테고리명을
 * URL에 사용하는 경우를 위해 모든 URL 생성을 이 유틸을 통해 일원화한다.
 * ─────────────────────────────────────────────────────────────────
 */

import { CATEGORY_MAP, REVERSE_CATEGORY_MAP } from "@/data/db";

// ─────────────────────────────────────────────────────────────────
// 1. 기본 인코딩 / 디코딩
// ─────────────────────────────────────────────────────────────────

/**
 * slug(또는 카테고리명)을 URL 경로 세그먼트로 안전하게 인코딩한다.
 * 쉼표(,), 공백, 한글 등 특수문자가 포함된 문자열도 올바르게 처리된다.
 *
 * @example
 *   encodeCategoryToUrl("essay")          // "essay"
 *   encodeCategoryToUrl("현대 에세이, 삶")  // "%ED%98%84%EB%8C%80..."
 */
export function encodeCategoryToUrl(slug: string): string {
  return encodeURIComponent(slug);
}

/**
 * URL 경로 세그먼트 또는 쿼리스트링에서 원본 카테고리 slug를 복원한다.
 * Next.js params는 이미 디코딩되어 넘어오므로 대부분 no-op이지만,
 * 직접 URL 파싱이나 외부 리다이렉트 처리 시 안전하게 사용한다.
 *
 * @example
 *   decodeUrlToCategory("essay")  // "essay"
 */
export function decodeUrlToCategory(encoded: string): string {
  try {
    return decodeURIComponent(encoded);
  } catch {
    // 잘못된 인코딩 문자열은 원본 반환
    return encoded;
  }
}

// ─────────────────────────────────────────────────────────────────
// 2. URL 경로 빌더 (카테고리 페이지 href 생성 표준 함수)
// ─────────────────────────────────────────────────────────────────

/**
 * 카테고리 slug와 페이지 번호로 카테고리 페이지 href를 생성한다.
 * - page가 1이하이면 쿼리스트링 없는 순수 경로를 반환한다.
 * - SSG(output:'export') 환경에서 useRouter().push()와 함께 사용하면
 *   클라이언트 사이드 라우팅이 정상 동작한다.
 *
 * @example
 *   buildCategoryHref("essay")      // "/category/essay"
 *   buildCategoryHref("essay", 2)   // "/category/essay?page=2"
 */
export function buildCategoryHref(slug: string, page: number = 1): string {
  const encodedSlug = encodeCategoryToUrl(slug);
  if (page <= 1) {
    return "/category/" + encodedSlug;
  }
  return "/category/" + encodedSlug + "?page=" + page;
}

// ─────────────────────────────────────────────────────────────────
// 3. 카테고리 slug <-> 한국어 카테고리명 변환 헬퍼
// ─────────────────────────────────────────────────────────────────

/**
 * URL slug -> 한국어 카테고리명
 * CATEGORY_MAP에 없으면 undefined를 반환한다.
 *
 * @example
 *   slugToKorean("essay")  // "현대 에세이, 삶"
 */
export function slugToKorean(slug: string): string | undefined {
  return CATEGORY_MAP[slug];
}

/**
 * 한국어 카테고리명 -> URL slug
 * REVERSE_CATEGORY_MAP에 없으면 undefined를 반환한다.
 *
 * @example
 *   koreanToSlug("현대 에세이, 삶")  // "essay"
 */
export function koreanToSlug(korean: string): string | undefined {
  return REVERSE_CATEGORY_MAP[korean];
}

/**
 * slug가 유효한 카테고리인지 확인한다.
 *
 * @example
 *   isValidCategorySlug("essay")    // true
 *   isValidCategorySlug("unknown")  // false
 */
export function isValidCategorySlug(slug: string): boolean {
  return slug in CATEGORY_MAP;
}
