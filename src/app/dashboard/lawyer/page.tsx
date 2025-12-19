"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getLawyerById, type TeamMember } from "@/app/actions";
import { ShieldCheck, Edit, CreditCard, Mail, Phone, Globe, LoaderCircle, Gavel, Award, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LawyerDashboardPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [lawyer, setLawyer] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/lawyer/me");
        const data = await res.json();
        
        if (data.success && data.data) {
          setLawyer(data.data);
        } else {
          router.push("/lawyer/claim");
          return;
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your profile",
        });
      }
      setIsLoading(false);
    }
    load();
  }, [router, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No lawyer profile found.</p>
            <Button asChild>
              <Link href="/lawyer/claim">Claim Your Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const avgWinRate = lawyer.caseOutcomes && lawyer.caseOutcomes.length > 0
    ? lawyer.caseOutcomes.reduce((sum, co) => sum + co.winRate, 0) / lawyer.caseOutcomes.length
    : 0;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-headline font-bold">My Lawyer Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your directory listing and profile</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {lawyer.name}
                    {lawyer.verified && (
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700">
                        <ShieldCheck className="mr-1 h-3 w-3" /> Verified
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{lawyer.title}</CardDescription>
                </div>
                <Button asChild>
                  <Link href="/dashboard/lawyer/edit">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold mb-1">Contact</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {lawyer.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {lawyer.email}
                      </div>
                    )}
                    {lawyer.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {lawyer.phone}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">Location</p>
                  <div className="text-sm text-muted-foreground">
                    {[lawyer.city, lawyer.state, lawyer.country].filter(Boolean).join(", ")}
                  </div>
                </div>
              </div>

              {lawyer.practiceAreas && lawyer.practiceAreas.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">Practice Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {lawyer.practiceAreas.map((pa) => (
                      <Badge key={pa} variant="secondary">
                        {pa}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {lawyer.caseOutcomes && lawyer.caseOutcomes.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">Case Outcomes</p>
                  <div className="space-y-2">
                    {lawyer.caseOutcomes.map((outcome, i) => (
                      <div key={i} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">{outcome.area}</span>
                          <Badge variant="secondary">{outcome.winRate}% Win Rate</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {outcome.casesHandled} cases handled
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {avgWinRate > 0 && (
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-sm font-semibold">Overall Win Rate</p>
                      <p className="text-2xl font-bold text-emerald-600">{avgWinRate.toFixed(0)}%</p>
                    </div>
                  </div>
                </div>
              )}

              {lawyer.bio && (
                <div>
                  <p className="text-sm font-semibold mb-1">Bio</p>
                  <p className="text-sm text-muted-foreground">{lawyer.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Subscription</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Badge variant={lawyer.paymentStatus === "free" ? "outline" : "default"}>
                      {lawyer.paymentStatus || "Free"}
                    </Badge>
                  </div>
                  <Button asChild className="w-full">
                    <Link href="/dashboard/lawyer/payment">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Manage Subscription
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Profile Views</span>
                  <span className="font-semibold">-</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Booking Requests</span>
                  <span className="font-semibold">-</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-semibold">
                    {lawyer.rating?.toFixed(1) || "N/A"}
                  </span>
                </div>
                {avgWinRate > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Win Rate</span>
                    <span className="font-semibold text-emerald-600">{avgWinRate.toFixed(0)}%</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/dashboard/lawyer/bookings">
                    View Booking Requests
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/dashboard/lawyer/case-outcomes">
                    Manage Case Outcomes
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/dashboard/lawyer/edit">
                    Edit Profile
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href={`/lawyers?lawyer=${lawyer.id}`} target="_blank">
                    View Public Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
