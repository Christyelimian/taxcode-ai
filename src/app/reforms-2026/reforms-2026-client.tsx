"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  FileText,
  Filter,
  HelpCircle,
  Scale,
  Sparkles,
  Timer,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Profile = "individual" | "business" | "enterprise" | "student";

const EFFECTIVE_DATE = new Date("2026-01-01T00:00:00+01:00"); // WAT

function formatNumber(n: number) {
  return new Intl.NumberFormat("en-NG").format(n);
}

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const diffMs = Math.max(0, target.getTime() - now);
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, isLive: diffMs === 0 };
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border bg-background/70 p-4 backdrop-blur">
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

const ACTS = [
  {
    id: "tax-bill",
    icon: <FileText className="h-5 w-5 text-primary" />,
    title: "Nigeria Tax Bill 2024",
    nickname: "The Framework",
    bullets: ["Single tax code direction", "Simplified rates & clearer rules", "More predictable compliance"],
  },
  {
    id: "admin-bill",
    icon: <Scale className="h-5 w-5 text-primary" />,
    title: "Nigeria Tax Administration Bill 2024",
    nickname: "The Enforcer",
    bullets: ["Improved administration", "Compliance procedures", "Data-driven enforcement posture"],
  },
  {
    id: "nrs-bill",
    icon: <Sparkles className="h-5 w-5 text-primary" />,
    title: "Nigeria Revenue Service Bill 2024",
    nickname: "The Institution",
    bullets: ["Modernization push", "Systems & capability upgrade", "Service delivery improvements"],
  },
  {
    id: "jrb-bill",
    icon: <Users className="h-5 w-5 text-primary" />,
    title: "Joint Revenue Board Bill 2024",
    nickname: "The Coordinator",
    bullets: ["Coordination across levels", "Guidance harmonization", "Dispute prevention focus"],
  },
] as const;

function profileCopy(profile: Profile) {
  if (profile === "individual") {
    return {
      title: "For individual taxpayers",
      good: [
        "Potential relief for low/middle-income earners (incl. ₦800,000 tax‑free threshold in the draft design).",
        "Simpler structure: fewer “mystery deductions” and clearer rules in guidance content.",
      ],
      do: [
        "Confirm you have a TIN and your records (pay slips, reliefs, deductions) are organized.",
        "Know what changes in your PAYE calculation and what your employer must do.",
      ],
      ctas: [
        { label: "Browse resources", href: "/resources" },
        { label: "Ask the assistant", href: "/dashboard/assistant" },
      ],
    };
  }
  if (profile === "business") {
    return {
      title: "For business owners",
      good: [
        "Cleaner compliance pathways: checklists, templates, and clearer definitions.",
        "Better predictability when you map VAT, PAYE, WHT and record‑keeping correctly.",
      ],
      do: [
        "Run a readiness check: VAT readiness + PAYE/employee compliance + record keeping.",
        "Set internal owners: who files what, when, and where evidence lives.",
      ],
      ctas: [
        { label: "VAT readiness checklist", href: "/resources" },
        { label: "Start here by role", href: "/start-here" },
      ],
    };
  }
  if (profile === "enterprise") {
    return {
      title: "For large enterprises",
      good: [
        "Stronger push toward digital submission and data‑driven audits (prepare early).",
        "Better governance pathways if your controls and documentation are tight.",
      ],
      do: [
        "Stress-test controls: evidence, approvals, reconciliations, and dispute playbooks.",
        "Align finance + tax + legal teams on a single “reforms readiness” plan.",
      ],
      ctas: [
        { label: "Planning lab (dashboard)", href: "/dashboard" },
        { label: "Ask the assistant", href: "/dashboard/assistant" },
      ],
    };
  }
  return {
    title: "For students / unemployed",
    good: [
      "A clearer system makes learning easier and reduces misinformation.",
      "If you earn income, you’ll know what applies and what doesn’t—earlier.",
    ],
    do: ["Learn the basics: rights, obligations, and how filing works in practice.", "Save key guides and track deadlines as you start earning."],
    ctas: [
      { label: "Tax Academy", href: "/academy" },
      { label: "Start here", href: "/start-here" },
    ],
  };
}

