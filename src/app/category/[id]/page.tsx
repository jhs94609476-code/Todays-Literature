import { CATEGORY_MAP } from "@/data/db";
import CategoryClient from "./CategoryClient";
import { Suspense } from "react";

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
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="font-serif text-sepia-muted animate-pulse">카테고리를 불러오는 중입니다...</p>
      </div>
    }>
      <CategoryClient />
    </Suspense>
  );
}
