"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center">
          <Image src="/taxcode logo.png" alt="TaxCode AI Logo" width={96} height={96} />
        </Link>
        <nav className="hidden items-center gap-8 text-base font-medium md:flex">
          <Link href="/start-here" className="group relative text-foreground/80 transition-colors hover:text-green-600">
            Learn
            <span className="absolute bottom-0 left-0 h-0.5 w-full transform scale-x-0 bg-green-600 transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
          </Link>
          <Link href="/dashboard/tools" className="group relative text-foreground/80 transition-colors hover:text-green-600">
            Tools
            <span className="absolute bottom-0 left-0 h-0.5 w-full transform scale-x-0 bg-green-600 transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
          </Link>
          <Link href="/dashboard/modules" className="group relative text-foreground/80 transition-colors hover:text-green-600">
            Academy
            <span className="absolute bottom-0 left-0 h-0.5 w-full transform scale-x-0 bg-green-600 transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
          </Link>
          <a href="/#pricing" className="group relative text-foreground/80 transition-colors hover:text-green-600">
            Pricing
            <span className="absolute bottom-0 left-0 h-0.5 w-full transform scale-x-0 bg-green-600 transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
          </a>
          <Link href="/news" className="group relative text-foreground/80 transition-colors hover:text-green-600">
            Community
            <span className="absolute bottom-0 left-0 h-0.5 w-full transform scale-x-0 bg-green-600 transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
          </Link>
          <Link href="/contact" className="group relative text-foreground/80 transition-colors hover:text-green-600">
            Help
            <span className="absolute bottom-0 left-0 h-0.5 w-full transform scale-x-0 bg-green-600 transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild size="lg" className="shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-shadow">
            <Link href="/dashboard">Launch App</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