const TIMELINE = [
  { when: "Q4 2024", title: "Awareness campaign begins", text: "Education, consultations, and early materials." },
  { when: "June 26, 2025", title: "Acts signed into law", text: "Implementation planning accelerates." },
  { when: "Jul–Dec 2025", title: "Preparation period", text: "System setup, TIN drives, guidance, testing." },
  { when: "Jan 1, 2026", title: "Reforms take effect", text: "New rules apply across key workflows." },
  { when: "Q1 2026", title: "First filing under new system", text: "New forms/processes and active support." },
] as const;

const FAQS = [
  {
    q: "When do the reforms start?",
    a: "The reforms take effect on January 1, 2026. Use the timeline and readiness checklist to plan your next steps.",
    links: [{ label: "See timeline", href: "#timeline" }],
  },
  {
    q: "How do I know what changed for me?",
    a: "Start with the profile selector to get a tailored summary, then follow the suggested resources and checklists.",
    links: [{ label: "Pick your profile", href: "#impact" }],
  },
  {
    q: "Where can I find templates/checklists?",
    a: "Use the Resources Library for starter guides, objection templates, and VAT/PAYE checklists.",
    links: [{ label: "Open resources", href: "/resources" }],
  },
  {
    q: "Is this legal advice?",
    a: "No—this is educational information. We link to official texts and provide practical explanations for preparation.",
    links: [{ label: "Ask the assistant", href: "/dashboard/assistant" }],
  },
] as const;

