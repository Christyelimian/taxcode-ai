"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Phone, Clock, ShieldCheck, LoaderCircle, Gavel, Mail } from "lucide-react";
import { getLawyers } from "@/app/actions";
import Link from "next/link";

export default function EmergencyHotlinePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emergencyType, setEmergencyType] = useState<string>("");
  const [description, setDescription] = useState("");
  const [availableLawyers, setAvailableLawyers] = useState<any[]>([]);

  const emergencyTypes = [
    { value: "police", label: "Police Station Issue", icon: "🚓", urgent: true },
    { value: "arrest", label: "Unlawful Arrest", icon: "⚠️", urgent: true },
    { value: "court", label: "Court Appearance Tomorrow", icon: "⚖️", urgent: true },
    { value: "firs", label: "FIRS Investigation", icon: "📋", urgent: true },
    { value: "tax_dispute", label: "Tax Dispute Urgent", icon: "💰", urgent: true },
    { value: "other", label: "Other Emergency", icon: "🚨", urgent: true },
  ];

  async function handleSearch() {
    if (!emergencyType) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select an emergency type",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await getLawyers({
        emergencyAvailable: true,
        limit: 10,
      });

      if (result.success && result.data) {
        setAvailableLawyers(result.data);
        if (result.data.length === 0) {
          toast({
            title: "No lawyers available",
            description: "No emergency lawyers are currently available. Please try again later or contact us directly.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to find emergency lawyers",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to search for emergency lawyers",
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950 dark:via-orange-950 dark:to-yellow-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-4xl font-headline font-bold mb-2">Emergency Legal Hotline</h1>
          <p className="text-lg text-muted-foreground">
            Get immediate legal assistance for urgent tax-related matters
          </p>
        </div>

        <Card className="mb-6 border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-red-600" />
              Your Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-600">✅</span>
              <span>Right to silence - You don't have to answer questions without a lawyer</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">✅</span>
              <span>Right to lawyer - You can request legal representation</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">✅</span>
              <span>Right to make a call - Contact family or lawyer</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-600">❌</span>
              <span>NO torture or forced confession</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-600">❌</span>
              <span>NO detention beyond 48 hours without charge</span>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What's Your Emergency?</CardTitle>
            <CardDescription>Select the type of emergency and describe your situation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {emergencyTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={emergencyType === type.value ? "default" : "outline"}
                  className="justify-start h-auto p-4"
                  onClick={() => setEmergencyType(type.value)}
                >
                  <span className="text-2xl mr-3">{type.icon}</span>
                  <div className="text-left">
                    <div className="font-semibold">{type.label}</div>
                    {type.urgent && (
                      <Badge variant="destructive" className="mt-1">URGENT</Badge>
                    )}
                  </div>
                </Button>
              ))}
            </div>

            <div className="grid gap-2">
              <Label>Describe Your Emergency</Label>
              <Textarea
                rows={4}
                placeholder="Briefly describe what happened and what you need help with..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <Button
              onClick={handleSearch}
              disabled={isLoading || !emergencyType}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Searching for available lawyers...
                </>
              ) : (
                <>
                  <Phone className="mr-2 h-4 w-4" />
                  Find Emergency Lawyer Now
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {availableLawyers.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-headline font-bold">Available Emergency Lawyers</h2>
            {availableLawyers.map((lawyer) => (
              <Card key={lawyer.id} className="border-emerald-200 dark:border-emerald-900">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Gavel className="h-5 w-5 text-emerald-600" />
                        {lawyer.name}
                      </CardTitle>
                      <CardDescription>{lawyer.title}</CardDescription>
                    </div>
                    <Badge variant="default" className="bg-emerald-600">
                      Available Now
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2 md:grid-cols-2">
                    {lawyer.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`tel:${lawyer.phone}`}
                          className="text-sm font-semibold hover:underline"
                        >
                          {lawyer.phone}
                        </a>
                      </div>
                    )}
                    {lawyer.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`mailto:${lawyer.email}`}
                          className="text-sm hover:underline"
                        >
                          {lawyer.email}
                        </a>
                      </div>
                    )}
                  </div>

                  {lawyer.practiceAreas && lawyer.practiceAreas.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-2">Practice Areas</p>
                      <div className="flex flex-wrap gap-2">
                        {lawyer.practiceAreas.slice(0, 3).map((pa: string) => (
                          <Badge key={pa} variant="secondary">
                            {pa}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {lawyer.emergencyAvailable && (
                    <div className="flex items-center gap-2 text-sm text-emerald-600">
                      <Clock className="h-4 w-4" />
                      <span>Emergency services available 24/7</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {lawyer.phone && (
                      <Button asChild className="flex-1">
                        <a href={`tel:${lawyer.phone}`}>
                          <Phone className="mr-2 h-4 w-4" />
                          Call Now
                        </a>
                      </Button>
                    )}
                    <Button asChild variant="outline" className="flex-1">
                      <Link href={`/lawyers?lawyer=${lawyer.id}`}>
                        View Profile
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-6 bg-muted">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              If no lawyers are available, contact us directly:
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="tel:+2348000000000">Call Hotline</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

