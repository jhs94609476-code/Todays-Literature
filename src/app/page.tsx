import Link from "next/link";
import Image from "next/image";
import { getPostsByCategory, REVERSE_CATEGORY_MAP } from "@/data/db";
import { ArrowRight, Calendar, User } from "lucide-react";

const CATEGORIES = [
  { name: "철학, 사상", slug: "philosophy" },
  { name: "문학, 시", slug: "poetry" },
  { name: "음악, 역사", slug: "history" },
  { name: "현대 에세이, 삶", slug: "essay" },
  { name: "시대의 거장들", slug: "masters" },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[650px] w-full flex items-center justify-center overflow-hidden border-b border-gold/30">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero_library.png"
            alt="고풍스러운 도서관 분위기의 오늘의 문학 커버 이미지"
            fill
            className="object-cover brightness-[0.85]"
            priority
          />
          <div className="absolute inset-0 bg-cream/70 backdrop-blur-[1px] z-[1]"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
          <span className="font-serif text-gold text-lg sm:text-xl tracking-[0.25em] block uppercase animate-fadeIn">
            Premium Humanities Web Magazine
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-[#4A3525] tracking-tight leading-tight animate-slideUp">
            오늘의 문학
          </h1>
          <div className="w-24 h-[1px] bg-gold mx-auto my-6"></div>
          <p className="text-md sm:text-lg md:text-xl text-[#1A1A1A]/90 max-w-2xl mx-auto font-light leading-relaxed animate-fadeIn delay-300">
            시대를 초월하여 우리의 삶을 비추는 거장들의 사유와 철학, 
            가슴을 울리는 시구와 역사 속 불멸의 이야기를 만나보세요.
          </p>
        </div>
      </section>

      {/* Categories Feed Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        {CATEGORIES.map((category) => {
          const posts = getPostsByCategory(category.name).slice(0, 4);
          
          if (posts.length === 0) return null;

          return (
            <section key={category.slug} className="space-y-8">
              {/* Category Header */}
              <div className="flex justify-between items-end border-b border-gold/10 pb-4">
                <div>
                  <span className="text-xs font-bold tracking-widest text-gold uppercase">
                    Category
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-sepia-dark mt-1">
                    {category.name}
                  </h2>
                </div>
                <Link
                  href={`/category/${category.slug}`}
                  prefetch={false}
                  className="group inline-flex items-center gap-1 text-sm font-medium text-gold hover:text-gold-light transition-colors"
                >
                  더 보기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/post/${post.slug}`}
                    prefetch={false}
                    className="flex flex-col bg-cream-dark/40 hover:bg-cream-dark/90 border border-gold/10 rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md group"
                  >
                    {/* Card Cover Image */}
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={post.coverImage}
                        alt={`${post.title} 커버 이미지`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 25vw"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        {/* Meta */}
                        <div className="flex items-center gap-3 text-xs text-sepia-muted/80">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3 text-gold" /> {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gold" /> {post.date}
                          </span>
                        </div>
                        {/* Title */}
                        <h3 className="font-serif text-base sm:text-lg font-bold text-sepia-dark line-clamp-2 leading-snug group-hover:text-gold transition-colors duration-300">
                          {post.title}
                        </h3>
                        {/* Excerpt */}
                        <p className="text-xs sm:text-sm text-sepia-muted line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-gold group-hover:text-gold-light inline-flex items-center gap-1">
                        자세히 보기 <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
