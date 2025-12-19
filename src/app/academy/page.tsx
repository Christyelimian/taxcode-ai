import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Award,
  BookOpen,
  Flame,
  GraduationCap,
  Map,
  ShieldCheck,
  Sparkles,
  Swords,
  Trophy,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getTrainingModules } from "@/app/actions";
import { AcademyCourseRow } from "@/components/academy-course-row";

const UNSPLASH = {
  hero: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2400&q=80",
  map: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=2400&q=80",
  community: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2400&q=80",
  skillTree: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=2400&q=80",
};

const COURSE_IMAGES = [
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80", // finance docs
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80", // contract paper
  "https://images.unsplash.com/photo-1556761175-129418cb2dfe?auto=format&fit=crop&w=1600&q=80", // meeting / learning
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80", // team working
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80", // study group
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80", // charts
  "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1600&q=80", // laptop desk
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80", // collaboration
];

const MOCK_ROWS: Record<
  string,
  Array<{
    title: string;
    subtitle: string;
    lessons: number;
    level: "Beginner" | "Intermediate" | "Advanced";
    minutes: number;
    learnersText: string;
    badge: "New" | "Popular" | "Recommended";
  }>
> = {
  "🔥 Trending now": [
    {
      title: "Taxpayer Rights 101",
      subtitle: "Know your rights. Engage confidently and lawfully.",
      lessons: 8,
      level: "Beginner",
      minutes: 35,
      learnersText: "8.9K learners",
      badge: "Popular",
    },
    {
      title: "2026 Tax Reforms (Made Simple)",
      subtitle: "What changed, why it matters, and what to do next.",
      lessons: 10,
      level: "Beginner",
      minutes: 45,
      learnersText: "12.4K learners",
      badge: "Recommended",
    },
    {
      title: "VAT Mastery for SMEs",
      subtitle: "Invoices, filing, and the rules around VAT in practice.",
      lessons: 12,
      level: "Intermediate",
      minutes: 55,
      learnersText: "5.1K learners",
      badge: "Popular",
    },
  ],
  "🆕 New releases": [
    {
      title: "PAYE & Employment Taxes",
      subtitle: "Understand PAYE, deductions, and what employers must do.",
      lessons: 7,
      level: "Beginner",
      minutes: 30,
      learnersText: "New",
      badge: "New",
    },
    {
      title: "Disputes & Appeals Toolkit",
      subtitle: "Steps, timelines, evidence, and calmer dispute handling.",
      lessons: 9,
      level: "Intermediate",
      minutes: 40,
      learnersText: "New",
      badge: "New",
    },
    {
      title: "Small Business Classification",
      subtitle: "Thresholds, obligations, and common errors.",
      lessons: 6,
      level: "Beginner",
      minutes: 25,
      learnersText: "New",
      badge: "New",
    },
  ],
  "🏆 Top rated by community": [
    {
      title: "Record‑Keeping That Prevents Disputes",
      subtitle: "Practical documentation habits that protect you.",
      lessons: 8,
      level: "Beginner",
      minutes: 35,
      learnersText: "⭐ 5.0 (2.3K)",
      badge: "Recommended",
    },
    {
      title: "Audit Survival (Story Scenario)",
      subtitle: "Choose‑your‑path learning through consequences.",
      lessons: 5,
      level: "Intermediate",
      minutes: 20,
      learnersText: "⭐ 4.9 (1.2K)",
      badge: "Popular",
    },
    {
      title: "Tax Planning Basics (Ethical)",
      subtitle: "Plan within the law. Avoid risky shortcuts.",
      lessons: 9,
      level: "Intermediate",
      minutes: 40,
      learnersText: "⭐ 4.9 (890)",
      badge: "Recommended",
    },
  ],
};

