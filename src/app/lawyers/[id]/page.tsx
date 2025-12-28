"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Gavel, ShieldCheck, Phone, Mail, Globe, Award, TrendingUp, MapPin, Clock, Star, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getLawyerById } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { LoaderCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function LawyerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const lawyerId = params.id as string;
  const [lawyer, setLawyer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingDialog, setShowBookingDialog] = useState(false);

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
          description: result.error || "This lawyer profile does not exist",
        });
        router.push("/lawyers");
      }
      setIsLoading(false);
    }
    load();
  }, [lawyerId, router, toast]);

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

  const avgWinRate = lawyer.caseOutcomes && lawyer.caseOutcomes.length > 0
    ? lawyer.caseOutcomes.reduce((sum: number, co: any) => sum + co.winRate, 0) / lawyer.caseOutcomes.length
    : 0;

  const totalCases = lawyer.caseOutcomes?.reduce((sum: number, co: any) => sum + co.casesHandled, 0) || 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/lawyers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Directory
          </Link>
        </Button>

        {/* Header Section */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-headline font-bold">{lawyer.name}</h1>
                      {lawyer.verified && (
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700">
                          <ShieldCheck className="mr-1 h-3 w-3" /> Verified
                        </Badge>
                      )}
                      {lawyer.emergencyAvailable && (
                        <Badge variant="destructive">
                          <AlertCircle className="mr-1 h-3 w-3" /> Emergency Available
                        </Badge>
                      )}
                    </div>
                    <p className="text-xl text-muted-foreground mb-2">{lawyer.title}</p>
                    {lawyer.firmName && (
                      <p className="text-lg font-semibold text-foreground">{lawyer.firmName}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                  {lawyer.locations && lawyer.locations.length > 0 && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{lawyer.locations.join(", ")}</span>
                    </div>
                  )}
                  {lawyer.yearsExperience > 0 && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Award className="h-4 w-4" />
                      <span>{lawyer.yearsExperience} years experience</span>
                    </div>
                  )}
                  {lawyer.rating > 0 && (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      <span className="font-semibold">{lawyer.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">({lawyer.reviewCount || 0} reviews)</span>
                    </div>
                  )}
                </div>

                {lawyer.practiceAreas && lawyer.practiceAreas.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {lawyer.practiceAreas.map((pa: string) => (
                      <Badge key={pa} variant="secondary">
                        {pa}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="md:w-80 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Consultation Fee</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">
                      ₦{lawyer.consultationFeeNGN?.toLocaleString() || "N/A"}
                    </div>
                    {lawyer.proBono && (
                      <Badge variant="secondary" className="mb-2">
                        Pro Bono Available
                      </Badge>
                    )}
                    <Button className="w-full" size="lg" onClick={() => setShowBookingDialog(true)}>
                      Book Consultation
                    </Button>
                  </CardContent>
                </Card>

                {avgWinRate > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                        Win Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-emerald-600 mb-1">
                        {avgWinRate.toFixed(0)}%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {totalCases} cases handled
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="pricing">Pricing & Services</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                {lawyer.bio ? (
                  <p className="text-muted-foreground whitespace-pre-line">{lawyer.bio}</p>
                ) : (
                  <p className="text-muted-foreground italic">No bio available</p>
                )}
              </CardContent>
            </Card>

            {lawyer.practiceAreas && lawyer.practiceAreas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Practice Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2">
                    {lawyer.practiceAreas.map((pa: string) => (
                      <div key={pa} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span>{pa}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {lawyer.jurisdictions && lawyer.jurisdictions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Jurisdictions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {lawyer.jurisdictions.map((j: string) => (
                      <Badge key={j} variant="outline">
                        {j}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {lawyer.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <a href={`mailto:${lawyer.email}`} className="hover:underline">
                      {lawyer.email}
                    </a>
                  </div>
                )}
                {lawyer.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <a href={`tel:${lawyer.phone}`} className="hover:underline">
                      {lawyer.phone}
                    </a>
                  </div>
                )}
                {lawyer.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <a href={lawyer.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {lawyer.website}
                    </a>
                  </div>
                )}
                {lawyer.firmAddress && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <span className="text-muted-foreground">{lawyer.firmAddress}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Court Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {lawyer.courtExperience?.highCourt && (
                    <div className="flex items-center gap-2 p-3 border rounded-lg">
                      <Gavel className="h-5 w-5 text-primary" />
                      <span className="font-semibold">High Court</span>
                    </div>
                  )}
                  {lawyer.courtExperience?.appealCourt && (
                    <div className="flex items-center gap-2 p-3 border rounded-lg">
                      <Gavel className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Appeal Court</span>
                    </div>
                  )}
                  {lawyer.courtExperience?.supremeCourt && (
                    <div className="flex items-center gap-2 p-3 border rounded-lg">
                      <Gavel className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Supreme Court</span>
                    </div>
                  )}
                  {lawyer.courtExperience?.taxAppealTribunal && (
                    <div className="flex items-center gap-2 p-3 border rounded-lg">
                      <Gavel className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Tax Appeal Tribunal (TAT)</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {lawyer.caseOutcomes && lawyer.caseOutcomes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Case Outcomes</CardTitle>
                  <CardDescription>Track record by practice area</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {lawyer.caseOutcomes.map((outcome: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{outcome.area}</h4>
                            <p className="text-sm text-muted-foreground">
                              {outcome.casesHandled} cases handled
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-lg">
                            {outcome.winRate}% Win Rate
                          </Badge>
                        </div>
                        {outcome.averageSettlement && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Average Settlement: ₦{outcome.averageSettlement.toLocaleString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {lawyer.barNumber && (
              <Card>
                <CardHeader>
                  <CardTitle>Bar Credentials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {lawyer.barNumber && (
                    <div>
                      <span className="text-sm font-semibold">Bar Number:</span>{" "}
                      <span className="text-muted-foreground">{lawyer.barNumber}</span>
                    </div>
                  )}
                  {lawyer.barAssociation && (
                    <div>
                      <span className="text-sm font-semibold">Bar Association:</span>{" "}
                      <span className="text-muted-foreground">{lawyer.barAssociation}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Consultation Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">Initial Consultation</p>
                    <p className="text-sm text-muted-foreground">One-time fee</p>
                  </div>
                  <div className="text-2xl font-bold">
                    ₦{lawyer.consultationFeeNGN?.toLocaleString() || "N/A"}
                  </div>
                </div>
                {lawyer.hourlyRateNGN && (
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">Hourly Rate</p>
                      <p className="text-sm text-muted-foreground">For ongoing work</p>
                    </div>
                    <div className="text-2xl font-bold">
                      ₦{lawyer.hourlyRateNGN.toLocaleString()}
                    </div>
                  </div>
                )}
                {lawyer.fairPricingPledge && (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                        Fair Pricing Pledge
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      This lawyer has committed to transparent, fair pricing
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {lawyer.documentReviewEnabled && (
              <Card>
                <CardHeader>
                  <CardTitle>Document Review Services</CardTitle>
                  <CardDescription>Fixed-price document reviews</CardDescription>
                </CardHeader>
                <CardContent>
                  {lawyer.documentReviewPricing && Object.keys(lawyer.documentReviewPricing).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(lawyer.documentReviewPricing).map(([docType, price]) => (
                        <div key={docType} className="flex justify-between items-center p-3 border rounded-lg">
                          <span className="font-semibold">{docType}</span>
                          <span className="text-lg font-bold">₦{Number(price).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Contact for pricing</p>
                  )}
                  <Button asChild className="mt-4" variant="outline">
                    <Link href="/lawyers/documents">View Document Review Marketplace</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {lawyer.bookingModes && lawyer.bookingModes.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2">Booking Modes</p>
                    <div className="flex flex-wrap gap-2">
                      {lawyer.bookingModes.map((mode: string) => (
                        <Badge key={mode} variant="secondary">
                          {mode}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {lawyer.responseSlaHours && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Response time: {lawyer.responseSlaHours} hours
                    </span>
                  </div>
                )}
                {lawyer.availabilityNotes && (
                  <div>
                    <p className="text-sm font-semibold mb-1">Availability Notes</p>
                    <p className="text-sm text-muted-foreground">{lawyer.availabilityNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-headline font-bold mb-2">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6">
              Book a consultation with {lawyer.name} to discuss your tax legal matter
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => setShowBookingDialog(true)}>
                Book Consultation
              </Button>
              {lawyer.phone && (
                <Button asChild variant="outline" size="lg">
                  <a href={`tel:${lawyer.phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call Now
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Booking Dialog */}
        <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Book Consultation with {lawyer.name}</DialogTitle>
              <DialogDescription>
                Fill in your details to request a consultation
              </DialogDescription>
            </DialogHeader>
            <BookingForm
              lawyer={lawyer}
              onSuccess={() => {
                setShowBookingDialog(false);
                toast({
                  title: "Booking request submitted!",
                  description: "The lawyer will contact you soon.",
                });
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function BookingForm({
  lawyer,
  onSuccess,
}: {
  lawyer: any;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    preferredMode: "Call" as "Call" | "Video" | "In-person",
    summary: "",
    urgency: "normal" as "normal" | "urgent" | "emergency",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/lawyers/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lawyerId: lawyer.id,
          ...formData,
        }),
      });

      const data = await response.json();
      if (data.success) {
        onSuccess();
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
        <Button type="button" variant="outline" onClick={() => onSuccess()} className="flex-1">
          Cancel
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
  );
}




