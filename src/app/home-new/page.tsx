"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Building2,
  GraduationCap,
  HandHeart,
  Handshake,
  Landmark,
  MapPin,
  Newspaper,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

type CounterMetric = {
  label: string;
  value: number;
  icon: React.ReactNode;
  suffix?: string;
};

function formatNumber(n: number) {
  return new Intl.NumberFormat("en-NG").format(n);
}

function AnimatedCounter({
  value,
  durationMs = 900,
}: {
  value: number;
  durationMs?: number;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const from = 0;
    const to = value;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, durationMs]);

  return <span className="tabular-nums">{formatNumber(display)}</span>;
}

export default function NewHomePage() {
  const impactMetrics: CounterMetric[] = useMemo(
    () => [
      { label: "Nigerians Educated", value: 156_420, icon: <BookOpen className="h-5 w-5 text-primary" /> },
      { label: "Certified Learners", value: 12_450, icon: <GraduationCap className="h-5 w-5 text-primary" /> },
      { label: "Communities Reached", value: 847, icon: <MapPin className="h-5 w-5 text-primary" /> },
      { label: "Rights Cases Supported", value: 2_340, icon: <Scale className="h-5 w-5 text-primary" /> },
      { label: "Partner Organizations", value: 15, icon: <Handshake className="h-5 w-5 text-primary" /> },
      { label: "Advocacy Campaigns", value: 127, icon: <Newspaper className="h-5 w-5 text-primary" /> },
    ],
    []
  );

  const rights = useMemo(
    () => [
      { title: "Right to Fair Treatment", description: "You deserve dignity, clarity, and equal treatment in tax administration.", href: "/start-here" },
      { title: "Right to Clear Information", description: "Tax rules should be understandable. Learn what the law says in plain language.", href: "/insights" },
      { title: "Right to Appeal Decisions", description: "Know the lawful steps to challenge assessments, penalties, and enforcement actions.", href: "/insights" },
      { title: "Right to Privacy", description: "Understand how your data should be handled and what to do when confidentiality is breached.", href: "/start-here" },
      { title: "Right to Representation", description: "You can seek professional or community support when navigating disputes or compliance.", href: "/contact" },
      { title: "Right to Timely Refunds", description: "Learn what timelines and documentation typically apply to lawful refunds.", href: "/insights" },
    ],
    []
  );

  const liveActivity = useMemo(
    () => [
      { icon: <GraduationCap className="h-4 w-4 text-primary" />, text: 'Amina from Kano completed "Understanding VAT"' },
      { icon: <BookOpen className="h-4 w-4 text-primary" />, text: '15 people are reading "Small Business Tax Rights"' },
      { icon: <ShieldCheck className="h-4 w-4 text-primary" />, text: 'Ibrahim earned a "Tax Advocate" badge' },
      { icon: <Landmark className="h-4 w-4 text-primary" />, text: '"2026 Reform Guide" downloaded 43 times today' },
      { icon: <Users className="h-4 w-4 text-primary" />, text: "New community member from Port Harcourt joined" },
      { icon: <Scale className="h-4 w-4 text-primary" />, text: "3 taxpayer rights cases supported this week" },
    ],
    []
  );

  const [query, setQuery] = useState("");

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <main>
        {/* Mission Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/hero2.jpg"
              alt="Diverse Nigerians learning together"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-background" />
          </div>

          <div className="relative container mx-auto px-4 pt-16 pb-14 md:pt-24 md:pb-20">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-4 text-xs sm:text-sm font-semibold">
                🇳🇬 Tax Knowledge is Power
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-headline font-extrabold tracking-tight text-white">
                Empowering Every Nigerian Through{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-primary bg-clip-text text-transparent">
                  Tax Education
                </span>
              </h1>
              <p className="mt-5 text-base sm:text-lg md:text-xl text-white/90 max-w-[68ch]">
                Learn your rights, understand the reforms, and make confident decisions. TaxCode exists for public good:
                practical education, advocacy, and tools that help Nigerians navigate tax with clarity.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex w-full items-center gap-2 rounded-xl border border-white/15 bg-white/10 p-2 backdrop-blur-sm sm:max-w-xl">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder='What do you want to learn about tax?'
                    className="border-0 bg-transparent text-white placeholder:text-white/60 focus-visible:ring-0"
                    aria-label="Search tax topics"
                  />
                  <Button
                    type="button"
                    className="shrink-0"
                    asChild
                  >
                    <Link href={query.trim() ? `/insights?query=${encodeURIComponent(query.trim())}` : "/insights"}>
                      Search <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                <div className="rounded-xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur-sm">
                  <div className="text-sm text-white/70">📚 Educated</div>
                  <div className="mt-1 text-xl font-bold">156,420+</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur-sm">
                  <div className="text-sm text-white/70">🎓 Certified</div>
                  <div className="mt-1 text-xl font-bold">12,450</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur-sm">
                  <div className="text-sm text-white/70">🤝 Mission</div>
                  <div className="mt-1 text-xl font-bold">Non‑Profit</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur-sm">
                  <div className="text-sm text-white/70">🆓 Learning</div>
                  <div className="mt-1 text-xl font-bold">Always Free</div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild className="text-base font-bold w-full sm:w-auto">
                  <Link href="/start-here">Start Learning Free</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="text-base font-bold w-full sm:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Link href="#rights">Know Your Rights</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="text-base font-bold w-full sm:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Link href="#reforms">2026 Reforms</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Trust indicators */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="grid gap-4 rounded-2xl border bg-card p-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-start gap-3">
                <HandHeart className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="font-semibold">100% Mission</div>
                  <div className="text-sm text-muted-foreground">Non‑profit public‑interest education & advocacy.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="font-semibold">Privacy Protected</div>
                  <div className="text-sm text-muted-foreground">No hidden agenda. Build trust through transparency.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="font-semibold">Made for Nigerians</div>
                  <div className="text-sm text-muted-foreground">Local context, plain language, practical guidance.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="font-semibold">Core Services Free</div>
                  <div className="text-sm text-muted-foreground">Knowledge should never be gated.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Counter */}
        <section className="bg-primary/5 py-16 md:py-20" id="impact">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-headline font-bold text-primary">Our Impact on Nigerian Lives</h2>
              <p className="mx-auto mt-3 max-w-3xl text-lg text-foreground/80">
                We measure progress by people empowered — not money promised.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {impactMetrics.map((m) => (
                <Card key={m.label} className="bg-card">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      {m.icon}
                      <CardTitle className="text-base">{m.label}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">
                      <AnimatedCounter value={m.value} />
                      {m.suffix ?? ""}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/about">See Our Impact Report</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#get-involved">Join Our Mission</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Choose learning path */}
        <section className="py-16 md:py-20" id="paths">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-headline font-bold text-primary">Who Do You Want to Empower Today?</h2>
              <p className="mx-auto mt-3 max-w-3xl text-lg text-foreground/80">(100% Free Educational Resources)</p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" /> Yourself
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Free guides, simple explanations, and practical steps for everyday taxpayers.
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/start-here">Learn →</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" /> Your Small Business
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Rights-focused SME resources, compliance basics, and tools that reduce confusion.
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/dashboard/tools">Learn →</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HandHeart className="h-5 w-5 text-primary" /> Your Community
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Workshop materials, civic education content, and shareable explainers.
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/focus-areas">Learn →</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" /> Students & Youth
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Tax literacy modules and youth-friendly learning journeys.
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/dashboard/modules">Learn →</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="mt-10 text-center text-sm text-muted-foreground">
              All resources are <span className="font-semibold text-foreground">FREE</span>. Knowledge should never be gated.
            </div>
          </div>
        </section>

        {/* Live learning */}
        <section className="bg-primary/5 py-16 md:py-20" id="live">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h2 className="text-3xl font-headline font-bold text-primary">Nigerians Learning Right Now</h2>
                <p className="mt-2 text-lg text-foreground/80">Learning achievements, community growth, and rights support.</p>
              </div>
              <Button asChild size="lg">
                <Link href="/signup">Join 156,420+ Nigerians →</Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" /> Live Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {liveActivity.map((row, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5">{row.icon}</div>
                      <div className="text-sm text-foreground/90">{row.text}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" /> Popular Right Now
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <Link href="/insights" className="group rounded-xl border p-4 hover:bg-primary/5 transition-colors">
                    <div className="font-semibold">Small Business Tax Rights</div>
                    <div className="text-sm text-muted-foreground">Know what you can demand — and what you must do.</div>
                    <div className="mt-2 text-sm text-primary flex items-center gap-2">
                      Read <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                  <Link href="/insights" className="group rounded-xl border p-4 hover:bg-primary/5 transition-colors">
                    <div className="font-semibold">Understanding VAT (Made Simple)</div>
                    <div className="text-sm text-muted-foreground">Clear concepts, examples, and common mistakes.</div>
                    <div className="mt-2 text-sm text-primary flex items-center gap-2">
                      Read <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 2026 Reform education */}
        <section className="py-16 md:py-20" id="reforms">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
              <div>
                <Badge variant="secondary" className="mb-3 text-sm font-semibold">
                  📜 Understanding Nigeria&apos;s Historic Tax Transformation
                </Badge>
                <h2 className="text-3xl font-headline font-bold text-primary">The 2026 Reform Story</h2>
                <p className="mt-3 text-lg text-foreground/80">
                  Citizen education builds accountability. When you understand the rules, you can protect yourself and strengthen Nigeria.
                </p>

                <div className="mt-7 rounded-2xl border bg-card p-6">
                  <div className="font-semibold">What changed?</div>
                  <Separator className="my-4" />
                  <ul className="grid gap-2 text-sm text-muted-foreground">
                    <li>✅ More citizens exempt from tax (≤ ₦800K)</li>
                    <li>✅ Simplified compliance for small businesses</li>
                    <li>✅ Clearer taxpayer rights</li>
                    <li>✅ Better government accountability</li>
                    <li>✅ Fair taxation across all sectors</li>
                  </ul>
                </div>
              </div>

              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Landmark className="h-5 w-5 text-primary" /> Why it matters to you
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Understanding your rights protects you. Informed citizens create better institutions, fairer outcomes, and more accountable governance.
                </CardContent>
                <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button asChild className="w-full sm:w-auto">
                    <Link href="/insights">Read Full Breakdown</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full sm:w-auto">
                    <Link href="/dashboard/modules">Take Free Course</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full sm:w-auto">
                    <Link href="#rights">Know Your Rights</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Know Your Rights */}
        <section className="bg-primary/5 py-16 md:py-20" id="rights">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-headline font-bold text-primary">⚖️ Every Nigerian Has Tax Rights</h2>
              <p className="mx-auto mt-3 max-w-3xl text-lg text-foreground/80">
                Learn the fundamentals. Know what to ask. Understand the lawful steps to resolve disputes.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {rights.map((r) => (
                <Card key={r.title} className="group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="h-5 w-5 text-primary" /> {r.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">{r.description}</CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={r.href}>
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="mt-10 grid gap-4 rounded-2xl border bg-card p-6 lg:grid-cols-2">
              <div>
                <div className="font-semibold">Being violated?</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  If you need help understanding options or next steps, contact us. We’ll point you to educational guidance and support pathways.
                </div>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <Button asChild>
                    <Link href="/contact">File a Complaint</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/contact">Contact Tax Ombuds</Link>
                  </Button>
                </div>
              </div>
              <div>
                <div className="font-semibold">Need help?</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Find learning resources, get guided support, and connect with community education initiatives.
                </div>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <Button asChild variant="outline">
                    <Link href="/start-here">Find Free Legal Aid</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/news">Join Support Group</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Meet TaxPal */}
        <section className="py-16 md:py-20 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <Badge variant="secondary" className="mb-3 text-sm font-semibold">
                  🤖 Your Tax Companion
                </Badge>
                <h2 className="text-3xl font-headline font-bold text-primary mb-4">Meet TaxPal: Nigeria's Smartest Tax Assistant</h2>
                <p className="text-lg text-foreground/80 mb-6">
                  Ask any tax question in English, Hausa, Yoruba, or Igbo. Get instant, accurate answers grounded in Nigerian law,
                  practical guidance, and real-world context. No more confusion — just clear, helpful responses.
                </p>
                <div className="grid gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">✓</div>
                    <div>
                      <div className="font-semibold">Multi-Language Support</div>
                      <div className="text-sm text-muted-foreground">Communicate in your preferred language</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">✓</div>
                    <div>
                      <div className="font-semibold">98% Accuracy</div>
                      <div className="text-sm text-muted-foreground">Answers backed by official tax knowledge base</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">✓</div>
                    <div>
                      <div className="font-semibold">Free for Everyone</div>
                      <div className="text-sm text-muted-foreground">5 questions per day, no signup required</div>
                    </div>
                  </div>
                </div>
                <Button asChild size="lg" className="font-semibold">
                  <Link href="/assistant">Try TaxPal Now →</Link>
                </Button>
              </div>

              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" /> Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="bg-slate-50 p-4 space-y-4">
                    {/* Sample conversation */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white text-sm font-semibold">U</div>
                      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 text-sm shadow-sm max-w-[80%]">
                        How do I file my personal income tax?
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-emerald-50 rounded-2xl rounded-tl-sm px-4 py-3 text-sm shadow-sm max-w-[80%]">
                        <div className="text-emerald-800">
                          To file your Personal Income Tax (PIT) in Nigeria:
                          <br />1. Register with FIRS if you haven't
                          <br />2. Use the FIRS portal or e-tax app
                          <br />3. Submit by March 31st
                          <br />4. Pay any outstanding tax
                        </div>
                        <div className="mt-2 text-xs text-emerald-600">💡 Need help with registration? Ask me!</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white text-sm font-semibold">U</div>
                      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 text-sm shadow-sm max-w-[80%]">
                        What if I'm self-employed?
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-emerald-50 rounded-2xl rounded-tl-sm px-4 py-3 text-sm shadow-sm max-w-[80%]">
                        <div className="text-emerald-800">
                          Self-employed individuals must file PIT if income exceeds ₦300,000 annually.
                          Keep proper records of all income and expenses for accurate reporting.
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/assistant">Start Chatting</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Free AI Tools */}
        <section className="py-16 md:py-20" id="tools">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-headline font-bold text-primary">🤖 AI‑Powered Tools. Always Free for Education.</h2>
              <p className="mx-auto mt-3 max-w-3xl text-lg text-foreground/80">
                Technology for public good — not profit extraction.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" /> Free Calculators
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Estimate and learn — with explanations, not hype.</CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/dashboard/calculator">Try Free</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" /> Learn Tax
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Free modules and explainers across key topics and sectors.</CardContent>
                <CardFooter>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/dashboard/modules">Start Learning</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-primary" /> Know Your Rights
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Rights-first learning paths for citizens and SMEs.</CardContent>
                <CardFooter>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="#rights">Explore</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" /> Community
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Connect with other taxpayers and share knowledge.</CardContent>
                <CardFooter>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/news">Join Community</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="mt-10 grid gap-4 rounded-2xl border bg-card p-6 md:grid-cols-3">
              <div>
                <div className="font-semibold">Basic tools</div>
                <div className="text-sm text-muted-foreground">Free forever for individuals.</div>
              </div>
              <div>
                <div className="font-semibold">Advanced features</div>
                <div className="text-sm text-muted-foreground">Subsidized by grants & donations.</div>
              </div>
              <div>
                <div className="font-semibold">Enterprise</div>
                <div className="text-sm text-muted-foreground">Revenue supports free programs.</div>
              </div>
            </div>
          </div>
        </section>

        {/* Gamified learning */}
        <section className="bg-primary/5 py-16 md:py-20" id="gamification">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-headline font-bold text-primary">🎓 Make Tax Education Fun & Rewarding</h2>
              <p className="mx-auto mt-3 max-w-3xl text-lg text-foreground/80">
                Learn. Share. Empower. Build Nigeria together.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Meaningful badges</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                  {[
                    { name: "Tax Aware", desc: "Level 1–3", icon: <Sparkles className="h-4 w-4 text-primary" /> },
                    { name: "Informed Citizen", desc: "Level 4–7", icon: <Users className="h-4 w-4 text-primary" /> },
                    { name: "Advocate", desc: "Level 8–12", icon: <Scale className="h-4 w-4 text-primary" /> },
                    { name: "Champion", desc: "Level 13+", icon: <ShieldCheck className="h-4 w-4 text-primary" /> },
                  ].map((b) => (
                    <div key={b.name} className="rounded-xl border p-4">
                      <div className="flex items-center gap-2 font-semibold">
                        {b.icon} {b.name}
                      </div>
                      <div className="text-sm text-muted-foreground">{b.desc}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sample learning journey</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-primary">✅</div>
                    <div>
                      Join Community → <span className="font-semibold">“Tax Aware”</span> (+10 XP)
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-primary">✅</div>
                    <div>
                      Complete Tax 101 → <span className="font-semibold">“Informed Citizen”</span> (+50 XP)
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-muted-foreground">⬜</div>
                    <div>
                      Know Your Rights → <span className="font-semibold">“Rights Defender”</span> (+100 XP)
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-muted-foreground">⬜</div>
                    <div>
                      Help 3 Community Members → <span className="font-semibold">“Community Helper”</span> (+75 XP)
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-muted-foreground">⬜</div>
                    <div>
                      Complete All Courses → <span className="font-semibold">“Tax Champion”</span> (+500 XP)
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/dashboard/modules">Start Learning →</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Community impact map (lightweight placeholder) */}
        <section className="py-16 md:py-20" id="map">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-headline font-bold text-primary">🇳🇬 Our Reach Across Nigeria</h2>
              <p className="mx-auto mt-3 max-w-3xl text-lg text-foreground/80">
                We&apos;ve reached every state. Is your community next?
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              <Card className="overflow-hidden">
                <div className="relative h-64 w-full">
                  <Image src="/slider.jpg" alt="Nigeria map placeholder" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/35" />
                  <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur-sm">
                    <div className="font-semibold">Interactive map coming soon</div>
                    <div className="text-sm text-white/80">We&apos;re building a state-by-state impact view.</div>
                  </div>
                </div>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Local snapshots</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    <span className="font-semibold text-foreground">Lagos:</span> 34,520 educated · 127 workshops · 8 partners
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Kano:</span> 12,340 educated · 45 workshops · 5 partners
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Abuja (FCT):</span> 23,890 educated · 89 workshops · 12 partners
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild className="w-full sm:w-auto">
                    <Link href="#get-involved">Bring Tax Education to Your Area</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full sm:w-auto">
                    <Link href="#partners">Partner With Us</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Real stories */}
        <section className="bg-primary/5 py-16 md:py-20" id="stories">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-headline font-bold text-primary">💬 How We&apos;ve Empowered Nigerians</h2>
              <p className="mx-auto mt-3 max-w-3xl text-lg text-foreground/80">
                Stories of learning, rights protection, and community leadership.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Chioma O. — Small Business Owner, Enugu</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  “As a small business owner in Enugu, I never understood my tax rights. TaxCode taught me how to protect my business and advocate for fair treatment. Now I help other business owners in my community.”
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline">
                    <Link href="/news">More stories</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>More impact</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <div>• Student who now teaches tax literacy in her community</div>
                  <div>• Accountant who offers free tax clinics</div>
                  <div>• Retiree who advocates for taxpayer rights</div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/signup">Share your story</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Partnership showcase */}
        <section className="py-16 md:py-20" id="partners">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-headline font-bold text-primary">🤝 Building a Better Nigeria Together</h2>
              <p className="mx-auto mt-3 max-w-3xl text-lg text-foreground/80">
                Collaboration strengthens trust, reach, and impact.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Government Partners", icon: <Landmark className="h-5 w-5 text-primary" />, items: ["NRS", "Tax Ombuds", "Ministry of Finance"] },
                { title: "International Support", icon: <Handshake className="h-5 w-5 text-primary" />, items: ["France DGFiP partnership", "Capacity building", "Knowledge transfer"] },
                { title: "Academic Partners", icon: <GraduationCap className="h-5 w-5 text-primary" />, items: ["University of Lagos", "UNIABUJA", "Others"] },
                { title: "Civil Society", icon: <Users className="h-5 w-5 text-primary" />, items: ["NGO partners", "Professional bodies", "Community groups"] },
              ].map((p) => (
                <Card key={p.title}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {p.icon} {p.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    {p.items.map((it) => (
                      <div key={it}>• {it}</div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Button asChild size="lg">
                <Link href="#get-involved">Become a Partner</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Transparent funding */}
        <section className="bg-primary/5 py-16 md:py-20" id="funding">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-headline font-bold text-primary">💰 How We Fund Our Mission (Full Transparency)</h2>
              <p className="mx-auto mt-3 max-w-3xl text-lg text-foreground/80">
                Enterprise revenue subsidizes free access for individuals. We publish impact and spending information.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Our funding</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <span>Grants & Foundations</span>
                    <span className="font-semibold text-foreground">45%</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <span>Enterprise Subscriptions</span>
                    <span className="font-semibold text-foreground">30%</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <span>Individual Donations</span>
                    <span className="font-semibold text-foreground">15%</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <span>Partnership Revenue</span>
                    <span className="font-semibold text-foreground">10%</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>How we use it</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <span>Free Education</span>
                    <span className="font-semibold text-foreground">60%</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <span>Technology</span>
                    <span className="font-semibold text-foreground">25%</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <span>Advocacy</span>
                    <span className="font-semibold text-foreground">10%</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <span>Operations</span>
                    <span className="font-semibold text-foreground">5%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-10 text-center text-sm text-muted-foreground">
              100% of individual donations go to free programs. Enterprise revenue helps keep core services free.
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg" variant="outline">
                <Link href="/about">View Annual Report</Link>
              </Button>
              <Button asChild size="lg">
                <Link href="#get-involved">Support Our Mission</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Get involved */}
        <section className="py-16 md:py-20" id="get-involved">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-headline font-bold text-primary">Get Involved</h2>
              <p className="mx-auto mt-3 max-w-3xl text-lg text-foreground/80">
                Multiple ways to participate — learn, volunteer, donate, advocate, and share knowledge.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" /> Start Learning
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Begin with free paths designed for citizens, SMEs, and youth.</CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/start-here">Start Learning Free</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" /> Volunteer
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Help with community education, workshops, and mentoring.</CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/contact">Volunteer</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HandHeart className="h-5 w-5 text-primary" /> Donate
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Support free programs and rights education across Nigeria.</CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/contact">Support Our Mission</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Handshake className="h-5 w-5 text-primary" /> Partner
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">Bring tax education to workplaces, schools, and communities.</CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/contact">Partner With Us</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="mt-12 rounded-2xl border bg-card p-6">
              <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <div className="font-semibold">Newsletter</div>
                  <div className="text-sm text-muted-foreground">Get reform explainers, rights updates, and new resources.</div>
                </div>
                <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
                  <Input placeholder="you@example.com" className="w-full sm:w-80" aria-label="Email address" />
                  <Button type="button">Stay informed</Button>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <div className="text-sm text-muted-foreground">
                Need advanced tools for your organization?{" "}
                <Link href="/dashboard" className="font-semibold text-primary hover:underline">
                  See enterprise options
                </Link>{" "}
                (revenue supports free education).
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