function chunk<T>(arr: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function stableIndex(input: string, modulo: number) {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h % modulo;
}

function courseImageFor(title: string) {
  return COURSE_IMAGES[stableIndex(title, COURSE_IMAGES.length)];
}

export default async function AcademyPage() {
  const modulesRes = await getTrainingModules();
  const all = modulesRes.success && modulesRes.data ? modulesRes.data : [];
  const published = all.filter((m) => (m.status ?? "").toLowerCase() === "published");

  // Format modules for display
  const formattedModules = published.map((m) => ({
    id: m.id,
    title: m.title,
    dates: m.dates || '',
    content: m.content || [],
    image: courseImageFor(m.title),
  }));

  // Simple "rows" for the Netflix feel
  const [trending = [], newReleases = [], topRated = []] = chunk(formattedModules, 8);
  const continueCourse = formattedModules[0] ?? null;

  // Debug: Log module counts (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Academy] Total modules: ${all.length}, Published: ${published.length}, Formatted: ${formattedModules.length}`);
  }

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0">
          <Image
            src={UNSPLASH.hero}
            alt="Learning environment"
            fill
            priority
            unoptimized
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-background" />
        </div>

        <div className="relative container mx-auto px-4 py-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-4">
                🎓 Tax Academy
              </Badge>
              <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-white">
                Learn tax like a game.
                <span className="block mt-2 bg-gradient-to-r from-emerald-300 to-primary bg-clip-text text-transparent">
                  Earn XP. Build streaks. Become a Tax Champion.
                </span>
              </h1>
              <p className="mt-4 text-lg text-white/85">
                Not an LMS. A <span className="font-semibold text-white">behavioral learning engine</span> for Nigerians:
                light lessons, visible progress, and community-powered mastery.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="font-semibold">
                  <Link href="#catalog">Browse courses</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="font-semibold bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Link href="/academy/onboard">Join Academy</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="font-semibold bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Link href="#map">Explore the learning map</Link>
                </Button>
              </div>
            </div>

            <Card className="w-full lg:max-w-md bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Your progress (preview)
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <span className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" /> Level
                  </span>
                  <span className="font-semibold">12 · Informed Citizen</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" /> XP
                  </span>
                  <span className="font-semibold">2,450 / 3,000</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <span className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-primary" /> Streak
                  </span>
                  <span className="font-semibold">7 days</span>
                </div>
                <div className="rounded-lg border p-3 text-muted-foreground">
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <Swords className="h-4 w-4 text-primary" /> Active quests
                  </div>
                  <div className="mt-2 space-y-1 text-sm">
                    <div>▶ Complete “VAT Mastery” (+500 XP)</div>
                    <div>▶ Keep a 7‑day streak (+200 XP)</div>
                    <div>▶ Help 3 learners (+150 XP)</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/signup">Create profile</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Continue learning (Netflix hero banner) */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-headline font-bold">Continue learning</h2>
              <p className="text-muted-foreground">Pick up where you left off (this will become personalized).</p>
            </div>
            <Button asChild variant="outline">
              <Link href="#catalog">See all</Link>
            </Button>
          </div>

          <div className="mt-6">
            {continueCourse ? (
              <Card className="overflow-hidden">
                <div className="grid gap-0 md:grid-cols-[1.25fr_1fr]">
                  <div className="relative min-h-[260px]">
                    <Image
                      src={continueCourse.image}
                      alt={continueCourse.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />

                    <div className="relative p-8">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GraduationCap className="h-4 w-4" />
                      Course
                      <span className="mx-1">•</span>
                      <span className="font-medium text-white/80">Recommended</span>
                    </div>
                    <h3 className="mt-3 text-2xl md:text-3xl font-headline font-bold text-white">{continueCourse.title}</h3>
                    <p className="mt-3 text-white/80">
                      {continueCourse.content?.length ?? 0} lessons · {continueCourse.dates}
                    </p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <Button asChild className="font-semibold">
                        <Link href={`/academy/modules/${continueCourse.id}`}>Continue</Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="font-semibold bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Link href={`/academy/modules/${continueCourse.id}`}>Course info</Link>
                      </Button>
                    </div>
                    </div>
                  </div>
                  <div className="border-t md:border-t-0 md:border-l p-8">
                    <div className="text-sm font-semibold">Progress</div>
                    <div className="mt-2 text-sm text-muted-foreground">Lesson 3 of 8 (preview)</div>
                    <div className="mt-3 h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[45%] rounded-full bg-primary" />
                    </div>
                    <div className="mt-4 rounded-lg border bg-card p-4 text-sm text-muted-foreground">
                      Coming next: <span className="font-medium text-foreground">Taxpayer rights & due process</span>
                    </div>

                    <div className="mt-4 rounded-lg border bg-card p-4 text-sm text-muted-foreground">
                      Badge on completion:{" "}
                      <span className="font-medium text-foreground inline-flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" /> Tax Aware
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-muted-foreground">
                  No published courses yet. Create modules in the admin dashboard, then publish them to show here.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Daily lesson (Duolingo style) */}
      <section className="bg-primary/5 py-12" id="daily">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-headline font-bold">Today&apos;s 5‑minute lesson</h2>
              <p className="mt-2 text-muted-foreground">Build the habit. Small daily steps create confident citizens.</p>
            </div>
            <Button asChild size="lg" className="font-semibold">
              <Link href={continueCourse ? `/academy/modules/${continueCourse.id}` : "#catalog"}>
                Start now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-primary" /> Streak
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                🔥 7‑day streak (preview). We&apos;ll connect this to real user accounts next.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" /> XP rewards
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Earn XP for lessons, quizzes, and helping others. Unlock titles: Tax Aware → Informed → Advocate → Champion.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" /> Scenario learning
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                “Choose your own adventure” scenarios (SME, VAT, audits) — memorable learning through consequences.
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <Card className="overflow-hidden">
              <div className="grid md:grid-cols-[1fr_1.1fr]">
                <div className="p-6">
                  <div className="text-sm font-semibold">Today&apos;s topic (preview)</div>
                  <h3 className="mt-2 text-xl font-headline font-bold">VAT on services</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    5 questions · instant feedback · short explanation after each answer.
                  </p>
                  <div className="mt-5 rounded-lg border bg-card p-4 text-sm">
                    <div className="font-semibold">Question 1/5</div>
                    <div className="mt-2 text-muted-foreground">
                      Under the reforms, when can input VAT be recovered?
                    </div>
                    <div className="mt-3 grid gap-2">
                      <Button variant="outline" className="justify-start">A) Always</Button>
                      <Button variant="outline" className="justify-start">B) Never</Button>
                      <Button variant="outline" className="justify-start">C) Only when allowed by the rules</Button>
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">Hint (costs 10 XP) · ❤️❤️❤️ lives</div>
                  </div>
                </div>
                <div className="relative min-h-[320px]">
                  <Image
                    src={UNSPLASH.skillTree}
                    alt="Learning progress visual"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 rounded-xl border bg-background/80 p-4 backdrop-blur">
                    <div className="flex items-center gap-2 font-semibold">
                      <Flame className="h-4 w-4 text-primary" /> Keep your streak alive
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      5 minutes today → stronger confidence tomorrow.
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-full min-h-[420px]">
                <Image
                  src={UNSPLASH.community}
                  alt="People learning together"
                  fill
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="text-sm font-semibold text-white/85">Social Learning Hub (coming next)</div>
                  <h3 className="mt-2 text-2xl font-headline font-bold">Learn together, build Nigeria together.</h3>
                  <p className="mt-2 text-sm text-white/80 max-w-[70ch]">
                    Study groups by location, Q&A board, and “help others” XP—so learners become advocates.
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <Button asChild className="font-semibold">
                      <Link href="/signup">Join community</Link>
                    </Button>
                    <Button asChild variant="outline" className="font-semibold bg-white/10 border-white/20 text-white hover:bg-white/20">
                      <Link href="/news">Community updates</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Skill tree + Map */}
      <section className="py-12" id="map">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-headline font-bold">Your learning journey</h2>
              <p className="text-muted-foreground">RPG-style skill tree + map progression (visual, motivating, memorable).</p>
            </div>
            <Button asChild variant="outline">
              <Link href="#catalog">Jump to catalog</Link>
            </Button>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <Card className="overflow-hidden">
              <div className="relative min-h-[360px]">
                <Image src={UNSPLASH.map} alt="Map navigation concept" fill unoptimized className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white/85">
                    <Map className="h-4 w-4" /> Interactive Learning Map
                  </div>
                  <h3 className="mt-2 text-2xl font-headline font-bold">Beginner Base Camp → Intermediate Villages → Advanced Mountain</h3>
                  <p className="mt-2 text-sm text-white/80">
                    Unlock new areas by completing courses. Locked areas are visible (curiosity), but gated by prerequisites.
                  </p>
                </div>
              </div>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Map features: fog-of-war · zoomable regions · fast travel for unlocked zones · hidden badges.
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative min-h-[360px]">
                <Image src={UNSPLASH.skillTree} alt="Skill tree concept" fill unoptimized className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white/85">
                    <ShieldCheck className="h-4 w-4" /> Skill Tree (Tax domains)
                  </div>
                  <h3 className="mt-2 text-2xl font-headline font-bold">VAT · CIT · PAYE · Rights · Planning</h3>
                  <p className="mt-2 text-sm text-white/80">
                    Complete prerequisites to unlock advanced paths. Titles become part of your public learning identity.
                  </p>
                </div>
              </div>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Levels: Beginner → Informed → Advocate → Expert → Champion · XP for learning + helping others.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Catalog rows (Netflix style) */}
      <section className="py-12" id="catalog">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-headline font-bold">Course catalog</h2>
              <p className="text-muted-foreground">Discover courses by what Nigerians need most right now.</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/dashboard/modules">Admin: manage modules</Link>
            </Button>
          </div>

          <div className="mt-8 space-y-10">
            <AcademyCourseRow
              title="🔥 Trending now"
              items={trending}
              mockItems={published.length === 0 ? MOCK_ROWS["🔥 Trending now"].map(c => ({ ...c, image: courseImageFor(c.title) } as any)) : undefined}
            />
            <AcademyCourseRow
              title="🆕 New releases"
              items={newReleases}
              mockItems={published.length === 0 ? MOCK_ROWS["🆕 New releases"].map(c => ({ ...c, image: courseImageFor(c.title) } as any)) : undefined}
            />
            <AcademyCourseRow
              title="🏆 Top rated by community"
              items={topRated}
              mockItems={published.length === 0 ? MOCK_ROWS["🏆 Top rated by community"].map(c => ({ ...c, image: courseImageFor(c.title) } as any)) : undefined}
            />
          </div>
        </div>
      </section>

      {/* Leaderboard / social proof */}
      <section className="bg-primary/5 py-14">
        <div className="container mx-auto px-4">
          <div className="grid gap-5 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" /> Leaderboards & leagues (preview)
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border p-4">
                  <div className="text-sm font-semibold">Your league</div>
                  <div className="mt-2 text-sm text-muted-foreground">Lagos Division · Rank #4 of 2,340</div>
                  <div className="mt-3 h-2 w-full rounded-full bg-muted">
                    <div className="h-2 w-[62%] rounded-full bg-primary" />
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">↑ +3 spots today</div>
                </div>
                <div className="rounded-xl border p-4">
                  <div className="text-sm font-semibold">Weekly challenge</div>
                  <div className="mt-2 text-sm text-muted-foreground">Complete 5 lessons · Reward: +500 XP boost</div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Time left</span>
                    <span className="font-semibold">3 days</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3 sm:flex-row">
                <Button asChild className="font-semibold">
                  <Link href="/signup">Join the competition</Link>
                </Button>
                <Button asChild variant="outline" className="font-semibold">
                  <Link href="/news">See community highlights</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" /> Community impact
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div>• Study groups by city/state</div>
                <div>• Q&A board with XP rewards</div>
                <div>• “Help others” contributor titles</div>
                <div>• Shareable badges & certificates</div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full font-semibold">
                  <Link href="/contact">Host a workshop</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Community CTA */}
      <section className="bg-primary/5 py-14">
        <div className="container mx-auto px-4">
          <Card className="border-primary/15 bg-background">
            <CardContent className="p-8 md:p-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                  <h3 className="text-2xl font-headline font-bold">Tax Champions Program</h3>
                  <p className="mt-2 text-muted-foreground">
                    Top learners become certified community educators — multiplying impact through peer education.
                  </p>
                </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button asChild className="font-semibold">
                      <Link href="/academy/onboard">Join the Academy</Link>
                    </Button>
                    <Button asChild variant="outline" className="font-semibold">
                      <Link href="/contact">Partner with us</Link>
                    </Button>
                  </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}


