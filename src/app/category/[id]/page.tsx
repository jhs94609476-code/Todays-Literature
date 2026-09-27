import { CATEGORY_MAP } from "@/data/db";
import CategoryClient from "./CategoryClient";
import { Suspense } from "react";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((id) => ({
    id: id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const categoryKorean = CATEGORY_MAP[id];
  
  if (!categoryKorean) {
    return { title: "카테고리를 찾을 수 없습니다" };
  }

  return {
    title: `${categoryKorean} | 카테고리 목록`,
    description: `${categoryKorean} 카테고리의 유익한 글 목록을 확인해 보세요.`,
    alternates: {
      canonical: `/category/${id}`,
    },
    openGraph: {
      title: `${categoryKorean} | 오늘의 문학`,
      description: `${categoryKorean} 카테고리의 유익한 글 목록을 확인해 보세요.`,
      url: `/category/${id}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;

  // 서버에서 카테고리 유효성 확인 (정적 내보내기에서도 동작)
  if (!CATEGORY_MAP[id]) {
    notFound();
  }

  return (
    // key={id}로 카테고리 전환 시 Suspense 트리 전체 강제 리마운트
    // → useSearchParams() 캐시 스테일 방지, currentPage 항상 1부터 시작
    <Suspense
      key={id}
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-cream">
          <p className="font-serif text-sepia-muted animate-pulse">카테고리를 불러오는 중입니다...</p>
        </div>
      }
    >
      <CategoryClient categoryId={id} />
    </Suspense>
  );
}
