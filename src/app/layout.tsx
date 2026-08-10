import type { Metadata } from "next";
import { Noto_Serif_KR, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif_KR({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const notoSans = Noto_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://todays-literature.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    template: "%s | 오늘의 문학",
    default: "오늘의 문학 | 프리미엄 인문학 웹 매거진",
  },
  description: "철학, 사상, 문학, 시, 음악, 역사, 현대 에세이를 통해 영혼을 살찌우는 고풍스러운 인문학 웹 매거진입니다.",
  keywords: ["오늘의 문학", "인문학", "철학", "역사", "문학", "시", "에세이", "동양철학", "서양철학"],
  authors: [{ name: "오늘의 문학 편집부" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "오늘의 문학 | 프리미엄 인문학 웹 매거진",
    description: "철학, 사상, 문학, 시, 음악, 역사, 현대 에세이를 통해 영혼을 살찌우는 고풍스러운 인문학 웹 매거진입니다.",
    url: baseUrl,
    siteName: "오늘의 문학",
    images: [
      {
        url: "/images/hero_library.png",
        width: 1200,
        height: 630,
        alt: "오늘의 문학 대표 이미지",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  verification: {
    other: {
      'naver-site-verification': ['45764e8a06c752c6649e3e91987d31d5147c3a3e'],
    },
    google: 'hNvXWg0ehlmQ3dY5uT1fMkwxAk104_EY265xnfmCVfg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${notoSerif.variable} ${notoSans.variable} h-full antialiased`}
    >
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="min-h-full flex flex-col bg-cream text-sepia-dark selection:bg-gold-light/20 selection:text-sepia-dark">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

