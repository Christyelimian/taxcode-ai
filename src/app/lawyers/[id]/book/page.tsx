"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LoaderCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getLawyerById } from "@/app/actions";

export default function BookLawyerPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const lawyerId = params.id as string;
  const [lawyer, setLawyer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    preferredMode: "Call" as "Call" | "Video" | "In-person",
    summary: "",
    urgency: "normal" as "normal" | "urgent" | "emergency",
  });

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const result = await getLawyerById(lawyerId);
      if (result.success && result.data) {
        setLawyer(result.data);
      } else {
        toast({
          variant: "destructive",
          title: "Lawyer not found",
          description: "This lawyer profile does not exist",
        });
        router.push("/lawyers");
      }
      setIsLoading(false);
    }
    load();
  }, [lawyerId, router, toast]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/lawyers/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lawyerId,
          ...formData,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setIsSuccess(true);
        toast({
          title: "Booking request submitted!",
          description: "The lawyer will contact you soon.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to submit booking request",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit booking request",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!lawyer) {
    return null;
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-headline font-bold mb-2">Booking Request Submitted!</h2>
            <p className="text-muted-foreground mb-6">
              Your consultation request has been sent to {lawyer.name}. They will contact you soon.
            </p>
            <div className="flex gap-2">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/lawyers">Browse More Lawyers</Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href={`/lawyers/${lawyerId}`}>View Lawyer Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Back Button */}
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href={`/lawyers/${lawyerId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Link>
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-headline font-bold mb-2">Book Consultation</h1>
          <p className="text-muted-foreground">
            Request a consultation with <span className="font-semibold">{lawyer.name}</span>
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Lawyer Info Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Lawyer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold">{lawyer.name}</p>
                <p className="text-sm text-muted-foreground">{lawyer.title}</p>
              </div>
              {lawyer.firmName && (
                <div>
                  <p className="text-sm font-semibold">Firm</p>
                  <p className="text-sm text-muted-foreground">{lawyer.firmName}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-semibold">Consultation Fee</p>
                <p className="text-lg font-bold">₦{lawyer.consultationFeeNGN?.toLocaleString() || "N/A"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>Fill in your details to request a consultation</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="clientName">Full Name *</Label>
                    <Input
                      id="clientName"
                      required
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="clientEmail">Email *</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      required
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="clientPhone">Phone *</Label>
                  <Input
                    id="clientPhone"
                    type="tel"
                    required
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    placeholder="+234..."
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="preferredMode">Preferred Mode *</Label>
                    <Select
                      value={formData.preferredMode}
                      onValueChange={(v) => setFormData({ ...formData, preferredMode: v as "Call" | "Video" | "In-person" })}
                    >
                      <SelectTrigger id="preferredMode">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {lawyer.bookingModes?.includes("Call") && (
                          <SelectItem value="Call">Call</SelectItem>
                        )}
                        {lawyer.bookingModes?.includes("Video") && (
                          <SelectItem value="Video">Video</SelectItem>
                        )}
                        {lawyer.bookingModes?.includes("In-person") && (
                          <SelectItem value="In-person">In-person</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="urgency">Urgency</Label>
                    <Select
                      value={formData.urgency}
                      onValueChange={(v) => setFormData({ ...formData, urgency: v as "normal" | "urgent" | "emergency" })}
                    >
                      <SelectTrigger id="urgency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="summary">Legal Issue Summary *</Label>
                  <Textarea
                    id="summary"
                    required
                    rows={5}
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="Briefly describe your tax legal issue or what you need help with..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Provide as much detail as possible to help the lawyer prepare for your consultation
                  </p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" asChild className="flex-1">
                    <Link href={`/lawyers/${lawyerId}`}>Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Request"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


