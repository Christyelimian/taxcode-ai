"use client";

import { useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

type RealCourse = {
  id?: string;
  title: string;
  dates: string;
  content: string[];
  image: string;
};

type MockCourse = {
  title: string;
  subtitle: string;
  lessons: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  minutes: number;
  learnersText: string;
  badge: "New" | "Popular" | "Recommended";
  image: string;
};

type Props = {
  title: string;
  items: RealCourse[];
  mockItems?: MockCourse[];
  seeAllHref?: string;
};

type CardVM = {
  key: string;
  href: string;
  title: string;
  metaLine: string;
  subtitle: string;
  image: string;
  disabled: boolean;
  topLeftBadge?: string | null;
  topLeftBadgeClass?: string;
  chips?: string[];
};

function badgePill(badge: MockCourse["badge"]) {
  const base = "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold leading-none";
  if (badge === "New") return `${base} bg-primary/10 text-primary`;
  if (badge === "Popular") return `${base} bg-foreground/10 text-foreground`;
  return `${base} bg-primary text-primary-foreground`;
}

export function AcademyCourseRow({ title, items, mockItems = [] }: Props) {
  const showMock = items.length === 0 && mockItems.length > 0;
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const cards: CardVM[] = useMemo(() => {
    if (items.length) {
      return items.map((m) => ({
        key: m.id ?? m.title,
        href: m.id ? `/academy/modules/${m.id}` : "#",
        title: m.title,
        metaLine: m.dates,
        subtitle: `${m.content?.length ?? 0} lessons · badges · streak XP`,
        image: m.image,
        disabled: false,
      }));
    }

    if (showMock) {
      return mockItems.map((c) => ({
        key: c.title,
        href: "#",
        title: c.title,
        topLeftBadge: c.badge,
        topLeftBadgeClass: badgePill(c.badge),
        metaLine: c.learnersText,
        subtitle: c.subtitle,
        image: c.image,
        chips: [`${c.level}`, `${c.lessons} lessons`, `${c.minutes} min`, "Free"],
        disabled: true,
      }));
    }

    return [];
  }, [items, mockItems, showMock]);

  const scrollByCards = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>("[data-card]");
    const cardWidth = first?.offsetWidth ?? 320;
    el.scrollBy({ left: dir * (cardWidth * 2 + 16), behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          <Button asChild variant="link" className="hidden sm:inline-flex">
            <Link href={"/academy/courses"}>See all →</Link>
          </Button>
          <Button type="button" variant="outline" size="icon" className="hidden sm:inline-flex" onClick={() => scrollByCards(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="icon" className="hidden sm:inline-flex" onClick={() => scrollByCards(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative mt-4">
        {/* subtle edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-background to-transparent" />

        {cards.length ? (
          <div
            ref={scrollerRef}
            className="flex gap-4 overflow-x-auto pb-3 scroll-smooth [scrollbar-width:thin] snap-x snap-mandatory"
          >
            {cards.map((c) => (
              <div key={c.key} data-card className="min-w-[280px] snap-start">
                <Link
                  href={c.href}
                  aria-disabled={c.disabled}
                  onClick={(e) => {
                    if (c.disabled) e.preventDefault();
                  }}
                >
                  <Card className="group h-full overflow-hidden border-primary/15 transition hover:shadow-lg">
                    <div className="relative h-40 w-full">
                      <Image src={c.image} alt={c.title} fill unoptimized className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                      {c.topLeftBadge ? (
                        <div className="absolute top-3 left-3">
                          <span className={c.topLeftBadgeClass}>{c.topLeftBadge}</span>
                        </div>
                      ) : null}

                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="text-xs text-white/80">{c.metaLine}</div>
                        <div className="mt-1 line-clamp-2 text-sm font-semibold text-white">{c.title}</div>
                      </div>

                      {/* hover overlay */}
                      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="h-2 w-full rounded-full bg-white/20">
                            <div className="h-2 w-[45%] rounded-full bg-primary" />
                          </div>
                          <div className="mt-2 text-xs text-white/80">45% complete · Continue</div>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground">{c.subtitle}</div>
                      {c.chips?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                          {c.chips.map((x: string) => (
                            <span key={x} className="rounded-full border px-2 py-0.5">
                              {x}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </CardContent>

                    <CardFooter className="p-4 pt-0">
                      <Button className="w-full" variant="outline" disabled={c.disabled}>
                        {c.disabled ? "Coming soon" : "View course"}
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-6 text-sm text-muted-foreground">
              No published courses yet. Publish modules to populate the Academy, or create your first one now.
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button asChild size="sm">
                  <Link href="/dashboard/modules/new">Create a course</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/dashboard/modules">Manage modules</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

