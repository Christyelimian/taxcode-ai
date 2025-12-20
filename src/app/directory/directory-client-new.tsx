"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { getConsultants, submitBookingRequest, type DirectoryConsultant } from "@/app/actions";
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
  LoaderCircle,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type MatchInputs = {
  query: string;
  location: string;
  budget: "any" | "low" | "mid" | "high";
  urgency: "any" | "today" | "this_week";
  proBonoOnly: boolean;
  country?: string;
  state?: string;
};

function formatNGN(n: number): string {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);
}

function scoreProfessional(p: DirectoryConsultant, inputs: MatchInputs): number {
  let score = 0;

  const q = inputs.query.trim().toLowerCase();
  if (q.length > 0) {
    const hay = [
      p.name,
      p.firmName ?? "",
      p.title,
      ...p.specialties,
      ...p.industries,
      ...p.locations,
      ...p.languages,
      ...p.highlights,
    ]
      .join(" ")
      .toLowerCase();

    const tokens = q.split(/\s+/).filter(Boolean);
    const tokenHits = tokens.reduce((acc, t) => acc + (hay.includes(t) ? 1 : 0), 0);
    score += Math.min(10, tokenHits * 2);
    if (hay.includes(q)) score += 6;
  }

  if (inputs.location !== "any") {
    const match = p.locations.some((l) => l.toLowerCase() === inputs.location.toLowerCase());
    score += match ? 8 : -2;
  }

  if (inputs.state && inputs.state !== "any") {
    const match = p.state?.toLowerCase() === inputs.state.toLowerCase();
    score += match ? 6 : -1;
  }

  if (inputs.country && inputs.country !== "any") {
    const match = p.country?.toLowerCase() === inputs.country.toLowerCase();
    score += match ? 4 : -1;
  }

  if (inputs.proBonoOnly) {
    score += p.pricing.proBono ? 10 : -100;
  }

  const fee = p.pricing.consultationFeeNGN;
  if (inputs.budget === "low") score += fee <= 20000 ? 6 : -2;
  if (inputs.budget === "mid") score += fee > 20000 && fee <= 50000 ? 6 : 0;
  if (inputs.budget === "high") score += fee > 50000 ? 6 : 0;

  if (p.verified) score += 6;
  score += Math.round(p.trust.rating * 2);
  score += Math.min(6, Math.floor(p.trust.reviewCount / 30));

  if (p.pricing.fairPricingPledge) score += 2;
  if (p.trust.complaintResolutionSupported) score += 2;
  if (p.trust.mediationSupported) score += 2;

  return score;
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border bg-background px-2.5 py-1 text-xs font-semibold text-foreground/80">{children}</span>;
}

function Rating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      <Star className="h-4 w-4 text-amber-500" />
      <span className="text-sm font-semibold">{value.toFixed(1)}</span>
    </span>
  );
}

