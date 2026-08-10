import Link from "next/link";
import { BookOpen } from "lucide-react";
import { NAV_ITEMS } from "@/data/db";

export default function Footer() {
  return (
    <footer className="bg-sepia-dark text-cream/90 border-t border-gold/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Intro */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gold-light" />
              <span className="font-serif text-xl font-bold tracking-wider text-cream">
                오늘의 문학
              </span>
            </div>
            <p className="text-sm text-cream/70 leading-relaxed max-w-sm">
              인문학, 철학, 역사, 문학을 다루는 수익형 프리미엄 웹 매거진. 
              시대를 초월한 거장들의 사유를 매일 전달하여 우리의 내면을 풍요롭게 가꿉니다.
            </p>
          </div>

          {/* Categories Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-cream">카테고리</h3>
            <ul className="grid grid-cols-2 gap-2 text-sm text-cream/80">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-gold-light transition-colors duration-300">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Profitability Notice */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-cream">수익화 안내 및 고지</h3>
            <p className="text-xs text-cream/60 leading-relaxed">
              오늘의 문학은 쿠팡 파트너스 등 다양한 제휴 마케팅 링크와 제휴 광고를 게재하여, 
              이용자가 해당 광고를 통해 상품을 구매할 경우 일정 수수료를 제공받아 매거진 제작 비용으로 사용합니다.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-cream/50">
          <p>&copy; {new Date().getFullYear()} 오늘의 문학. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:underline">이용약관</Link>
            <Link href="/" className="hover:underline">개인정보처리방침</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
