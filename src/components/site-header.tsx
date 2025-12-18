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
          <a href="/" className="group relative text-foreground/80 transition-colors hover:text-green-600">
            Home
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
          </a>
          <a href="/about" className="group relative text-foreground/80 transition-colors hover:text-green-600">
            About
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
          </a>
          <a href="/focus-areas" className="group relative text-foreground/80 transition-colors hover:text-green-600">
            Focus Areas
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
          </a>
          <a href="/insights" className="group relative text-foreground/80 transition-colors hover:text-green-600">
            Insights
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
          </a>
          <a href="/tools" className="group relative text-foreground/80 transition-colors hover:text-green-600">
            Tools
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
          </a>
          <a href="/training" className="group relative text-foreground/80 transition-colors hover:text-green-600">
            Training
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
          </a>
          <a href="/news" className="group relative text-foreground/80 transition-colors hover:text-green-600">
            News
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
          </a>
          <a href="/contact" className="group relative text-foreground/80 transition-colors hover:text-green-600">
            Contact
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
          </a>
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
