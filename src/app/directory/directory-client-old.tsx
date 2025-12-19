"use client";

import React, { useMemo, useState } from "react";
import { DIRECTORY_PROS, type DirectoryProfessional } from "./_directory-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  Globe2,
  HandHeart,
  MapPin,
  Scale,
  Search,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

type MatchInputs = {
  query: string;
  location: string;
  budget: "any" | "low" | "mid" | "high";
  urgency: "any" | "today" | "this_week";
  proBonoOnly: boolean;
};

function formatNGN(n: number): string {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);
}

function scoreProfessional(p: DirectoryProfessional, inputs: MatchInputs): number {
  let score = 0;

  const q = inputs.query.trim().toLowerCase();
  if (q.length > 0) {
    const hay = [
      p.name,
      p.firm ?? "",
      p.title,
      ...p.specialties,
      ...p.industries,
      ...p.locations,
      ...p.languages,
      ...p.highlights,
    ]
      .join(" ")
      .toLowerCase();

    // Very lightweight "AI-ish" scoring: token overlap + phrase bonus.
    const tokens = q.split(/\s+/).filter(Boolean);
    const tokenHits = tokens.reduce((acc, t) => acc + (hay.includes(t) ? 1 : 0), 0);
    score += Math.min(10, tokenHits * 2);
    if (hay.includes(q)) score += 6;
  }

  if (inputs.location !== "any") {
    const match = p.locations.some((l) => l.toLowerCase() === inputs.location.toLowerCase());
    score += match ? 8 : -2;
  }

  if (inputs.proBonoOnly) {
    score += p.pricing.proBono ? 10 : -100;
  }

  const fee = p.pricing.consultationFeeNGN;
  if (inputs.budget === "low") score += fee <= 20000 ? 6 : -2;
  if (inputs.budget === "mid") score += fee > 20000 && fee <= 50000 ? 6 : 0;
  if (inputs.budget === "high") score += fee > 50000 ? 6 : 0;

  if (inputs.urgency === "today") score += p.availability.nextSlotLabel.toLowerCase().includes("today") ? 7 : -1;
  if (inputs.urgency === "this_week") score += p.availability.nextSlotLabel.toLowerCase().includes("today") ? 4 : 0;

  // Trust & verification.
  if (p.verified.status === "Verified") score += 6;
  score += Math.round(p.trust.rating * 2);
  score += Math.min(6, Math.floor(p.trust.reviewCount / 30));

  // Mission-aligned features.
  if (p.pricing.fairPricingPledge) score += 2;
  if (p.trust.complaintResolutionSupported) score += 2;
  if (p.trust.mediationSupported) score += 2;

  return score;
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border bg-background px-2.5 py-1 text-xs font-semibold text-foreground/80">{children}</span>;
}

function Rating({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span className="inline-flex items-center gap-1">
      <Star className="h-4 w-4 text-amber-500" />
      <span className="text-sm font-semibold">{value.toFixed(1)}</span>
      <span className="text-sm text-muted-foreground">{half ? "" : ""}</span>
    </span>
  );
}

