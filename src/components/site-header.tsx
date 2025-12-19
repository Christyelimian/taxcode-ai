"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MegaMenu } from "@/components/mega-menu";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth-provider";
import { signOutClient } from "@/lib/firebase-client";
import { clearSession } from "@/app/actions";
import { Scale, Gavel, ShieldCheck, ChevronDown, AlertCircle, FileText, User, Settings, LogOut, LayoutDashboard } from "lucide-react";

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
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
                href="/assistant"
                aria-current={pathname?.startsWith("/assistant") ? "page" : undefined}
                className={cn(
                  "inline-flex items-center rounded-md px-3 py-2 text-foreground/80 transition-colors hover:text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  pathname?.startsWith("/assistant") && "text-foreground"
                )}
              >
                TaxPal
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md px-3 py-2 text-[15px] font-semibold text-foreground/80 transition-colors hover:text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      (pathname?.startsWith("/directory") || pathname?.startsWith("/lawyers")) && "text-foreground"
                    )}
                  >
                    Directory
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-96 p-0">
                  <div className="p-4">
                    <div className="mb-3 text-sm font-semibold text-foreground">Find a Professional</div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        asChild
                        variant="outline"
                        className="h-auto flex-col items-start p-4 hover:bg-primary/5 hover:border-primary/50"
                      >
                        <Link href="/directory">
                          <Scale className="h-6 w-6 mb-2 text-primary" />
                          <div className="text-sm font-semibold text-left">Tax Consultants</div>
                          <div className="text-xs text-muted-foreground text-left mt-1">
                            Find verified tax professionals
                          </div>
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="h-auto flex-col items-start p-4 hover:bg-primary/5 hover:border-primary/50"
                      >
                        <Link href="/lawyers">
                          <Gavel className="h-6 w-6 mb-2 text-primary" />
                          <div className="text-sm font-semibold text-left">Tax Lawyers</div>
                          <div className="text-xs text-muted-foreground text-left mt-1">
                            FIRS disputes, TAT appeals, tax litigation
                          </div>
                        </Link>
                      </Button>
                    </div>
                    <Separator className="my-3" />
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        asChild
                        variant="outline"
                        className="h-auto flex-col items-start p-4 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950"
                      >
                        <Link href="/lawyers/emergency">
                          <AlertCircle className="h-6 w-6 mb-2 text-red-600" />
                          <div className="text-sm font-semibold text-left">Emergency Hotline</div>
                          <div className="text-xs text-muted-foreground text-left mt-1">
                            Urgent legal assistance
                          </div>
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="h-auto flex-col items-start p-4 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950"
                      >
                        <Link href="/lawyers/documents">
                          <FileText className="h-6 w-6 mb-2 text-blue-600" />
                          <div className="text-sm font-semibold text-left">Document Review</div>
                          <div className="text-xs text-muted-foreground text-left mt-1">
                            Fixed-price legal reviews
                          </div>
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <Separator />
                  <div className="p-4 bg-primary/5">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold">Are you a professional?</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Claim your profile to receive bookings and manage your listing
                    </p>
                    <div className="flex gap-2">
                      <Button asChild size="sm" className="flex-1">
                        <Link href="/directories/claim">Check if Listed</Link>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="flex-1">
                        <Link href="/lawyers/join">Join as Tax Lawyer</Link>
                      </Button>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link
                href="/community"
                aria-current={pathname?.startsWith("/community") ? "page" : undefined}
                className={cn(
                  "inline-flex items-center rounded-md px-3 py-2 text-foreground/80 transition-colors hover:text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  pathname?.startsWith("/community") && "text-foreground"
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
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden md:inline-flex items-center gap-2 h-11 px-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || "User"} />
                    <AvatarFallback>
                      {user.displayName?.[0] || user.email?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[15px] font-semibold hidden lg:inline">
                    {user.displayName || user.email?.split("@")[0] || "Account"}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={async () => {
                    try {
                      await signOutClient();
                      await clearSession();
                      router.push("/");
                      router.refresh();
                    } catch (error) {
                      console.error("Sign out error:", error);
                    }
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost" className="hidden md:inline-flex text-[15px] font-semibold">
              <Link href="/login">Sign in</Link>
            </Button>
          )}
          <Button
            asChild
            className="h-11 px-5 text-[15px] font-semibold shadow-sm shadow-primary/10 hover:shadow-primary/15 transition-shadow"
          >
            <Link href={user ? "/dashboard" : "/dashboard"}>Launch App</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
