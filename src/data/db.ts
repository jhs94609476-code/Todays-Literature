import postsData from './posts.json';

export interface Post {
  id: string;
  slug: string;
  category: string;
  title: string;
  author: string;
  date: string;
  coverImage: string;
  excerpt: string;
  summary?: string;
  keywords?: string;
  bodyText: string;
}

// category mapping for URLs to Korean GNB category names
export const CATEGORY_MAP: { [key: string]: string } = {
  "philosophy": "철학, 사상",
  "poetry": "문학, 시",
  "history": "음악, 역사",
  "essay": "현대 에세이, 삶",
  "masters": "시대의 거장들",
  "economics": "경제, 자본",
  "comics": "코믹스, 그래픽노블"
};

export const REVERSE_CATEGORY_MAP: { [key: string]: string } = {
  "철학, 사상": "philosophy",
  "문학, 시": "poetry",
  "음악, 역사": "history",
  "현대 에세이, 삶": "essay",
  "시대의 거장들": "masters",
  "경제, 자본": "economics",
  "경제": "economics",
  "코믹스, 그래픽노블": "comics",
  "코믹스": "comics"
};

export const CATEGORY_INTRO: { [key: string]: { desc: string; banner: string } } = {
  "철학, 사상": {
    desc: "인류 역사를 이끌어온 위대한 철학가들의 심오한 사상과 지혜로운 질문들을 소개합니다.",
    banner: "/images/cat_philosophy.png"
  },
  "문학, 시": {
    desc: "영혼을 울리는 문학 명작들과 아름다운 시구 속에 담긴 인생의 깊은 은유를 해석합니다.",
    banner: "/images/cat_poetry.png"
  },
  "음악, 역사": {
    desc: "역사적 전환점이 된 불멸의 대사건들과 시대를 초월해 감동을 주는 음악가들의 선율 속 비화를 탐색합니다.",
    banner: "/images/cat_history.png"
  },
  "현대 에세이, 삶": {
    desc: "바쁜 현대 사회 속에서 고요한 영혼의 쉼터가 되어주는 일상의 잔잔한 성찰과 위로를 건넵니다.",
    banner: "/images/cat_essay.png"
  },
  "시대의 거장들": {
    desc: "예술, 과학, 인문학 등 각 분야에서 불멸의 발자국을 남긴 역사적 거장들의 삶과 사유를 탐색합니다.",
    banner: "/images/cat_masters.png"
  },
  "경제, 자본": {
    desc: "세계 경제를 움직이는 자본의 원리, 투자의 지혜, 그리고 부를 둘러싼 인간과 사회의 이야기를 탐색합니다.",
    banner: "/images/cat_economics.png"
  },
  "코믹스, 그래픽노블": {
    desc: "언어와 그림이 어우러진 독창적인 예술 형식, 그래픽노블과 코믹스가 담아낸 인간의 상상력과 이야기를 소개합니다.",
    banner: "/images/cat_comics.png"
  }
};

export function getAllPosts(): Post[] {
  // Sort posts by date descending, then by slug
  return [...postsData as Post[]].sort((a, b) => {
    const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateCompare !== 0) return dateCompare;
    return a.slug.localeCompare(b.slug);
  });
}

export function getPostById(id: string): Post | undefined {
  return (postsData as Post[]).find(post => post.id === id || post.slug === id);
}

export function getPostBySlug(slug: string): Post | undefined {
  return (postsData as Post[]).find(post => post.slug === slug || post.id === slug);
}

export function getPostsByCategory(categoryName: string): Post[] {
  return getAllPosts().filter(post => post.category === categoryName);
}

export function getPaginatedPostsByCategory(
  categoryName: string,
  page: number = 1,
  limit: number = 20
) {
  const filtered = getPostsByCategory(categoryName);
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / limit);
  
  // Bound check page number
  const activePage = Math.max(1, Math.min(page, totalPages || 1));
  const startIndex = (activePage - 1) * limit;
  const endIndex = startIndex + limit;
  const items = filtered.slice(startIndex, endIndex);

  return {
    items,
    pagination: {
      currentPage: activePage,
      limit,
      totalItems,
      totalPages,
      hasNextPage: activePage < totalPages,
      hasPrevPage: activePage > 1,
    }
  };
}

export function getRelatedPosts(categoryName: string, currentSlugOrId: string, limit: number = 10): Post[] {
  return getAllPosts()
    .filter(post => post.category === categoryName && post.id !== currentSlugOrId && post.slug !== currentSlugOrId)
    .slice(0, limit);
}

export const NAV_ITEMS = [
  { label: "철학, 사상", href: "/category/philosophy" },
  { label: "문학, 시", href: "/category/poetry" },
  { label: "음악, 역사", href: "/category/history" },
  { label: "현대 에세이, 삶", href: "/category/essay" },
  { label: "시대의 거장들", href: "/category/masters" },
  { label: "경제, 자본", href: "/category/economics" },
  { label: "코믹스, 그래픽노블", href: "/category/comics" },
];
