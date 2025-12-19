"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Gavel, Sparkles, LoaderCircle, Scale, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

type LegalIssueClassification = {
  practiceArea: string;
  urgency: "emergency" | "urgent" | "standard";
  complexity: "simple" | "moderate" | "complex";
  costRange: "low" | "mid" | "high";
  location: string;
  proBono: boolean;
  description: string;
};

export default function LawyersDirectoryClient() {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [isClassifying, setIsClassifying] = useState(false);
  const [classification, setClassification] = useState<LegalIssueClassification | null>(null);
  const [showResults, setShowResults] = useState(false);

  async function handleClassify() {
    if (!query.trim()) {
      toast({
        variant: "destructive",
        title: "Please describe your issue",
        description: "Enter your tax-related legal issue to get started",
      });
      return;
    }

    setIsClassifying(true);
    try {
      const res = await fetch("/api/lawyers/ai-classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();

      if (data.success && data.data) {
        setClassification(data.data);
        setShowResults(true);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to classify your issue",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to analyze your issue. Please try again.",
      });
    } finally {
      setIsClassifying(false);
    }
  }

  function getUrgencyColor(urgency: string) {
    switch (urgency) {
      case "emergency":
        return "bg-red-500/10 text-red-700 border-red-500/20";
      case "urgent":
        return "bg-orange-500/10 text-orange-700 border-orange-500/20";
      default:
        return "bg-blue-500/10 text-blue-700 border-blue-500/20";
    }
  }

  function getCostRangeText(range: string) {
    switch (range) {
      case "low":
        return "₦50K - ₦100K";
      case "mid":
        return "₦100K - ₦500K";
      case "high":
        return "₦500K+";
      default:
        return "Varies";
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Gavel className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-headline font-bold mb-4">
            Tax Legal Services Directory
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
            Find experienced tax lawyers for FIRS disputes, TAT appeals, tax litigation, and more
          </p>
          <p className="text-sm text-muted-foreground">
            Part of TaxCode - Connecting you with trusted tax legal professionals
          </p>
        </div>

        {/* AI Classifier Section */}
        <Card className="max-w-3xl mx-auto mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Describe Your Tax Legal Issue
            </CardTitle>
            <CardDescription>
              Our AI will analyze your situation and match you with the right tax lawyer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="e.g., 'FIRS is investigating my company for tax evasion' or 'I need to appeal a TAT decision'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleClassify()}
                className="text-base"
              />
              <p className="text-xs text-muted-foreground">
                Describe your tax-related legal issue in plain English. We'll find the right lawyer for you.
              </p>
            </div>
            <Button
              onClick={handleClassify}
              disabled={isClassifying || !query.trim()}
              className="w-full"
              size="lg"
            >
              {isClassifying ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Find the Right Tax Lawyer
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Classification Results */}
        {showResults && classification && (
          <Card className="max-w-3xl mx-auto mb-8 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                Analysis Complete
              </CardTitle>
              <CardDescription>Here's what we found about your issue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold mb-1">Practice Area</p>
                  <Badge variant="secondary" className="text-sm">
                    {classification.practiceArea}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">Urgency</p>
                  <Badge className={getUrgencyColor(classification.urgency)}>
                    {classification.urgency.charAt(0).toUpperCase() + classification.urgency.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">Complexity</p>
                  <Badge variant="outline" className="text-sm">
                    {classification.complexity.charAt(0).toUpperCase() + classification.complexity.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">Estimated Cost</p>
                  <Badge variant="outline" className="text-sm">
                    {getCostRangeText(classification.costRange)}
                  </Badge>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-semibold mb-2">Issue Summary</p>
                <p className="text-sm text-muted-foreground">{classification.description}</p>
              </div>

              {classification.urgency === "emergency" && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-800 mb-1">Legal Emergency</p>
                      <p className="text-xs text-red-700">
                        This appears to be an urgent legal matter. We'll prioritize matching you with lawyers available immediately.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <Button asChild className="flex-1">
                  <Link href={`/lawyers/search?practiceArea=${encodeURIComponent(classification.practiceArea)}&urgency=${classification.urgency}&proBono=${classification.proBono}`}>
                    Find Matching Lawyers
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowResults(false);
                    setClassification(null);
                    setQuery("");
                  }}
                >
                  Start Over
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Links */}
        <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Scale className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Tax Litigation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Court cases against FIRS, state tax authorities, and tax disputes
              </p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/lawyers/search?practiceArea=Tax Litigation">Find Lawyers</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Gavel className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">TAT Appeals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Tax Appeal Tribunal matters and representation
              </p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/lawyers/search?practiceArea=Tax Appeal Tribunal">Find Lawyers</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <AlertCircle className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">FIRS Disputes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                FIRS audits, investigations, and legal representation
              </p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/lawyers/search?practiceArea=FIRS Disputes">Find Lawyers</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="max-w-3xl mx-auto mt-8">
          <CardHeader>
            <CardTitle>Why Tax Legal Services?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Tax consultants</strong> help with filing, compliance, and tax planning.
            </p>
            <p>
              <strong className="text-foreground">Tax lawyers</strong> handle legal proceedings, court cases, appeals, and disputes that require legal representation.
            </p>
            <p>
              When FIRS investigates, when you need to appeal a tax decision, or when facing tax litigation, you need a qualified tax lawyer.
            </p>
            <div className="pt-4 border-t">
              <Button asChild variant="outline">
                <Link href="/directory">Looking for Tax Consultants Instead?</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

