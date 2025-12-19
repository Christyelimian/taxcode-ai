"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { getLawyers, type DirectoryLawyer } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  Gavel,
  MapPin,
  Scale,
  Search,
  ShieldCheck,
  Star,
  LoaderCircle,
  Sparkles,
  List,
  Map,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Phone,
  Mail,
  Globe,
  Award,
  TrendingUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type MatchInputs = {
  query: string;
  location: string;
  practiceArea?: string;
  urgency?: "emergency" | "urgent" | "standard";
  budget: "any" | "low" | "mid" | "high";
  proBonoOnly: boolean;
  country?: string;
  state?: string;
  courtLevel?: string;
};

function formatNGN(n: number): string {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);
}

function scoreLawyer(p: DirectoryLawyer, inputs: MatchInputs): number {
  let score = 0;

  const q = inputs.query.trim().toLowerCase();
  if (q.length > 0) {
    const hay = [
      p.name,
      p.firmName ?? "",
      p.title,
      ...p.practiceAreas,
      ...p.jurisdictions,
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

  // Practice area matching (high weight)
  if (inputs.practiceArea && inputs.practiceArea.trim()) {
    const practiceMatch = p.practiceAreas.some((pa) =>
      pa.toLowerCase().includes(inputs.practiceArea!.toLowerCase()) ||
      inputs.practiceArea!.toLowerCase().includes(pa.toLowerCase())
    );
    score += practiceMatch ? 20 : -5;
  }

  // Court level matching
  if (inputs.courtLevel) {
    if (inputs.courtLevel === "supreme" && p.courtExperience.supremeCourt) score += 15;
    if (inputs.courtLevel === "appeal" && p.courtExperience.appealCourt) score += 12;
    if (inputs.courtLevel === "high" && p.courtExperience.highCourt) score += 10;
    if (inputs.courtLevel === "tat" && p.courtExperience.taxAppealTribunal) score += 15;
  }

  // Location matching
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

  // Urgency matching
  if (inputs.urgency === "emergency" && p.availability.emergencyAvailable) {
    score += 15;
  }

  if (inputs.proBonoOnly) {
    score += p.pricing.proBono ? 10 : -100;
  }

  const fee = p.pricing.consultationFeeNGN;
  if (inputs.budget === "low") score += fee <= 100000 ? 6 : -2;
  if (inputs.budget === "mid") score += fee > 100000 && fee <= 500000 ? 6 : 0;
  if (inputs.budget === "high") score += fee > 500000 ? 6 : 0;

  if (p.verified) score += 8;
  score += Math.round(p.trust.rating * 2);
  score += Math.min(6, Math.floor(p.trust.reviewCount / 30));

  // Case outcomes boost
  if (p.caseOutcomes && p.caseOutcomes.length > 0) {
    const avgWinRate = p.caseOutcomes.reduce((sum, co) => sum + co.winRate, 0) / p.caseOutcomes.length;
    score += Math.round(avgWinRate / 10); // Up to 10 points for high win rate
  }

  if (p.pricing.fairPricingPledge) score += 2;
  if (p.trust.complaintResolutionSupported) score += 2;
  if (p.trust.mediationSupported) score += 2;

  return score;
}

export default function LawyersDirectoryFull() {
  const { toast } = useToast();
  const router = useRouter();
  const [lawyers, setLawyers] = useState<DirectoryLawyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [inputs, setInputs] = useState<MatchInputs>({
    query: "",
    location: "any",
    budget: "any",
    proBonoOnly: false,
    country: "any",
    state: "any",
  });

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const filterCardRef = useRef<HTMLDivElement>(null);
  const [isFilterSticky, setIsFilterSticky] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const itemsPerPage = 12;
  const selectedIds = useMemo(() => Object.entries(selected).filter(([, v]) => v).map(([k]) => k), [selected]);

  // Fetch lawyers from Firebase
  useEffect(() => {
    async function loadLawyers() {
      setIsLoading(true);
      const result = await getLawyers();
      if (result.success && result.data) {
        setLawyers(result.data);
      } else {
        toast({
          variant: "destructive",
          title: "Error loading lawyers",
          description: result.error || "Failed to load lawyers",
        });
      }
      setIsLoading(false);
    }
    loadLawyers();
  }, [toast]);

  // Check URL params for AI classification results
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const practiceArea = params.get("practiceArea");
    const urgency = params.get("urgency") as "emergency" | "urgent" | "standard" | null;
    const proBono = params.get("proBono") === "true";

    if (practiceArea || urgency || proBono) {
      setInputs((prev) => ({
        ...prev,
        practiceArea: practiceArea || undefined,
        urgency: urgency || undefined,
        proBonoOnly: proBono,
      }));
    }
  }, []);

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
    if (!query.trim()) return;

    setIsAiSearching(true);
    try {
      const res = await fetch("/api/lawyers/ai-classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();

      if (data.success && data.data) {
        setInputs((prev) => ({
          ...prev,
          query,
          practiceArea: data.data.practiceArea,
          urgency: data.data.urgency,
          proBono: data.data.proBono,
          location: data.data.location !== "any" ? data.data.location : prev.location,
        }));
        toast({
          title: "AI Analysis Complete",
          description: `Matched to ${data.data.practiceArea}`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Search Failed",
        description: "Please try manual filters",
      });
    } finally {
      setIsAiSearching(false);
    }
  };

  // Get unique values for filters
  const practiceAreas = useMemo(() => {
    const unique = new Set(lawyers.flatMap((l) => l.practiceAreas).filter(Boolean));
    return Array.from(unique).sort();
  }, [lawyers]);

  const states = useMemo(() => {
    const unique = new Set(lawyers.map((l) => l.state).filter((s): s is string => Boolean(s) && !/^\d+$/.test(s)));
    return Array.from(unique).sort();
  }, [lawyers]);

  const cities = useMemo(() => {
    const filteredLawyers = inputs.state && inputs.state !== "any"
      ? lawyers.filter((l) => l.state?.toLowerCase() === inputs.state?.toLowerCase())
      : lawyers;
    
    const unique = new Set(
      filteredLawyers
        .flatMap((l) => l.locations)
        .filter((l): l is string => Boolean(l) && !/^\d+$/.test(l))
    );
    return Array.from(unique).sort();
  }, [lawyers, inputs.state]);

  const results = useMemo(() => {
    if (lawyers.length === 0) return [];
    
    const scored = lawyers
      .map((p) => ({ p, score: scoreLawyer(p, inputs) }))
      .filter(({ score }) => score > -50)
      .sort((a, b) => b.score - a.score);

    return scored;
  }, [lawyers, inputs]);

  // Pagination
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return results.slice(start, start + itemsPerPage);
  }, [results, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [inputs]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Gavel className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-headline font-bold">Tax Legal Services Directory</h1>
              <p className="text-muted-foreground mt-1">
                Find experienced tax lawyers for FIRS disputes, TAT appeals, tax litigation, and more
              </p>
            </div>
          </div>
        </div>

        {/* Main Layout: Sidebar + Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside
            ref={filterCardRef}
            className={cn(
              "w-full lg:w-80 shrink-0 transition-all",
              isFilterSticky && "lg:sticky lg:top-4 z-10 lg:self-start"
            )}
          >
            <Card className={cn("p-5", isFilterSticky && "shadow-lg")}>
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-4">Filters</h2>
                
                {/* AI Search */}
                <div className="relative">
                  <Label>AI-Powered Search</Label>
                  <div className="relative">
                    <Input
                      placeholder="Describe your tax legal issue... e.g., 'FIRS is investigating my company'"
                      value={inputs.query}
                      onChange={(e) => setInputs((s) => ({ ...s, query: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && inputs.query.trim()) {
                          handleAiSearch(inputs.query);
                        }
                      }}
                      className="pr-10"
                    />
                    {isAiSearching && (
                      <Sparkles className="absolute right-3 top-3 h-4 w-4 animate-pulse text-primary" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    AI-powered: understands natural language queries
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Practice Area</Label>
                    <Select
                      value={inputs.practiceArea || "any"}
                      onValueChange={(v) => setInputs((s) => ({ ...s, practiceArea: v === "any" ? undefined : v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Practice Area</SelectItem>
                        {practiceAreas.map((pa) => (
                          <SelectItem key={pa} value={pa}>
                            {pa}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>State</Label>
                    <Select
                      value={inputs.state || "any"}
                      onValueChange={(v) => {
                        setInputs((s) => {
                          const newState = v;
                          const currentCity = s.location;
                          let newLocation = currentCity;
                          
                          if (newState !== "any" && currentCity !== "any") {
                            const lawyersInNewState = lawyers.filter(
                              (l) => l.state?.toLowerCase() === newState.toLowerCase()
                            );
                            const citiesInNewState = new Set(
                              lawyersInNewState
                                .flatMap((l) => l.locations)
                                .filter((l): l is string => Boolean(l) && !/^\d+$/.test(l))
                            );
                            
                            if (!citiesInNewState.has(currentCity)) {
                              newLocation = "any";
                            }
                          }
                          
                          return { ...s, state: newState, location: newLocation };
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
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

                  <div className="grid gap-2">
                    <Label>City</Label>
                    <Select 
                      value={inputs.location} 
                      onValueChange={(v) => setInputs((s) => ({ ...s, location: v }))}
                      disabled={inputs.state && inputs.state !== "any" && cities.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={inputs.state && inputs.state !== "any" && cities.length === 0 ? "No cities in selected state" : "Any"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any City</SelectItem>
                        {cities.length > 0 ? (
                          cities.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))
                        ) : inputs.state && inputs.state !== "any" ? (
                          <SelectItem value="any" disabled>
                            No cities found
                          </SelectItem>
                        ) : null}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Budget</Label>
                    <Select value={inputs.budget} onValueChange={(v) => setInputs((s) => ({ ...s, budget: v as MatchInputs["budget"] }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="low">Low (≤ ₦100k)</SelectItem>
                        <SelectItem value="mid">Mid (₦100k–₦500k)</SelectItem>
                        <SelectItem value="high">High (₦500k+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2 rounded-md border p-3">
                    <Checkbox
                      checked={inputs.proBonoOnly}
                      onCheckedChange={(v) => setInputs((s) => ({ ...s, proBonoOnly: Boolean(v) }))}
                    />
                    <Label>Pro Bono Only</Label>
                  </div>
                  <div className="flex items-center gap-2 rounded-md border p-3">
                    <Checkbox
                      checked={inputs.urgency === "emergency"}
                      onCheckedChange={(v) => setInputs((s) => ({ ...s, urgency: v ? "emergency" : undefined }))}
                    />
                    <Label>Emergency Available</Label>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setInputs({
                        query: "",
                        location: "any",
                        budget: "any",
                        proBonoOnly: false,
                        country: "any",
                        state: "any",
                      });
                    }}
                  >
                    Clear Filters
                  </Button>
                  <div className="text-sm text-muted-foreground text-center">
                    {results.length} lawyer{results.length !== 1 ? "s" : ""} found
                  </div>
                </div>
              </div>
            </Card>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* View Toggle */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-muted-foreground">
                Showing {paginatedResults.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, results.length)} of {results.length}
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4 mr-2" />
                  List
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("map")}
                >
                  <Map className="h-4 w-4 mr-2" />
                  Map
                </Button>
              </div>
            </div>

            {/* Results */}
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted" />
                  </Card>
                ))}
              </div>
            ) : viewMode === "map" ? (
              <Card className="p-8 text-center">
                <Map className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Map view coming soon</p>
              </Card>
            ) : paginatedResults.length === 0 ? (
              <Card className="p-12 text-center">
                <Gavel className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No lawyers found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search query.</p>
                <Button variant="outline" onClick={() => {
                  setInputs({
                    query: "",
                    location: "any",
                    budget: "any",
                    proBonoOnly: false,
                    country: "any",
                    state: "any",
                  });
                }}>
                  Clear All Filters
                </Button>
              </Card>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                  {paginatedResults.map(({ p }) => (
                    <LawyerCard
                      key={p.id}
                      lawyer={p}
                      isSelected={selected[p.id]}
                      onSelect={() => setSelected((s) => ({ ...s, [p.id]: !s[p.id] }))}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <div className="flex gap-1">
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LawyerCard({
  lawyer,
  isSelected,
  onSelect,
}: {
  lawyer: DirectoryLawyer;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const avgWinRate = lawyer.caseOutcomes && lawyer.caseOutcomes.length > 0
    ? lawyer.caseOutcomes.reduce((sum, co) => sum + co.winRate, 0) / lawyer.caseOutcomes.length
    : 0;

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-lg font-semibold">
                  {lawyer.photoInitials}
                </div>
                <div>
                  <h3 className="font-headline font-semibold text-lg">{lawyer.name}</h3>
                  <p className="text-sm text-muted-foreground">{lawyer.title}</p>
                </div>
              </div>
              <Checkbox checked={isSelected} onCheckedChange={() => {
                onSelect();
              }} />
            </div>

            {lawyer.firmName && (
              <p className="text-sm font-medium mb-2">{lawyer.firmName}</p>
            )}

            <div className="flex flex-wrap gap-2 mb-3">
              {lawyer.verified && (
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700">
                  <ShieldCheck className="mr-1 h-3 w-3" /> Verified
                </Badge>
              )}
              {lawyer.badges.slice(0, 2).map((badge) => (
                <Badge key={badge} variant="outline" className="text-xs">
                  {badge}
                </Badge>
              ))}
            </div>

            {lawyer.practiceAreas.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-1">Practice Areas</p>
                <div className="flex flex-wrap gap-1">
                  {lawyer.practiceAreas.slice(0, 3).map((pa) => (
                    <Badge key={pa} variant="secondary" className="text-xs">
                      {pa}
                    </Badge>
                  ))}
                  {lawyer.practiceAreas.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{lawyer.practiceAreas.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2 text-sm mb-4">
              {lawyer.locations.length > 0 && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {lawyer.locations.join(", ")}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500" />
                <span className="font-semibold">{lawyer.trust.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({lawyer.trust.reviewCount} reviews)</span>
              </div>
              {avgWinRate > 0 && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-semibold">{avgWinRate.toFixed(0)}% Win Rate</span>
                </div>
              )}
              <div className="text-sm font-semibold">
                Consult: {formatNGN(lawyer.pricing.consultationFeeNGN)}
              </div>
            </div>

            <Button className="w-full" asChild onClick={(e) => {
              e.stopPropagation();
            }}>
              <Link href={`/lawyers/${lawyer.id}`}>
                View Profile
              </Link>
            </Button>
          </div>
        </Card>
  );
}

function LawyerDetailDialog({
  lawyerId,
  onClose,
}: {
  lawyerId: string;
  onClose: () => void;
}) {
  const [lawyer, setLawyer] = useState<DirectoryLawyer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const result = await getLawyers();
      if (result.success && result.data) {
        const found = result.data.find((l) => l.id === lawyerId);
        setLawyer(found || null);
      }
      setIsLoading(false);
    }
    load();
  }, [lawyerId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Lawyer not found</p>
        <Button onClick={onClose} className="mt-4">Close</Button>
      </div>
    );
  }

  return <LawyerDetailDialogContent lawyerId={lawyer.id} />;
}

function LawyerDetailDialogContent({ lawyerId }: { lawyerId: string }) {
  const [lawyer, setLawyer] = useState<DirectoryLawyer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    async function load() {
      const result = await getLawyers();
      if (result.success && result.data) {
        const found = result.data.find((l) => l.id === lawyerId);
        setLawyer(found || null);
      }
      setIsLoading(false);
    }
    load();
  }, [lawyerId]);

  if (isLoading || !lawyer) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const avgWinRate = lawyer.caseOutcomes && lawyer.caseOutcomes.length > 0
    ? lawyer.caseOutcomes.reduce((sum, co) => sum + co.winRate, 0) / lawyer.caseOutcomes.length
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-semibold">
            {lawyer.photoInitials}
          </div>
          <div>
            <h2 className="text-2xl font-headline font-bold">{lawyer.name}</h2>
            <p className="text-muted-foreground">{lawyer.title}</p>
            {lawyer.firmName && <p className="text-sm font-medium mt-1">{lawyer.firmName}</p>}
          </div>
        </div>
        {lawyer.verified && (
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700">
            <ShieldCheck className="mr-1 h-3 w-3" /> Verified by NBA
          </Badge>
        )}
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {lawyer.bio && (
            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-sm text-muted-foreground">{lawyer.bio}</p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Practice Areas</h3>
              <div className="flex flex-wrap gap-2">
                {lawyer.practiceAreas.map((pa) => (
                  <Badge key={pa} variant="secondary">
                    {pa}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Jurisdictions</h3>
              <div className="flex flex-wrap gap-2">
                {lawyer.jurisdictions.map((j) => (
                  <Badge key={j} variant="outline">
                    {j}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Contact</h3>
            <div className="space-y-2 text-sm">
              {lawyer.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {lawyer.email}
                </div>
              )}
              {lawyer.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {lawyer.phone}
                </div>
              )}
              {lawyer.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a href={lawyer.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {lawyer.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="experience" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Court Experience</h3>
              <div className="space-y-2 text-sm">
                {lawyer.courtExperience.supremeCourt && (
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-500" />
                    Supreme Court
                  </div>
                )}
                {lawyer.courtExperience.appealCourt && (
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-blue-500" />
                    Appeal Court
                  </div>
                )}
                {lawyer.courtExperience.highCourt && (
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    High Court
                  </div>
                )}
                {lawyer.courtExperience.taxAppealTribunal && (
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-emerald-500" />
                    Tax Appeal Tribunal
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Statistics</h3>
              <div className="space-y-2 text-sm">
                <div>Years Experience: {lawyer.yearsExperience}</div>
                <div>Rating: {lawyer.trust.rating.toFixed(1)}/5 ({lawyer.trust.reviewCount} reviews)</div>
                {avgWinRate > 0 && (
                  <div className="font-semibold text-emerald-600">
                    Overall Win Rate: {avgWinRate.toFixed(0)}%
                  </div>
                )}
              </div>
            </div>
          </div>

          {lawyer.caseOutcomes && lawyer.caseOutcomes.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Case Outcomes by Practice Area</h3>
              <div className="space-y-3">
                {lawyer.caseOutcomes.map((outcome, i) => (
                  <div key={i} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold">{outcome.area}</span>
                      <Badge variant="secondary">{outcome.winRate}% Win Rate</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {outcome.casesHandled} cases handled
                      {outcome.averageSettlement && ` • Avg Settlement: ${formatNGN(outcome.averageSettlement)}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Consultation Fee</h3>
              <p className="text-2xl font-bold">{formatNGN(lawyer.pricing.consultationFeeNGN)}</p>
            </div>
            {lawyer.pricing.hourlyRateNGN && (
              <div>
                <h3 className="font-semibold mb-2">Hourly Rate</h3>
                <p className="text-2xl font-bold">{formatNGN(lawyer.pricing.hourlyRateNGN)}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            {lawyer.pricing.fairPricingPledge && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Fair Pricing Pledge
              </div>
            )}
            {lawyer.pricing.proBono && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Pro Bono Available
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2">Availability</h3>
            <div className="text-sm text-muted-foreground">
              <div>Response Time: {lawyer.availability.responseSlaHours} hours</div>
              <div>Booking Modes: {lawyer.availability.bookingModes.join(", ")}</div>
              {lawyer.availability.emergencyAvailable && (
                <div className="flex items-center gap-2 text-emerald-600 font-semibold mt-2">
                  <AlertCircle className="h-4 w-4" />
                  Emergency Services Available
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Separator />

      <div className="flex gap-3">
        <Button className="flex-1" onClick={() => setShowBooking(true)}>
          Request Consultation
        </Button>
        {lawyer.phone && (
          <Button variant="outline" asChild>
            <a href={`tel:${lawyer.phone}`}>
              <Phone className="mr-2 h-4 w-4" />
              Call
            </a>
          </Button>
        )}
      </div>

      {showBooking && (
        <BookingForm
          lawyer={lawyer}
          onSuccess={() => {
            setShowBooking(false);
          }}
        />
      )}
    </div>
  );
}

function BookingForm({
  lawyer,
  onSuccess,
}: {
  lawyer: DirectoryLawyer;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [payload, setPayload] = useState({
    name: "",
    email: "",
    phone: "",
    summary: "",
    preferredMode: "Call" as "Call" | "Video" | "In-person",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/lawyers/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lawyerId: lawyer.id,
          lawyerName: lawyer.name,
          lawyerEmail: lawyer.email,
          ...payload,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("sent");
        toast({
          title: "Request Sent",
          description: "The lawyer will respond within their stated response time.",
        });
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        throw new Error(data.error || "Failed to send request");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send booking request. Please try again.",
      });
      setStatus("idle");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3">
        <div className="grid gap-2">
          <Label>Your Name *</Label>
          <Input
            value={payload.name}
            onChange={(e) => setPayload((s) => ({ ...s, name: e.target.value }))}
            required
            disabled={status === "sent"}
          />
        </div>
        <div className="grid gap-2">
          <Label>Email *</Label>
          <Input
            type="email"
            value={payload.email}
            onChange={(e) => setPayload((s) => ({ ...s, email: e.target.value }))}
            required
            disabled={status === "sent"}
          />
        </div>
        <div className="grid gap-2">
          <Label>Phone *</Label>
          <Input
            type="tel"
            value={payload.phone}
            onChange={(e) => setPayload((s) => ({ ...s, phone: e.target.value }))}
            required
            disabled={status === "sent"}
          />
        </div>
        <div className="grid gap-2">
          <Label>Preferred Mode</Label>
          <Select
            value={payload.preferredMode}
            onValueChange={(v) => {
              const mode = v as "Call" | "Video" | "In-person";
              setPayload((s) => ({ ...s, preferredMode: mode }));
            }}
            disabled={status === "sent"}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {lawyer.availability.bookingModes.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Describe Your Legal Issue *</Label>
          <Textarea
            rows={4}
            value={payload.summary}
            onChange={(e) => setPayload((s) => ({ ...s, summary: e.target.value }))}
            placeholder="Describe your tax-related legal issue..."
            required
            disabled={status === "sent"}
          />
        </div>
      </div>

      {status === "sent" ? (
        <div className="rounded-lg border bg-emerald-500/10 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
            <CheckCircle2 className="h-4 w-4" /> Request sent successfully
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            We've notified {lawyer.name} and sent you a confirmation email. They'll respond within {lawyer.availability.responseSlaHours} hours.
          </div>
        </div>
      ) : (
        <Button type="submit" disabled={status === "sending"} className="w-full">
          {status === "sending" ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Request"
          )}
        </Button>
      )}
    </form>
  );
}