export default function DirectoryClient() {
  const { toast } = useToast();
  const [consultants, setConsultants] = useState<DirectoryConsultant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [inputs, setInputs] = useState<MatchInputs>({
    query: "",
    location: "any",
    budget: "any",
    urgency: "any",
    proBonoOnly: false,
    country: "any",
    state: "any",
  });

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const filterCardRef = useRef<HTMLDivElement>(null);
  const [isFilterSticky, setIsFilterSticky] = useState(false);
  const selectedIds = useMemo(() => Object.entries(selected).filter(([, v]) => v).map(([k]) => k), [selected]);

  // Fetch consultants from Firebase
  useEffect(() => {
    async function loadConsultants() {
      setIsLoading(true);
      const result = await getConsultants();
      if (result.success && result.data) {
        setConsultants(result.data);
      } else {
        toast({
          variant: "destructive",
          title: "Error loading consultants",
          description: result.error || "Failed to load consultants",
        });
      }
      setIsLoading(false);
    }
    loadConsultants();
  }, [toast]);

  // Sticky filter on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (filterCardRef.current) {
        const rect = filterCardRef.current.getBoundingClientRect();
        setIsFilterSticky(rect.top <= 20);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // AI-powered search
  const handleAiSearch = async (query: string) => {
    if (!query.trim() || query.length < 3) return;
    
    setIsAiSearching(true);
    try {
      const res = await fetch("/api/directory/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      
      const data = await res.json();
      if (data.success) {
        setInputs((prev) => ({
          ...prev,
          location: data.data.location,
          budget: data.data.budget,
          urgency: data.data.urgency,
          proBonoOnly: data.data.proBono,
          query: query, // Keep original query for display
        }));
      }
    } catch (error) {
      console.error("AI search failed:", error);
    } finally {
      setIsAiSearching(false);
    }
  };

  // Get unique countries, states, cities for filters
  const countries = useMemo(() => {
    const unique = new Set(consultants.map((c) => c.country).filter(Boolean));
    return Array.from(unique).sort();
  }, [consultants]);

  const states = useMemo(() => {
    const unique = new Set(consultants.map((c) => c.state).filter(Boolean));
    return Array.from(unique).sort();
  }, [consultants]);

  const cities = useMemo(() => {
    const unique = new Set(consultants.flatMap((c) => c.locations).filter(Boolean));
    return Array.from(unique).sort();
  }, [consultants]);

  const results = useMemo(() => {
    if (consultants.length === 0) return [];
    
    const scored = consultants
      .map((p) => ({ p, score: scoreProfessional(p, inputs) }))
      .filter(({ score }) => score > -50)
      .sort((a, b) => b.score - a.score);

    const hasCriteria =
      inputs.query.trim().length > 0 ||
      inputs.location !== "any" ||
      inputs.budget !== "any" ||
      inputs.urgency !== "any" ||
      inputs.proBonoOnly ||
      inputs.country !== "any" ||
      inputs.state !== "any";

    return hasCriteria ? scored : scored;
  }, [consultants, inputs]);

  const selectedPros = useMemo(() => consultants.filter((p) => selectedIds.includes(p.id)), [consultants, selectedIds]);

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-[1280px] px-4 py-10 md:px-6">
        <div className="flex items-center justify-center py-20">
          <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 py-10 md:px-6">
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-semibold text-foreground/80">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          Verified Tax Consultants Directory
        </div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight md:text-4xl">
          Find and compare verified tax professionals—fast, fair, and verifiable.
        </h1>
        <p className="mt-2 max-w-3xl text-base text-muted-foreground">
          Search {consultants.length} verified consultants across {countries.length} countries. AI-powered matching helps you find the right professional.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <div
          ref={filterCardRef}
          className={cn(
            "transition-all",
            isFilterSticky && "sticky top-4 z-10"
          )}
        >
          <Card className={cn("p-5", isFilterSticky && "shadow-lg")}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">AI Matching</h2>
                <p className="text-sm text-muted-foreground">
                  Describe what you need. We score by fit, trust, and mission alignment.
                </p>
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
                    <p className="mt-4 text-sm text-muted-foreground">Select professionals to compare.</p>
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
                                <span className="text-muted-foreground">Location</span>
                                <span className="font-semibold">{p.locations.join(", ")}</span>
                              </div>
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-muted-foreground">Consult fee</span>
                                <span className="font-semibold">{formatNGN(p.pricing.consultationFeeNGN)}</span>
                              </div>
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-muted-foreground">Rating</span>
                                <span className="font-semibold">{p.trust.rating.toFixed(1)}</span>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
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
                    onChange={(e) => {
                      const value = e.target.value;
                      setInputs((s) => ({ ...s, query: value }));
                      // Trigger AI search after user stops typing
                      if (value.length >= 3) {
                        const timeoutId = setTimeout(() => handleAiSearch(value), 800);
                        return () => clearTimeout(timeoutId);
                      }
                    }}
                    placeholder="e.g., VAT filing in Lagos, FIRS audit help..."
                    className="pl-9"
                  />
                  {isAiSearching && (
                    <Sparkles className="absolute right-3 top-3 h-4 w-4 animate-pulse text-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  AI-powered: understands natural language queries
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Country</Label>
                  <Select
                    value={inputs.country || "any"}
                    onValueChange={(v) => setInputs((s) => ({ ...s, country: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Country</SelectItem>
                      {countries.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>State</Label>
                  <Select
                    value={inputs.state || "any"}
                    onValueChange={(v) => setInputs((s) => ({ ...s, state: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any State</SelectItem>
                      {states.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>City</Label>
                  <Select value={inputs.location} onValueChange={(v) => setInputs((s) => ({ ...s, location: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any City</SelectItem>
                      {cities.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
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
                      country: "any",
                      state: "any",
                    })
                  }
                >
                  Reset
                </Button>
              </div>
            </div>

            <Separator className="my-5" />

            <div className="grid gap-3">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="font-semibold">Verified consultants only</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Scale className="h-4 w-4 text-indigo-600" />
                <span className="font-semibold">Client Protection Program</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Matches</h2>
              <p className="text-sm text-muted-foreground">
                {results.length} consultant{results.length !== 1 ? "s" : ""} found
              </p>
            </div>
            <Pill>{results.length} results</Pill>
          </div>

          <div className="grid gap-4">
            {results.map(({ p, score }) => (
              <Dialog key={p.id} open={openDialogId === p.id} onOpenChange={(open) => setOpenDialogId(open ? p.id : null)}>
                <DialogTrigger asChild>
                  <Card className="p-5 cursor-pointer transition-all hover:shadow-lg hover:border-primary/20">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="text-lg font-semibold tracking-tight">{p.name}</div>
                          {p.verified ? (
                            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700">
                              <ShieldCheck className="mr-1 h-3.5 w-3.5" /> Verified
                            </Badge>
                          ) : null}
                          <Badge variant="outline" className="text-muted-foreground">
                            Fit: {score}
                          </Badge>
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          {p.title}
                          {p.firmName ? <span className="text-muted-foreground"> · {p.firmName}</span> : null}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <Pill>
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-muted-foreground" /> {p.locations.join(" · ")}
                            </span>
                          </Pill>
                          {p.state && (
                            <Pill>
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-muted-foreground" /> {p.state}
                              </span>
                            </Pill>
                          )}
                          {p.country && (
                            <Pill>
                              <span className="inline-flex items-center gap-1">
                                <Globe2 className="h-4 w-4 text-muted-foreground" /> {p.country}
                              </span>
                            </Pill>
                          )}
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
                          <span className="text-sm text-muted-foreground">{p.trust.reviewCount} reviews</span>
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
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex flex-wrap items-center gap-2">
                      {p.name}
                      {p.verified ? (
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700">
                          <ShieldCheck className="mr-1 h-3.5 w-3.5" /> Verified
                        </Badge>
                      ) : null}
                    </DialogTitle>
                    <DialogDescription>
                      {p.title}
                      {p.firmName ? ` · ${p.firmName}` : ""}
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
                          <div className="text-sm font-semibold">Location</div>
                          <div className="mt-2 grid gap-2 text-sm">
                            {p.city && (
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-muted-foreground">City</span>
                                <span className="font-semibold">{p.city}</span>
                              </div>
                            )}
                            {p.state && (
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-muted-foreground">State</span>
                                <span className="font-semibold">{p.state}</span>
                              </div>
                            )}
                            {p.country && (
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-muted-foreground">Country</span>
                                <span className="font-semibold">{p.country}</span>
                              </div>
                            )}
                            {p.firmAddress && (
                              <div className="mt-2">
                                <span className="text-muted-foreground">Address: </span>
                                <span className="font-semibold">{p.firmAddress}</span>
                              </div>
                            )}
                          </div>
                        </Card>

                        <Card className="p-4">
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
                            {p.licenseNo && (
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-muted-foreground">License</span>
                                <span className="font-semibold">{p.licenseNo}</span>
                              </div>
                            )}
                          </div>
                        </Card>
                      </div>

                      {p.highlights.length > 0 && (
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
                      )}
                    </TabsContent>

                    <TabsContent value="trust" className="mt-4">
                      <Card className="p-4">
                        <div className="text-sm font-semibold">Verification</div>
                        <div className="mt-2 grid gap-2 text-sm">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-muted-foreground">Status</span>
                            <span className="font-semibold">{p.verified ? "Verified" : "Pending"}</span>
                          </div>
                          {p.licenseNo && (
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-muted-foreground">License Number</span>
                              <span className="font-semibold">{p.licenseNo}</span>
                            </div>
                          )}
                        </div>
                      </Card>
                    </TabsContent>

                    <TabsContent value="stories" className="mt-4">
                      {p.successStories.length > 0 ? (
                        <div className="grid gap-4">
                          {p.successStories.map((s) => (
                            <Card key={s.title} className="p-4">
                              <div className="text-sm font-semibold">{s.title}</div>
                              <div className="mt-1 text-sm text-muted-foreground">{s.outcome}</div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No success stories yet.</p>
                      )}
                    </TabsContent>

                    <TabsContent value="book" className="mt-4">
                      <BookingForm consultant={p} />
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            ))}
          </div>

          {results.length === 0 && (
            <Card className="p-8 text-center">
              <Search className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold">No consultants found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}

function BookingForm({ consultant }: { consultant: DirectoryConsultant }) {
  const { toast } = useToast();
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [payload, setPayload] = useState({
    name: "",
    email: "",
    phone: "",
    summary: "",
    preferredMode: consultant.availability.bookingModes[0] ?? "Call",
  });

  const handleSubmit = async () => {
    if (payload.summary.trim().length < 10) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide a detailed summary (at least 10 characters)",
      });
      return;
    }

    setStatus("sending");
    try {
      const result = await submitBookingRequest({
        consultantId: consultant.id,
        consultantName: consultant.name,
        consultantEmail: consultant.email,
        clientName: payload.name,
        clientEmail: payload.email,
        clientPhone: payload.phone,
        preferredMode: payload.preferredMode,
        summary: payload.summary,
      });

      if (result.success) {
        setStatus("sent");
        toast({
          title: "Booking request sent",
          description: "You'll receive a confirmation email shortly.",
        });
      } else {
        setStatus("idle");
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to send booking request",
        });
      }
    } catch (error) {
      setStatus("idle");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send booking request",
      });
    }
  };

  return (
    <div className="grid gap-3">
      {status === "sent" ? (
        <div className="rounded-lg border bg-emerald-500/10 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
            <CheckCircle2 className="h-4 w-4" /> Request sent successfully
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            We've notified {consultant.name} and sent you a confirmation email. They'll respond within {consultant.availability.responseSlaHours} hours.
          </div>
        </div>
      ) : null}

      <div className={cn("grid gap-3", status === "sent" && "opacity-60")}>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Your name *</Label>
            <Input
              value={payload.name}
              onChange={(e) => setPayload((s) => ({ ...s, name: e.target.value }))}
              placeholder="Full name"
              disabled={status === "sent"}
            />
          </div>
          <div className="grid gap-2">
            <Label>Email *</Label>
            <Input
              type="email"
              value={payload.email}
              onChange={(e) => setPayload((s) => ({ ...s, email: e.target.value }))}
              placeholder="you@email.com"
              disabled={status === "sent"}
            />
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Phone *</Label>
            <Input
              value={payload.phone}
              onChange={(e) => setPayload((s) => ({ ...s, phone: e.target.value }))}
              placeholder="+234..."
              disabled={status === "sent"}
            />
          </div>
          <div className="grid gap-2">
            <Label>Preferred mode</Label>
            <Select
              value={payload.preferredMode}
              onValueChange={(v) => setPayload((s) => ({ ...s, preferredMode: v }))}
              disabled={status === "sent"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent>
                {consultant.availability.bookingModes.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-2">
          <Label>What's the situation? *</Label>
          <Textarea
            value={payload.summary}
            onChange={(e) => setPayload((s) => ({ ...s, summary: e.target.value }))}
            placeholder="Briefly describe the issue, deadlines, and any documents you have."
            disabled={status === "sent"}
            rows={4}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={handleSubmit}
            disabled={status === "sent" || status === "sending" || payload.summary.trim().length < 10}
          >
            {status === "sending" ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send request"
            )}
          </Button>
          <div className="text-xs text-muted-foreground">
            This will send notifications to the consultant and admin team.
          </div>
        </div>
      </div>
    </div>
  );
}


