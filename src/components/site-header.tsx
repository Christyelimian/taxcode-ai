"use client";

import Link from "next/link";
import Image from "next/image";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75 border-b border-border/60 shadow-sm">
      <div className="mx-auto flex h-20 w-full max-w-[1280px] items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/new-logo.png"
            alt="Tax Code Logo"
            width={80}
            height={80}
            className="h-[100%] w-auto object-contain"
            priority
          />
          <span className="hidden sm:inline-flex font-headline text-[17px] font-semibold tracking-tight text-slate-900">
            Tax Code
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/about"
            className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
          >
            About
          </Link>
          <Link
            href="/focus-areas"
            className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
          >
            Focus Areas
          </Link>
          <Link
            href="/insights"
            className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
          >
            Insights
          </Link>
          <Link
            href="/news"
            className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
          >
            News
          </Link>
          <Link
            href="/contact"
            className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