export default function DirectoryClient() {
  const [inputs, setInputs] = useState<MatchInputs>({
    query: "",
    location: "any",
    budget: "any",
    urgency: "any",
    proBonoOnly: false,
  });

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const selectedIds = useMemo(() => Object.entries(selected).filter(([, v]) => v).map(([k]) => k), [selected]);

  const results = useMemo(() => {
    const scored = DIRECTORY_PROS.map((p) => ({ p, score: scoreProfessional(p, inputs) }))
      .filter(({ score }) => score > -50)
      .sort((a, b) => b.score - a.score);

    // If no matching criteria provided, show a stable default ordering.
    const hasCriteria =
      inputs.query.trim().length > 0 ||
      inputs.location !== "any" ||
      inputs.budget !== "any" ||
      inputs.urgency !== "any" ||
      inputs.proBonoOnly;

    return hasCriteria ? scored : DIRECTORY_PROS.map((p) => ({ p, score: scoreProfessional(p, inputs) })).sort((a, b) => b.score - a.score);
  }, [inputs]);

  const selectedPros = useMemo(() => DIRECTORY_PROS.filter((p) => selectedIds.includes(p.id)), [selectedIds]);

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 py-10 md:px-6">
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-semibold text-foreground/80">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          NGO-Transparent Professional Directory Prototype
        </div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight md:text-4xl">Find and compare tax professionals—fast, fair, and verifiable.</h1>
        <p className="mt-2 max-w-3xl text-base text-muted-foreground">
          This is a working demo of the directory: AI-style matching, rich profiles, comparison, booking request simulation, and NGO program transparency.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <Card className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">AI Matching</h2>
              <p className="text-sm text-muted-foreground">Describe what you need. We score by fit, trust, and mission alignment.</p>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary" className="shrink-0">
                  Compare ({selectedIds.length})
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-2xl">
                <SheetHeader>
                  <SheetTitle>Comparison</SheetTitle>
                </SheetHeader>
                {selectedPros.length === 0 ? (
                  <p className="mt-4 text-sm text-muted-foreground">Select up to a few professionals to compare.</p>
                ) : (
                  <div className="mt-4 grid gap-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {selectedPros.map((p) => (
                        <Card key={p.id} className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-sm font-semibold">{p.name}</div>
                              <div className="text-xs text-muted-foreground">{p.title}</div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelected((s) => ({ ...s, [p.id]: false }))}
                            >
                              Remove
                            </Button>
                          </div>
                          <Separator className="my-3" />
                          <div className="grid gap-2 text-sm">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-muted-foreground">Verification</span>
                              <span className="font-semibold">{p.verified.status}</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-muted-foreground">Consult fee</span>
                              <span className="font-semibold">{formatNGN(p.pricing.consultationFeeNGN)}</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-muted-foreground">Rating</span>
                              <span className="font-semibold">{p.trust.rating.toFixed(1)} ({p.trust.reviewCount})</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-muted-foreground">Pro bono</span>
                              <span className="font-semibold">{p.pricing.proBono ? "Yes" : "No"}</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-muted-foreground">Next slot</span>
                              <span className="font-semibold">{p.availability.nextSlotLabel}</span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                    <Card className="p-4">
                      <div className="text-sm font-semibold">Why this comparison matters</div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        We surface trade-offs (cost, response time, verification, and mission programs) so users don’t optimize for a single metric.
                      </p>
                    </Card>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>

          <div className="mt-5 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="q">What do you need help with?</Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="q"
                  value={inputs.query}
                  onChange={(e) => setInputs((s) => ({ ...s, query: e.target.value }))}
                  placeholder="e.g., VAT filing, FIRS audit, PAYE setup, dispute prevention..."
                  className="pl-9"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Location</Label>
                <Select value={inputs.location} onValueChange={(v) => setInputs((s) => ({ ...s, location: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="Lagos">Lagos</SelectItem>
                    <SelectItem value="Abuja">Abuja</SelectItem>
                    <SelectItem value="Kano">Kano</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Budget</Label>
                <Select value={inputs.budget} onValueChange={(v) => setInputs((s) => ({ ...s, budget: v as MatchInputs["budget"] }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="low">Low (≤ ₦20k consult)</SelectItem>
                    <SelectItem value="mid">Mid (₦20k–₦50k)</SelectItem>
                    <SelectItem value="high">High (₦50k+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Urgency</Label>
                <Select value={inputs.urgency} onValueChange={(v) => setInputs((s) => ({ ...s, urgency: v as MatchInputs["urgency"] }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="this_week">This week</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end gap-2">
                <div className="flex w-full items-center gap-2 rounded-md border p-3">
                  <Checkbox
                    id="probono"
                    checked={inputs.proBonoOnly}
                    onCheckedChange={(v) => setInputs((s) => ({ ...s, proBonoOnly: Boolean(v) }))}
                  />
                  <Label htmlFor="probono" className="flex items-center gap-2 text-sm">
                    <HandHeart className="h-4 w-4 text-rose-600" /> Pro bono only
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                onClick={() =>
                  setInputs({
                    query: "",
                    location: "any",
                    budget: "any",
                    urgency: "any",
                    proBonoOnly: false,
                  })
                }
              >
                Reset
              </Button>
              <div className="text-xs text-muted-foreground">Tip: try “audit”, “VAT”, “appeal”, “PAYE”, or “rights”.</div>
            </div>
          </div>

          <Separator className="my-5" />

          <div className="grid gap-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span className="font-semibold">Verified reviews only</span>
              <span className="text-muted-foreground">(prototype)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Scale className="h-4 w-4 text-indigo-600" />
              <span className="font-semibold">Client Protection Program</span>
              <span className="text-muted-foreground">mediation + complaint review</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-sky-600" />
              <span className="font-semibold">Community Champions</span>
              <span className="text-muted-foreground">rewarding volunteer contribution</span>
            </div>
          </div>
        </Card>

        <div className="grid gap-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Matches</h2>
              <p className="text-sm text-muted-foreground">Sorted by fit score (prototype). Click a card for the full profile.</p>
            </div>
            <Pill>{results.length} results</Pill>
          </div>

          <div className="grid gap-4">
            {results.map(({ p, score }) => (
              <div key={p.id}>
                <Dialog open={openDialogId === p.id} onOpenChange={(open) => setOpenDialogId(open ? p.id : null)}>
                <DialogTrigger asChild>
                  <Card className="p-5 cursor-pointer transition-all hover:shadow-lg hover:border-primary/20">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="text-lg font-semibold tracking-tight">{p.name}</div>
                          {p.verified.status === "Verified" ? (
                            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700">
                              <ShieldCheck className="mr-1 h-3.5 w-3.5" /> Verified
                            </Badge>
                          ) : (
                            <Badge variant="outline">In review</Badge>
                          )}
                          <Badge variant="outline" className="text-muted-foreground">
                            Fit score: {score}
                          </Badge>
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          {p.title}
                          {p.firm ? <span className="text-muted-foreground"> · {p.firm}</span> : null}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <Pill>
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-muted-foreground" /> {p.locations.join(" · ")}
                            </span>
                          </Pill>
                          <Pill>
                            <span className="inline-flex items-center gap-1">
                              <Globe2 className="h-4 w-4 text-muted-foreground" /> {p.languages.join(" · ")}
                            </span>
                          </Pill>
                          <Pill>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" /> {p.availability.nextSlotLabel}
                            </span>
                          </Pill>
                          {p.pricing.proBono ? <Pill>Pro bono</Pill> : null}
                          {p.pricing.fairPricingPledge ? <Pill>Fair pricing pledge</Pill> : null}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {p.specialties.slice(0, 4).map((s) => (
                            <Badge key={s} variant="secondary" className="font-semibold">
                              {s}
                            </Badge>
                          ))}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <Rating value={p.trust.rating} />
                          <span className="text-sm text-muted-foreground">{p.trust.reviewCount} verified reviews</span>
                          <span className="text-sm text-muted-foreground">·</span>
                          <span className="text-sm font-semibold">Consult: {formatNGN(p.pricing.consultationFeeNGN)}</span>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col gap-2 sm:items-end" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`compare-${p.id}`}
                            checked={Boolean(selected[p.id])}
                            onCheckedChange={(v) => setSelected((s) => ({ ...s, [p.id]: Boolean(v) }))}
                          />
                          <Label htmlFor={`compare-${p.id}`} className="text-sm">
                            Compare
                          </Label>
                        </div>

                        <Button className="w-full sm:w-auto" onClick={(e) => { e.stopPropagation(); setOpenDialogId(p.id); }}>
                          View profile
                        </Button>
                      </div>
                    </div>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle className="flex flex-wrap items-center gap-2">
                            {p.name}
                            {p.verified.status === "Verified" ? (
                              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700">
                                <ShieldCheck className="mr-1 h-3.5 w-3.5" /> Verified
                              </Badge>
                            ) : (
                              <Badge variant="outline">In review</Badge>
                            )}
                            {p.badges.map((b) => (
                              <Badge key={b} variant="outline">
                                {b}
                              </Badge>
                            ))}
                          </DialogTitle>
                          <DialogDescription>
                            {p.title}
                            {p.firm ? ` · ${p.firm}` : ""} · {p.yearsExperience} years experience
                          </DialogDescription>
                        </DialogHeader>

                        <Tabs defaultValue="overview" className="mt-2">
                          <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="trust">Trust</TabsTrigger>
                            <TabsTrigger value="stories">Stories</TabsTrigger>
                            <TabsTrigger value="book">Book</TabsTrigger>
                          </TabsList>

                          <TabsContent value="overview" className="mt-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <Card className="p-4">
                                <div className="text-sm font-semibold">Specialties</div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {p.specialties.map((s) => (
                                    <Badge key={s} variant="secondary">
                                      {s}
                                    </Badge>
                                  ))}
                                </div>
                                <Separator className="my-3" />
                                <div className="text-sm font-semibold">Industries</div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {p.industries.map((s) => (
                                    <Badge key={s} variant="outline">
                                      {s}
                                    </Badge>
                                  ))}
                                </div>
                              </Card>

                              <Card className="p-4">
                                <div className="text-sm font-semibold">Availability & modes</div>
                                <div className="mt-2 grid gap-2 text-sm">
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="text-muted-foreground">Next slot</span>
                                    <span className="font-semibold">{p.availability.nextSlotLabel}</span>
                                  </div>
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="text-muted-foreground">Response SLA</span>
                                    <span className="font-semibold">≤ {p.availability.responseSlaHours}h</span>
                                  </div>
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="text-muted-foreground">Modes</span>
                                    <span className="font-semibold">{p.availability.bookingModes.join(", ")}</span>
                                  </div>
                                </div>
                                <Separator className="my-3" />
                                <div className="text-sm font-semibold">Pricing</div>
                                <div className="mt-2 grid gap-2 text-sm">
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="text-muted-foreground">Consultation</span>
                                    <span className="font-semibold">{formatNGN(p.pricing.consultationFeeNGN)}</span>
                                  </div>
                                  {p.pricing.hourlyRateNGN ? (
                                    <div className="flex items-center justify-between gap-3">
                                      <span className="text-muted-foreground">Hourly</span>
                                      <span className="font-semibold">{formatNGN(p.pricing.hourlyRateNGN)}</span>
                                    </div>
                                  ) : null}
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="text-muted-foreground">Fair pricing pledge</span>
                                    <span className="font-semibold">{p.pricing.fairPricingPledge ? "Yes" : "No"}</span>
                                  </div>
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="text-muted-foreground">Pro bono</span>
                                    <span className="font-semibold">{p.pricing.proBono ? "Yes" : "No"}</span>
                                  </div>
                                  {p.pricing.proBono && p.pricing.lowCostSlotsPerMonth ? (
                                    <div className="flex items-center justify-between gap-3">
                                      <span className="text-muted-foreground">Low-cost slots/mo</span>
                                      <span className="font-semibold">{p.pricing.lowCostSlotsPerMonth}</span>
                                    </div>
                                  ) : null}
                                </div>
                              </Card>
                            </div>

                            <Card className="mt-4 p-4">
                              <div className="text-sm font-semibold">Highlights</div>
                              <ul className="mt-2 grid gap-1 text-sm text-muted-foreground">
                                {p.highlights.map((h) => (
                                  <li key={h} className="flex gap-2">
                                    <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
                                    <span>{h}</span>
                                  </li>
                                ))}
                              </ul>
                            </Card>
                          </TabsContent>

                          <TabsContent value="trust" className="mt-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <Card className="p-4">
                                <div className="text-sm font-semibold">Verification</div>
                                <div className="mt-2 grid gap-2 text-sm">
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="text-muted-foreground">Status</span>
                                    <span className="font-semibold">{p.verified.status}</span>
                                  </div>
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="text-muted-foreground">Last check</span>
                                    <span className="font-semibold">{new Date(p.verified.lastCheck).toLocaleDateString()}</span>
                                  </div>
                                  <div className="mt-2">
                                    <div className="text-xs font-semibold text-muted-foreground">Scope</div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {p.verified.scope.map((s) => (
                                        <Badge key={s} variant="outline">
                                          {s}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </Card>

                              <Card className="p-4">
                                <div className="text-sm font-semibold">Reviews & protection</div>
                                <div className="mt-2 grid gap-2 text-sm">
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="text-muted-foreground">Rating</span>
                                    <span className="font-semibold">{p.trust.rating.toFixed(1)} / 5</span>
                                  </div>
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="text-muted-foreground">Verified reviews</span>
                                    <span className="font-semibold">{p.trust.reviewCount}</span>
                                  </div>
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="text-muted-foreground">Complaint resolution</span>
                                    <span className="font-semibold">{p.trust.complaintResolutionSupported ? "Supported" : "No"}</span>
                                  </div>
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="text-muted-foreground">Mediation</span>
                                    <span className="font-semibold">{p.trust.mediationSupported ? "Supported" : "No"}</span>
                                  </div>
                                </div>
                              </Card>
                            </div>

                            <Card className="mt-4 p-4">
                              <div className="text-sm font-semibold">NGO touches (prototype)</div>
                              <div className="mt-2 grid gap-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Client Protection Program
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Pro Bono Directory filters
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Independent complaint review process
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Fair Pricing Pledge
                                </div>
                              </div>
                            </Card>
                          </TabsContent>

                          <TabsContent value="stories" className="mt-4">
                            <div className="grid gap-4">
                              {p.successStories.map((s) => (
                                <Card key={s.title} className="p-4">
                                  <div className="text-sm font-semibold">{s.title}</div>
                                  <div className="mt-1 text-sm text-muted-foreground">{s.outcome}</div>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {s.tags.map((t) => (
                                      <Badge key={t} variant="secondary">
                                        {t}
                                      </Badge>
                                    ))}
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </TabsContent>

                          <TabsContent value="book" className="mt-4">
                            <Card className="p-4">
                              <div className="text-sm font-semibold">Request a consultation (simulation)</div>
                              <p className="mt-1 text-sm text-muted-foreground">
                                Prototype booking flow: collects intent and contact details, then shows a success state.
                              </p>
                              <Separator className="my-3" />
                              <BookingForm professional={p} />
                            </Card>
                          </TabsContent>
                        </Tabs>
                      </DialogContent>
                    </Dialog>

                    <Button variant="outline" className="w-full sm:w-auto" onClick={() => setSelected((s) => ({ ...s, [p.id]: true }))}>
                      Add to compare
                    </Button>
                  </div>
                ))}
              </div>

          <Card className="p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <div className="text-lg font-semibold">Interactive Map (concept)</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  In production, this becomes a real map with clusters, travel radius, and “remote-ready” toggles.
                </p>
                <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Lagos · Abuja · Kano · Remote
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Filter by next available slot
                  </div>
                </div>
              </div>
              <div className="w-full rounded-lg border bg-muted/30 p-4 lg:max-w-md">
                <div className="text-sm font-semibold">Map placeholder</div>
                <div className="mt-2 grid h-40 place-items-center rounded-md border bg-background text-sm text-muted-foreground">
                  Map provider integration goes here
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-lg font-semibold">Monetization model (NGO-transparent)</div>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border bg-background p-4">
                <div className="text-sm font-semibold">Revenue sources</div>
                <ul className="mt-2 grid gap-1 text-sm text-muted-foreground">
                  <li>70% Professional membership fees</li>
                  <li>20% Featured listing upgrades</li>
                  <li>10% Enterprise accounts</li>
                </ul>
              </div>
              <div className="rounded-lg border bg-background p-4">
                <div className="text-sm font-semibold">How we use it</div>
                <ul className="mt-2 grid gap-1 text-sm text-muted-foreground">
                  <li>60% Funds free education programs</li>
                  <li>25% Platform maintenance & improvement</li>
                  <li>10% Verification & quality control</li>
                  <li>5% Administrative costs</li>
                </ul>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">100% of individual donations</span> go to education. Directory revenue is the sustainable funding model.
            </div>
            <div className="mt-3">
              <Button variant="secondary" disabled>
                View Full Financial Report (prototype)
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

function BookingForm({ professional }: { professional: DirectoryProfessional }) {
  type BookingMode = DirectoryProfessional["availability"]["bookingModes"][number];
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const [payload, setPayload] = useState({
    name: "",
    email: "",
    phone: "",
    summary: "",
    preferredMode: (professional.availability.bookingModes[0] ?? "Call") as BookingMode,
  });

  return (
    <div className="grid gap-3">
      {status === "sent" ? (
        <div className="rounded-lg border bg-emerald-500/10 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
            <CheckCircle2 className="h-4 w-4" /> Request sent (simulation)
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            We’ll notify you when {professional.name} confirms. SLA: ≤ {professional.availability.responseSlaHours}h.
          </div>
        </div>
      ) : null}

      <div className={cn("grid gap-3", status === "sent" && "opacity-60")}>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Your name</Label>
            <Input value={payload.name} onChange={(e) => setPayload((s) => ({ ...s, name: e.target.value }))} placeholder="Full name" />
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input value={payload.email} onChange={(e) => setPayload((s) => ({ ...s, email: e.target.value }))} placeholder="you@email.com" />
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Phone</Label>
            <Input value={payload.phone} onChange={(e) => setPayload((s) => ({ ...s, phone: e.target.value }))} placeholder="+234..." />
          </div>
          <div className="grid gap-2">
            <Label>Preferred mode</Label>
            <Select
              value={payload.preferredMode}
              onValueChange={(v) => setPayload((s) => ({ ...s, preferredMode: v as BookingMode }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent>
                {professional.availability.bookingModes.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-2">
          <Label>What’s the situation?</Label>
          <Textarea
            value={payload.summary}
            onChange={(e) => setPayload((s) => ({ ...s, summary: e.target.value }))}
            placeholder="Briefly describe the issue, deadlines, and any documents you have."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => setStatus("sent")}
            disabled={status === "sent" || payload.summary.trim().length < 10}
          >
            Send request
          </Button>
          <div className="text-xs text-muted-foreground">
            This is a demo. In production, this would create a request record, notify the pro, and track outcomes.
          </div>
        </div>
      </div>
    </div>
  );
}
