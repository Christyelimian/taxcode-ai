"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpDown,
  BadgeCheck,
  BookOpen,
  Filter,
  GraduationCap,
  Search,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type AcademyCourseCard = {
  id?: string;
  title: string;
  subtitle: string;
  lessons: number;
  minutes: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: "Rights" | "Reforms" | "VAT" | "PAYE" | "Disputes" | "Planning" | "General";
  badge?: "New" | "Popular" | "Recommended";
  meta?: string;
  imageUrl: string;
  href: string;
  createdAtISO?: string;
  source: "published" | "preview";
};

const CATEGORIES: AcademyCourseCard["category"][] = [
  "Rights",
  "Reforms",
  "VAT",
  "PAYE",
  "Disputes",
  "Planning",
  "General",
];

function badgeClass(b: NonNullable<AcademyCourseCard["badge"]>) {
  if (b === "New") return "bg-primary/10 text-primary";
  if (b === "Popular") return "bg-foreground/10 text-foreground";
  return "bg-primary text-primary-foreground";
}

function pathCards() {
  return [
    {
      title: "For Yourself",
      subtitle: "Start with rights + basic compliance. No jargon.",
      icon: <Users className="h-5 w-5 text-primary" />,
      chips: ["Rights", "Reforms", "General"] as const,
    },
    {
      title: "For Small Businesses",
      subtitle: "VAT, PAYE basics, records, and dispute prevention.",
      icon: <BadgeCheck className="h-5 w-5 text-primary" />,
      chips: ["VAT", "PAYE", "Disputes"] as const,
    },
    {
      title: "For Students & Youth",
      subtitle: "Tax literacy and how systems work in practice.",
      icon: <GraduationCap className="h-5 w-5 text-primary" />,
      chips: ["General", "Rights", "Reforms"] as const,
    },
    {
      title: "For Community Educators",
      subtitle: "Teach others. Earn badges. Become a Tax Champion.",
      icon: <BookOpen className="h-5 w-5 text-primary" />,
      chips: ["Rights", "Disputes", "General"] as const,
    },
  ];
}

export default function AcademyCoursesClient({ courses }: { courses: AcademyCourseCard[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<AcademyCourseCard["category"] | "All">("All");
  const [sort, setSort] = useState<"recommended" | "newest" | "popular" | "title">("recommended");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = courses;
    if (category !== "All") list = list.filter((c) => c.category === category);
    if (q) list = list.filter((c) => `${c.title} ${c.subtitle}`.toLowerCase().includes(q));

    const score = (c: AcademyCourseCard) => {
      if (c.badge === "Recommended") return 3;
      if (c.badge === "Popular") return 2;
      if (c.badge === "New") return 1;
      return 0;
    };

    const sorted = [...list];
    sorted.sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "newest") return (b.createdAtISO ?? "").localeCompare(a.createdAtISO ?? "");
      if (sort === "popular") return (b.badge === "Popular" ? 1 : 0) - (a.badge === "Popular" ? 1 : 0);
      // recommended default: badge score + keep published above preview
      return (
        (b.source === "published" ? 10 : 0) +
        score(b) -
        ((a.source === "published" ? 10 : 0) + score(a))
      );
    });

    return sorted;
  }, [courses, query, category, sort]);

  return (
    <div className="bg-background">
      <section className="border-b bg-primary/5">
        <div className="container mx-auto px-4 py-14">
          <Badge variant="secondary" className="mb-4">
            🎓 Tax Academy
          </Badge>
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-primary">
            Courses
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
            Discover courses by what Nigerians need most right now. Learn fast, keep streaks, and build confidence.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {pathCards().map((p) => (
              <button
                key={p.title}
                type="button"
                onClick={() => setCategory(p.chips[0] as any)}
                className="text-left"
              >
                <Card className="h-full transition hover:shadow-lg hover:-translate-y-0.5">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      {p.icon} {p.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {p.subtitle}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.chips.map((c) => (
                        <span key={c} className="rounded-full border px-2 py-0.5 text-xs">
                          {c}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses (VAT, rights, reforms, disputes...)"
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <div className="min-w-[220px]">
                <Select value={category} onValueChange={(v) => setCategory(v as any)}>
                  <SelectTrigger>
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All categories</SelectItem>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="min-w-[220px]">
                <Select value={sort} onValueChange={(v) => setSort(v as any)}>
                  <SelectTrigger>
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="popular">Most popular</SelectItem>
                    <SelectItem value="title">A → Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/academy">Back to Academy</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Start learning free</Link>
            </Button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Quick filters:</span>
          <Button size="sm" variant={category === "All" ? "default" : "outline"} onClick={() => setCategory("All")}>
            All
          </Button>
          {CATEGORIES.slice(0, 6).map((c) => (
            <Button
              key={c}
              size="sm"
              variant={category === c ? "default" : "outline"}
              onClick={() => setCategory(c)}
            >
              {c}
            </Button>
          ))}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Link
              key={`${c.source}-${c.id ?? c.title}`}
              href={c.href}
              onClick={(e) => {
                if (c.source === "preview") e.preventDefault();
              }}
              aria-disabled={c.source === "preview"}
            >
              <Card className="group h-full overflow-hidden border-primary/15 transition hover:shadow-lg">
                <div className="relative h-44 w-full">
                  <Image src={c.imageUrl} alt={c.title} fill unoptimized className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    {c.badge ? (
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${badgeClass(c.badge)}`}>
                        {c.badge}
                      </span>
                    ) : null}
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white">
                      {c.level}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="text-xs text-white/75">{c.meta ?? (c.source === "preview" ? "Preview" : "Published")}</div>
                    <div className="mt-1 line-clamp-2 text-sm font-semibold text-white">{c.title}</div>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground line-clamp-2">{c.subtitle}</div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full border px-2 py-0.5">{c.category}</span>
                    <span className="rounded-full border px-2 py-0.5">{c.lessons} lessons</span>
                    <span className="rounded-full border px-2 py-0.5">{c.minutes} min</span>
                    <span className="rounded-full border px-2 py-0.5">{c.source === "preview" ? "Coming soon" : "Free"}</span>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <Button className="w-full" variant="outline" disabled={c.source === "preview"}>
                    {c.source === "preview" ? "Coming soon" : "View course"}
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-12 text-center text-muted-foreground">
            No courses match your filters. Try a different search or reset filters.
          </div>
        ) : null}
      </section>
    </div>
  );
}

