"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getConsultantById, updateConsultant, type TeamMember } from "@/app/actions";
import { ShieldCheck, Edit, CreditCard, Mail, Phone, Globe, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ConsultantDashboardPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [consultant, setConsultant] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/consultant/me");
        const data = await res.json();
        
        if (data.success && data.data) {
          setConsultant(data.data);
        } else {
          // No consultant profile claimed, redirect to claim page
          router.push("/consultant/claim");
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

  if (!consultant) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No consultant profile found.</p>
            <Button asChild>
              <Link href="/consultant/claim">Claim Your Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-headline font-bold">My Consultant Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your directory listing and profile</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {consultant.name}
                    {consultant.verified && (
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700">
                        <ShieldCheck className="mr-1 h-3 w-3" /> Verified
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{consultant.title}</CardDescription>
                </div>
                <Button asChild>
                  <Link href="/dashboard/consultant/edit">
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
                    {consultant.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {consultant.email}
                      </div>
                    )}
                    {consultant.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {consultant.phone}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">Location</p>
                  <div className="text-sm text-muted-foreground">
                    {[consultant.city, consultant.state, consultant.country].filter(Boolean).join(", ")}
                  </div>
                </div>
              </div>

              {consultant.specialties && consultant.specialties.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    {consultant.specialties.map((s) => (
                      <Badge key={s} variant="secondary">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {consultant.bio && (
                <div>
                  <p className="text-sm font-semibold mb-1">Bio</p>
                  <p className="text-sm text-muted-foreground">{consultant.bio}</p>
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
                    <Badge variant={consultant.paymentStatus === "free" ? "outline" : "default"}>
                      {consultant.paymentStatus || "Free"}
                    </Badge>
                  </div>
                  <Button asChild className="w-full">
                    <Link href="/dashboard/consultant/payment">
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
                    {consultant.rating?.toFixed(1) || "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/dashboard/consultant/bookings">
                    View Booking Requests
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/dashboard/consultant/edit">
                    Edit Profile
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href={`/directory?consultant=${consultant.id}`} target="_blank">
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

