"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, BookOpen } from "lucide-react";
import { NAV_ITEMS } from "@/data/db";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-md border-b border-gold/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" prefetch={false} className="flex items-center gap-2 group">
              <BookOpen className="w-6 h-6 text-gold group-hover:rotate-6 transition-transform duration-300" />
              <span className="font-serif text-2xl font-bold tracking-wider text-sepia-dark group-hover:text-gold transition-colors duration-300">
                오늘의 문학
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 lg:space-x-4">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className={`px-4 py-2 text-md font-medium tracking-tight hover-gold-transition rounded-md transition-colors ${
                    isActive
                      ? "text-gold font-bold border-b-2 border-gold rounded-none"
                      : "text-sepia-dark/85"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile hamburger button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-sepia-dark hover:text-gold hover:bg-cream-dark focus:outline-none transition-colors duration-300"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">메뉴 열기</span>
              {isOpen ? <X className="block h-6 h-6" /> : <Menu className="block h-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          isOpen ? "block animate-fadeIn" : "hidden"
        } md:hidden border-t border-gold/10 bg-cream/98`}
        id="mobile-menu"
      >
        <div className="px-2 pt-3 pb-4 space-y-1 sm:px-3 shadow-inner">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? "bg-cream-dark text-gold font-bold border-l-4 border-gold"
                    : "text-sepia-dark hover:bg-cream-dark/50 hover:text-gold"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