export default function Reforms2026Client() {
  const { days, hours, minutes, seconds, isLive } = useCountdown(EFFECTIVE_DATE);
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile>("individual");
  const [compareTab, setCompareTab] = useState<"rates" | "filing" | "enforcement" | "business">("rates");
  const [split, setSplit] = useState(55); // % After overlay width
  const [faqQuery, setFaqQuery] = useState("");
  const [email, setEmail] = useState("");
  const [prefs, setPrefs] = useState({ deadlines: true, resources: true, business: false, deep: false });
  const [submitted, setSubmitted] = useState(false);
  const deepDiveRef = useRef<HTMLDivElement | null>(null);

  const impact = useMemo(() => profileCopy(profile), [profile]);
  const filteredFaqs = useMemo(() => {
    const q = faqQuery.trim().toLowerCase();
    if (!q) return FAQS;
    return FAQS.filter((x) => `${x.q} ${x.a}`.toLowerCase().includes(q));
  }, [faqQuery]);

  const countdownLabel = isLive
    ? "In effect now"
    : `${formatNumber(days)}d : ${hours.toString().padStart(2, "0")}h : ${minutes.toString().padStart(2, "0")}m : ${seconds
        .toString()
        .padStart(2, "0")}s`;

  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="border-b bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col gap-6">
            <Badge variant="secondary" className="w-fit">
              2026 Tax Reforms Hub
            </Badge>

            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight">
                  Nigeria’s tax reforms, explained in plain language
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                  Understand what changed, what it means for you, and what to do next—fast. Built for mobile, built for clarity.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Button asChild>
                    <Link href="#impact">
                      Start with your profile <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/dashboard/assistant">Ask the assistant</Link>
                  </Button>
                  <Button asChild variant="ghost">
                    <Link href="/resources">Get templates & checklists</Link>
                  </Button>
                </div>

                <div className="mt-10 grid gap-3 sm:grid-cols-3">
                  <Stat value="4" label="Reform acts" />
                  <Stat value="Jan 1, 2026" label="Effective date" />
                  <Stat value="Mobile-first" label="Designed for everyday users" />
                </div>
              </div>

              <Card className="border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="h-5 w-5 text-primary" />
                    Reform takes effect in
                  </CardTitle>
                  <CardDescription>Countdown to January 1, 2026 (WAT).</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border bg-background p-5">
                    <div className="text-sm text-muted-foreground">Countdown</div>
                    <div className="mt-2 font-mono text-2xl sm:text-3xl font-semibold tracking-tight">{countdownLabel}</div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge className={cn("px-3 py-1", isLive ? "bg-primary text-primary-foreground" : "bg-foreground/10 text-foreground")}>
                        {isLive ? "Live" : "Preparation window"}
                      </Badge>
                      <Badge variant="outline" className="px-3 py-1">
                        Plan your checklist now
                      </Badge>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Button asChild size="sm">
                        <Link href="#timeline">
                          See timeline <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href="/resources">Download readiness items</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1 - ACTS OVERVIEW */}
      <section className="container mx-auto px-4 py-14" id="overview">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl md:text-3xl font-headline font-bold tracking-tight">The 4 acts that change everything</h2>
          <p className="max-w-3xl text-muted-foreground">
            A clean “mental model” of the reforms. Start here, then drill down only where you need detail.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ACTS.map((a) => (
            <Card key={a.id} className="h-full transition hover:shadow-lg hover:-translate-y-0.5">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-primary/10 p-2">{a.icon}</div>
                  <div>
                    <CardTitle className="text-base">{a.title}</CardTitle>
                    <CardDescription className="mt-1 italic">{a.nickname}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                {a.bullets.map((b) => (
                  <div key={b} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                    <span>{b}</span>
                  </div>
                ))}
                <div className="pt-2">
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0"
                    onClick={() => deepDiveRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  >
                    Deep dive <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* SECTION 2 - IMPACT */}
      <section className="container mx-auto px-4 py-14" id="impact">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-headline font-bold tracking-tight">How does this affect you?</h2>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              Pick a profile to get a tailored explanation, plus what to do next. This is a prototype—content will be tightened as official
              guidance is mapped.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button variant={profile === "individual" ? "default" : "outline"} onClick={() => setProfile("individual")}>
                Individual taxpayer
              </Button>
              <Button variant={profile === "business" ? "default" : "outline"} onClick={() => setProfile("business")}>
                Business owner
              </Button>
              <Button variant={profile === "enterprise" ? "default" : "outline"} onClick={() => setProfile("enterprise")}>
                Large enterprise
              </Button>
              <Button variant={profile === "student" ? "default" : "outline"} onClick={() => setProfile("student")}>
                Student / unemployed
              </Button>
            </div>
          </div>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">{impact.title}</CardTitle>
              <CardDescription>Good news + action steps, in one screen.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-xl border bg-primary/5 p-4">
                <div className="text-sm font-semibold text-primary">Good news</div>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  {impact.good.map((x) => (
                    <li key={x} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border bg-amber-50 p-4 dark:bg-amber-950/30">
                <div className="text-sm font-semibold text-amber-900 dark:text-amber-200">What you should do</div>
                <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                  {impact.do.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ol>
              </div>

              <div className="flex flex-wrap gap-2">
                {impact.ctas.map((c) => (
                  <Button key={c.href} asChild size="sm" variant="outline">
                    <Link href={c.href}>{c.label}</Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* SECTION 3 - TIMELINE */}
      <section className="container mx-auto px-4 py-14" id="timeline">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl md:text-3xl font-headline font-bold tracking-tight">Reform timeline</h2>
            <p className="mt-3 max-w-3xl text-muted-foreground">A simple sequence you can plan against.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/resources">
              Get checklists <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-4">
          {TIMELINE.map((t) => {
            const isKey = t.when === "Jan 1, 2026";
            return (
              <Card key={t.when} className={cn("border-primary/10", isKey && "border-primary/40 bg-primary/5")}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CalendarClock className={cn("h-5 w-5", isKey ? "text-primary" : "text-muted-foreground")} />
                    {t.when}: {t.title}
                  </CardTitle>
                  <CardDescription>{t.text}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <Separator />

      {/* SECTION 4 - BEFORE/AFTER */}
      <section className="container mx-auto px-4 py-14" id="compare">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl md:text-3xl font-headline font-bold tracking-tight">Before vs After</h2>
          <p className="max-w-3xl text-muted-foreground">
            Drag the slider to “blend” the old vs the new. This is a prototype visualization—copy will be finalized from the mapped resources.
          </p>
        </div>

        <Tabs value={compareTab} onValueChange={(v) => setCompareTab(v as any)} className="mt-7">
          <TabsList className="flex flex-wrap h-auto">
            <TabsTrigger value="rates">Tax rates</TabsTrigger>
            <TabsTrigger value="filing">Filing process</TabsTrigger>
            <TabsTrigger value="enforcement">Enforcement</TabsTrigger>
            <TabsTrigger value="business">Business rules</TabsTrigger>
          </TabsList>

          <TabsContent value={compareTab} className="mt-4">
            <Card className="border-primary/20 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Interactive comparison</CardTitle>
                <CardDescription>Slide to reveal “After 2026” over “Before 2026”.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border bg-muted/40 p-4">
                    <div className="text-xs font-semibold tracking-wide text-muted-foreground">BEFORE 2026</div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {compareTab === "rates" && "More complexity for everyday understanding; harder to self-estimate confidently."}
                      {compareTab === "filing" && "Heavier manual steps; more friction for evidence and submissions."}
                      {compareTab === "enforcement" && "Less data alignment; enforcement often reactive and uneven."}
                      {compareTab === "business" && "Ambiguity increases errors; compliance depends on interpretation quality."}
                    </div>
                  </div>
                  <div className="rounded-lg border bg-primary/10 p-4">
                    <div className="text-xs font-semibold tracking-wide text-primary">AFTER 2026</div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {compareTab === "rates" && "A clearer structure with better communication—ideal for tools and plain-language guidance."}
                      {compareTab === "filing" && "Digital-first posture: easier tracking, templates, and repeatable workflows."}
                      {compareTab === "enforcement" && "More data-driven posture: better reason to keep clean records and audit trails."}
                      {compareTab === "business" && "Cleaner definitions + checklists reduce accidental non-compliance and improve planning."}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border bg-background p-4">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="text-sm font-medium">Drag to compare</div>
                    <div className="text-sm text-muted-foreground">After overlay: {split}%</div>
                  </div>
                  <div className="mt-4">
                    <Slider value={[split]} min={0} max={100} step={1} onValueChange={(v) => setSplit(v[0] ?? 55)} />
                  </div>

                  <div className="mt-5 relative overflow-hidden rounded-xl border bg-muted/30">
                    <div className="grid sm:grid-cols-2 gap-0">
                      <div className="p-5">
                        <div className="text-xs font-semibold text-muted-foreground">BEFORE</div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {compareTab === "rates" && "Harder to explain to non-experts. More room for confusion."}
                          {compareTab === "filing" && "Paper-like steps, scattered artifacts, less visibility."}
                          {compareTab === "enforcement" && "Less systematic; gaps in evidence can hurt you."}
                          {compareTab === "business" && "More back-and-forth to clarify what applies."}
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="text-xs font-semibold text-muted-foreground">AFTER</div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {compareTab === "rates" && "Plain-language patterns become possible. Tools can calculate confidently."}
                          {compareTab === "filing" && "More consistent workflows; templates + checklists make it repeatable."}
                          {compareTab === "enforcement" && "Better reason to keep your records and reconcile early."}
                          {compareTab === "business" && "Cleaner compliance playbooks you can follow."}
                        </div>
                      </div>
                    </div>

                    {/* After overlay */}
                    <div
                      className="pointer-events-none absolute inset-y-0 left-0 border-r bg-primary/10 backdrop-blur-[1px]"
                      style={{ width: `${split}%` }}
                      aria-hidden="true"
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href="/insights">Browse explanations</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href="/dashboard/assistant">Ask “what changed?”</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <Separator />

      {/* SECTION 5 - DEEP DIVES */}
      <section className="container mx-auto px-4 py-14" id="deep-dives" ref={deepDiveRef}>
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl md:text-3xl font-headline font-bold tracking-tight">Deep dives (each act)</h2>
          <p className="max-w-3xl text-muted-foreground">
            Expand an act to see a structured summary: overview, key provisions, who it affects, and action items. (Prototype content.)
          </p>
        </div>

        <Card className="mt-7 border-primary/20">
          <CardContent className="p-0">
            <Accordion type="multiple" className="px-6">
              {ACTS.map((a) => (
                <AccordionItem key={a.id} value={a.id}>
                  <AccordionTrigger className="no-underline hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="rounded-md bg-primary/10 p-2">{a.icon}</div>
                      <div className="text-left">
                        <div className="text-sm font-semibold">{a.title}</div>
                        <div className="text-xs text-muted-foreground italic">{a.nickname}</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <div className="grid gap-4 lg:grid-cols-3">
                      <div className="lg:col-span-2 space-y-3">
                        <div className="text-sm font-semibold">Overview</div>
                        <p className="text-sm text-muted-foreground">
                          This section will be finalized from the mapped resources. For now, it shows the consistent structure and layout we
                          want across all four acts.
                        </p>
                        <div className="text-sm font-semibold">Key provisions (prototype)</div>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {a.bullets.map((b) => (
                            <li key={b} className="flex gap-2">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <div className="rounded-xl border bg-muted/30 p-4">
                          <div className="text-sm font-semibold">What to do next</div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            Save resources, run a checklist, and ask targeted questions.
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Button asChild size="sm" variant="outline">
                              <Link href="/resources">Resources</Link>
                            </Button>
                            <Button asChild size="sm" variant="outline">
                              <Link href="/dashboard/assistant">Ask AI</Link>
                            </Button>
                          </div>
                        </div>
                        <div className="rounded-xl border bg-background p-4">
                          <div className="text-sm font-semibold">Official sources</div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            We’ll attach verified citations here as the resource mapping is published.
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* SECTION 6 - RESOURCES */}
      <section className="container mx-auto px-4 py-14" id="resources">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl md:text-3xl font-headline font-bold tracking-tight">Resources you can use today</h2>
            <p className="mt-3 max-w-3xl text-muted-foreground">Starter guides, templates and checklists (prototype aligned to the Resources Library).</p>
          </div>
          <Button asChild>
            <Link href="/resources">
              Open Resources Library <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" /> Guides
              </CardTitle>
              <CardDescription>Fast explanations that unblock action.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {["2026 reforms overview", "Taxpayer rights primer", "Small business compliance starter"].map((x) => (
                <div key={x} className="flex items-center justify-between rounded-md border bg-background px-3 py-2">
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {x}
                  </span>
                  <Badge variant="outline">soon</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> Templates
              </CardTitle>
              <CardDescription>Drafts you can adapt fast.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {["Objection letter (draft)", "Appeal checklist", "Record-keeping template"].map((x) => (
                <div key={x} className="flex items-center justify-between rounded-md border bg-background px-3 py-2">
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {x}
                  </span>
                  <Badge variant="outline">soon</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" /> Checklists
              </CardTitle>
              <CardDescription>Repeatable steps you can run monthly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {["VAT readiness", "PAYE/employee compliance", "Year-end close"].map((x) => (
                <div key={x} className="flex items-center justify-between rounded-md border bg-background px-3 py-2">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    {x}
                  </span>
                  <Badge variant="outline">soon</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Need the right doc fast?</CardTitle>
            <CardDescription>Ask a question; we’ll point you to the closest template, checklist, or guide.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/dashboard/assistant">
                Ask AI to find a template <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/tax-types">Browse tax types</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* SECTION 7 - FAQ */}
      <section className="container mx-auto px-4 py-14" id="faq">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl md:text-3xl font-headline font-bold tracking-tight">FAQ</h2>
            <p className="mt-3 max-w-3xl text-muted-foreground">Fast answers with links to the next best action.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/dashboard/assistant">
              Ask the assistant <Sparkles className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="relative">
              <HelpCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input value={faqQuery} onChange={(e) => setFaqQuery(e.target.value)} className="pl-10" placeholder="Search questions..." />
            </div>

            <Card className="mt-4 border-primary/20">
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="px-6">
                  {filteredFaqs.map((x) => (
                    <AccordionItem key={x.q} value={x.q}>
                      <AccordionTrigger className="no-underline hover:no-underline">
                        <span className="text-left">{x.q}</span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6">
                        <div className="text-sm text-muted-foreground">{x.a}</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {x.links.map((l) => (
                            <Button key={l.href} asChild size="sm" variant="outline">
                              <Link href={l.href}>{l.label}</Link>
                            </Button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {filteredFaqs.length === 0 ? (
              <div className="mt-6 text-sm text-muted-foreground">No matches. Try a simpler keyword (e.g. “TIN”, “VAT”, “PAYE”).</div>
            ) : null}
          </div>

          <Card className="h-fit border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Popular topics</CardTitle>
              <CardDescription>Quick filters to reduce reading.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {["TIN", "PAYE", "VAT", "Rights", "Templates"].map((t) => (
                <Button key={t} size="sm" variant="outline" onClick={() => setFaqQuery(t)}>
                  {t}
                </Button>
              ))}
              <Button size="sm" variant="ghost" onClick={() => setFaqQuery("")}>
                Clear
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* SECTION 8 - STAY UPDATED */}
      <section className="container mx-auto px-4 py-16" id="stay-updated">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-headline font-bold tracking-tight">Stay ahead of 2026</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Get plain-language updates, deadlines, and new tools as they’re published. Prototype form—wire it to a real list when ready.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Card className="border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Next milestone</CardTitle>
                  <CardDescription>January 1, 2026 — reforms take effect</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href="/resources">Download readiness checklist</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Prefer instant answers?</CardTitle>
                  <CardDescription>Ask a targeted question and get next steps.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/dashboard/assistant">Ask AI</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Subscribe for updates</CardTitle>
              <CardDescription>No spam. Unsubscribe anytime.</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                  toast({
                    title: "Subscribed (prototype)",
                    description: "This is a UI prototype. Next step: connect to a real email workflow.",
                  });
                }}
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="email">
                    Email
                  </label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    type="email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Updates you want</div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      { key: "deadlines", label: "Key dates & deadlines" },
                      { key: "resources", label: "New resources & templates" },
                      { key: "business", label: "Business guidance" },
                      { key: "deep", label: "Policy analysis (deep)" },
                    ].map((x) => (
                      <label key={x.key} className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm">
                        <input
                          type="checkbox"
                          checked={(prefs as any)[x.key]}
                          onChange={(e) => setPrefs((p) => ({ ...p, [x.key]: e.target.checked }))}
                        />
                        <span>{x.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Your profile (optional)</div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      { key: "individual", label: "Individual" },
                      { key: "business", label: "Business" },
                      { key: "enterprise", label: "Large enterprise" },
                      { key: "student", label: "Student" },
                    ].map((x) => (
                      <label key={x.key} className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm">
                        <input type="radio" name="profile" checked={profile === (x.key as any)} onChange={() => setProfile(x.key as any)} />
                        <span>{x.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Subscribe
                </Button>

                <div className="text-xs text-muted-foreground">
                  Privacy promise: we use your email only for reform updates. (Connect to privacy policy when wired.)
                </div>

                {submitted ? (
                  <div className="rounded-lg border bg-primary/5 p-3 text-sm text-muted-foreground">
                    <div className="font-medium text-foreground">Success state (prototype)</div>
                    <div className="mt-1">Next: Start with your profile and save your first checklist.</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href="#impact">Back to profile</Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href="/resources">Open resources</Link>
                      </Button>
                    </div>
                  </div>
                ) : null}
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="border-t bg-primary/5">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Ready to act?</div>
              <div className="text-lg font-semibold">Get the checklist and move with confidence.</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/resources">
                  Open resources <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/assistant">Ask AI</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}





