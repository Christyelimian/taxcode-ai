"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MegaMenu } from "@/components/mega-menu";
import { cn } from "@/lib/utils";

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75",
        scrolled ? "border-b border-border/60 shadow-sm" : "border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-20 w-full max-w-[1280px] items-center justify-between gap-3 px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-5">
          <Link href="/" className="flex items-center gap-3">
          <Image
            src="/taxcode logo.png"
            alt="TaxCode AI Logo"
            width={82}
            height={82}
            className="h-[68px] w-[68px] object-contain"
            priority
          />
          <span className="hidden sm:inline-flex font-headline text-[17px] font-semibold tracking-tight">
            TaxCode
          </span>
        </Link>

          <div className="flex items-center gap-1 md:gap-2">
            <MegaMenu className="mr-1" />
            <nav className="hidden items-center gap-1 text-[15px] font-semibold md:flex">
              <Link
                href="/directory"
                aria-current={pathname?.startsWith("/directory") ? "page" : undefined}
                className={cn(
                  "inline-flex items-center rounded-md px-3 py-2 text-foreground/80 transition-colors hover:text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  pathname?.startsWith("/directory") && "text-foreground"
                )}
              >
                Directory
              </Link>
              <a
                href="/#pricing"
                className={cn(
                  "inline-flex items-center rounded-md px-3 py-2 text-foreground/80 transition-colors hover:text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  pathname === "/" ? "text-foreground" : "text-foreground/80"
                )}
              >
                Pricing
              </a>
              <Link
                href="/news"
                aria-current={pathname?.startsWith("/news") ? "page" : undefined}
                className={cn(
                  "inline-flex items-center rounded-md px-3 py-2 text-foreground/80 transition-colors hover:text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  pathname?.startsWith("/news") && "text-foreground"
                )}
              >
                Community
              </Link>
              <Link
                href="/contact"
                aria-current={pathname === "/contact" ? "page" : undefined}
                className={cn(
                  "inline-flex items-center rounded-md px-3 py-2 text-foreground/80 transition-colors hover:text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  pathname === "/contact" && "text-foreground"
                )}
              >
                Help
              </Link>
            </nav>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden md:inline-flex text-[15px] font-semibold">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button
            asChild
            className="h-11 px-5 text-[15px] font-semibold shadow-sm shadow-primary/10 hover:shadow-primary/15 transition-shadow"
          >
            <Link href="/dashboard">Launch App</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
