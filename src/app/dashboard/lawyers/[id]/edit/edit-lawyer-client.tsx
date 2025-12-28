"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LoaderCircle, PlusCircle, Trash2, Save, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getLawyerById, updateConsultant, generateClaimToken, type TeamMember } from "@/app/actions";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const lawyerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  title: z.string().min(2),
  firmName: z.string().optional(),
  firmAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  barNumber: z.string().optional(),
  barAssociation: z.string().optional(),
  verified: z.boolean(),
  jurisdictions: z.array(z.string()),
  practiceAreas: z.array(z.string()),
  yearsExperience: z.number().min(0),
  languages: z.array(z.string()),
  consultationFeeNGN: z.number().min(0),
  hourlyRateNGN: z.number().optional(),
  fairPricingPledge: z.boolean(),
  proBono: z.boolean(),
  bookingModes: z.array(z.enum(["Call", "Video", "In-person"])),
  responseSlaHours: z.number().min(1),
  bio: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  availabilityNotes: z.string().optional(),
  paymentStatus: z.enum(["free", "basic", "premium", "enterprise"]).optional(),
  emergencyAvailable: z.boolean(),
  courtExperience: z.object({
    highCourt: z.boolean(),
    appealCourt: z.boolean(),
    supremeCourt: z.boolean(),
    taxAppealTribunal: z.boolean(),
  }),
  caseOutcomes: z.array(z.object({
    area: z.string(),
    winRate: z.number().min(0).max(100),
    casesHandled: z.number().min(0),
    averageSettlement: z.number().optional(),
  })).optional(),
  documentReviewEnabled: z.boolean(),
  documentReviewPricing: z.record(z.string(), z.number()).optional(),
});

type LawyerFormValues = z.infer<typeof lawyerSchema>;

const TAX_PRACTICE_AREAS = [
  "Tax Litigation",
  "Tax Appeal Tribunal",
  "FIRS Disputes",
  "Tax Compliance",
  "Tax Planning",
  "VAT Disputes",
  "Withholding Tax",
  "Corporate Tax",
  "Tax Fraud Defense",
  "Transfer Pricing",
  "International Tax",
  "Tax Investigation",
];

const NIGERIAN_JURISDICTIONS = [
  "Lagos",
  "Abuja",
  "Federal",
  "Rivers",
  "Kano",
  "Oyo",
  "Enugu",
  "Kaduna",
  "Delta",
  "Ogun",
  "Anambra",
  "Imo",
  "Plateau",
];

export default function EditLawyerClient({ lawyerId }: { lawyerId: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [claimToken, setClaimToken] = useState<string | null>(null);

  const form = useForm<LawyerFormValues>({
    resolver: zodResolver(lawyerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      title: "Tax Lawyer",
      firmName: "",
      firmAddress: "",
      city: "",
      state: "",
      country: "Nigeria",
      barNumber: "",
      barAssociation: "Nigerian Bar Association",
      verified: false,
      jurisdictions: [],
      practiceAreas: [],
      yearsExperience: 0,
      languages: ["English"],
      consultationFeeNGN: 50000,
      hourlyRateNGN: undefined,
      fairPricingPledge: true,
      proBono: false,
      bookingModes: ["Call", "Video"],
      responseSlaHours: 24,
      bio: "",
      website: "",
      linkedin: "",
      twitter: "",
      availabilityNotes: "",
      paymentStatus: "free",
      emergencyAvailable: false,
      courtExperience: {
        highCourt: false,
        appealCourt: false,
        supremeCourt: false,
        taxAppealTribunal: false,
      },
      caseOutcomes: [],
      documentReviewEnabled: false,
      documentReviewPricing: {},
    },
  });

  const {
    fields: practiceAreaFields,
    append: appendPracticeArea,
    remove: removePracticeArea,
  } = useFieldArray({ control: form.control, name: "practiceAreas" });
  const {
    fields: jurisdictionFields,
    append: appendJurisdiction,
    remove: removeJurisdiction,
  } = useFieldArray({ control: form.control, name: "jurisdictions" });
  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({ control: form.control, name: "languages" });
  const {
    fields: caseOutcomeFields,
    append: appendCaseOutcome,
    remove: removeCaseOutcome,
  } = useFieldArray({ control: form.control, name: "caseOutcomes" });

  useEffect(() => {
    async function load() {
      setIsFetching(true);
      const result = await getLawyerById(lawyerId);
      if (result.success && result.data) {
        const data = result.data;
        form.reset({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          title: data.title || "Tax Lawyer",
          firmName: data.firmName || "",
          firmAddress: data.firmAddress || "",
          city: data.city || "",
          state: data.state || "",
          country: data.country || "Nigeria",
          barNumber: data.barNumber || "",
          barAssociation: data.barAssociation || "Nigerian Bar Association",
          verified: data.verified ?? false,
          jurisdictions: data.jurisdictions || [],
          practiceAreas: data.practiceAreas || [],
          yearsExperience: data.yearsExperience || 0,
          languages: data.languages || ["English"],
          consultationFeeNGN: data.consultationFeeNGN || 50000,
          hourlyRateNGN: data.hourlyRateNGN,
          fairPricingPledge: data.fairPricingPledge ?? true,
          proBono: data.proBono ?? false,
          bookingModes: (data.bookingModes || ["Call", "Video"]) as ("Call" | "Video" | "In-person")[],
          responseSlaHours: data.responseSlaHours || 24,
          bio: data.bio || "",
          website: data.website || "",
          linkedin: data.linkedin || "",
          twitter: data.twitter || "",
          availabilityNotes: data.availabilityNotes || "",
          paymentStatus: (data.paymentStatus as "free" | "basic" | "premium" | "enterprise") || "free",
          emergencyAvailable: data.emergencyAvailable || false,
          courtExperience: data.courtExperience || {
            highCourt: false,
            appealCourt: false,
            supremeCourt: false,
            taxAppealTribunal: false,
          },
          caseOutcomes: data.caseOutcomes || [],
          documentReviewEnabled: data.documentReviewEnabled || false,
          documentReviewPricing: data.documentReviewPricing || {},
        });
        setClaimToken(data.claimToken || null);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to load lawyer",
        });
        router.push("/dashboard/lawyers");
      }
      setIsFetching(false);
    }
    load();
  }, [lawyerId, form, router, toast]);

  async function onSubmit(values: LawyerFormValues) {
    setIsLoading(true);
    const result = await updateConsultant(lawyerId, values);
    if (result.success) {
      toast({
        title: "Lawyer updated",
        description: "Changes have been saved successfully.",
      });
      router.push("/dashboard/lawyers");
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Failed to update lawyer",
      });
    }
    setIsLoading(false);
  }

  async function handleGenerateClaimToken() {
    const result = await generateClaimToken(lawyerId);
    if (result.success && result.data) {
      setClaimToken(result.data.token);
      toast({
        title: "Claim token generated",
        description: "Share this token with the lawyer to claim their profile.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Failed to generate claim token",
      });
    }
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/lawyers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Lawyers
            </Link>
          </Button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update lawyer's basic details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Full Name *</Label>
                  <Input {...form.register("name")} />
                </div>
                <div className="grid gap-2">
                  <Label>Email *</Label>
                  <Input type="email" {...form.register("email")} />
                  <p className="text-xs text-muted-foreground">
                    This email will receive booking notifications
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Phone</Label>
                  <Input type="tel" placeholder="+234..." {...form.register("phone")} />
                </div>
                <div className="grid gap-2">
                  <Label>Title *</Label>
                  <Input {...form.register("title")} />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Bio</Label>
                <Textarea rows={3} placeholder="Professional bio..." {...form.register("bio")} />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label>Website</Label>
                  <Input type="url" placeholder="https://..." {...form.register("website")} />
                </div>
                <div className="grid gap-2">
                  <Label>LinkedIn</Label>
                  <Input type="url" placeholder="https://linkedin.com/..." {...form.register("linkedin")} />
                </div>
                <div className="grid gap-2">
                  <Label>Twitter</Label>
                  <Input type="url" placeholder="https://twitter.com/..." {...form.register("twitter")} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Legal Credentials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Bar Number</Label>
                  <Input {...form.register("barNumber")} />
                </div>
                <div className="grid gap-2">
                  <Label>Bar Association</Label>
                  <Input {...form.register("barAssociation")} />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Jurisdictions</Label>
                {jurisdictionFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <Select
                      value={form.watch(`jurisdictions.${index}`)}
                      onValueChange={(v) => form.setValue(`jurisdictions.${index}`, v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select jurisdiction" />
                      </SelectTrigger>
                      <SelectContent>
                        {NIGERIAN_JURISDICTIONS.map((j) => (
                          <SelectItem key={j} value={j}>
                            {j}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeJurisdiction(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendJurisdiction("")}
                  className="mt-2"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Jurisdiction
                </Button>
              </div>

              <div className="grid gap-2">
                <Label>Practice Areas (Tax-Specific)</Label>
                {practiceAreaFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <Select
                      value={form.watch(`practiceAreas.${index}`)}
                      onValueChange={(v) => form.setValue(`practiceAreas.${index}`, v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select practice area" />
                      </SelectTrigger>
                      <SelectContent>
                        {TAX_PRACTICE_AREAS.map((pa) => (
                          <SelectItem key={pa} value={pa}>
                            {pa}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removePracticeArea(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendPracticeArea("")}
                  className="mt-2"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Practice Area
                </Button>
              </div>

              <div className="grid gap-2">
                <Label>Years of Experience</Label>
                <Input
                  type="number"
                  {...form.register("yearsExperience", { valueAsNumber: true })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Court Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2 rounded-md border p-3">
                  <Checkbox
                    checked={form.watch("courtExperience.highCourt")}
                    onCheckedChange={(v) => form.setValue("courtExperience.highCourt", Boolean(v))}
                  />
                  <Label>High Court</Label>
                </div>
                <div className="flex items-center gap-2 rounded-md border p-3">
                  <Checkbox
                    checked={form.watch("courtExperience.appealCourt")}
                    onCheckedChange={(v) => form.setValue("courtExperience.appealCourt", Boolean(v))}
                  />
                  <Label>Appeal Court</Label>
                </div>
                <div className="flex items-center gap-2 rounded-md border p-3">
                  <Checkbox
                    checked={form.watch("courtExperience.supremeCourt")}
                    onCheckedChange={(v) => form.setValue("courtExperience.supremeCourt", Boolean(v))}
                  />
                  <Label>Supreme Court</Label>
                </div>
                <div className="flex items-center gap-2 rounded-md border p-3">
                  <Checkbox
                    checked={form.watch("courtExperience.taxAppealTribunal")}
                    onCheckedChange={(v) => form.setValue("courtExperience.taxAppealTribunal", Boolean(v))}
                  />
                  <Label>Tax Appeal Tribunal (TAT)</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Case Outcomes</CardTitle>
              <CardDescription>Track win rates and case statistics by practice area</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {caseOutcomeFields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="grid gap-2">
                      <Label>Practice Area</Label>
                      <Select
                        value={form.watch(`caseOutcomes.${index}.area`)}
                        onValueChange={(v) => form.setValue(`caseOutcomes.${index}.area`, v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select area" />
                        </SelectTrigger>
                        <SelectContent>
                          {TAX_PRACTICE_AREAS.map((pa) => (
                            <SelectItem key={pa} value={pa}>
                              {pa}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Win Rate (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        {...form.register(`caseOutcomes.${index}.winRate`, { valueAsNumber: true })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Cases Handled</Label>
                      <Input
                        type="number"
                        min="0"
                        {...form.register(`caseOutcomes.${index}.casesHandled`, { valueAsNumber: true })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Avg Settlement (NGN)</Label>
                      <Input
                        type="number"
                        min="0"
                        {...form.register(`caseOutcomes.${index}.averageSettlement`, { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeCaseOutcome(index)}
                    className="mt-3"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </Card>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => appendCaseOutcome({ area: "", winRate: 0, casesHandled: 0 })}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Case Outcome
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Consultation Fee (NGN) *</Label>
                  <Input
                    type="number"
                    {...form.register("consultationFeeNGN", { valueAsNumber: true })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Hourly Rate (NGN)</Label>
                  <Input
                    type="number"
                    {...form.register("hourlyRateNGN", { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2 rounded-md border p-3">
                  <Checkbox
                    checked={form.watch("fairPricingPledge")}
                    onCheckedChange={(v) => form.setValue("fairPricingPledge", Boolean(v))}
                  />
                  <Label>Fair Pricing Pledge</Label>
                </div>
                <div className="flex items-center gap-2 rounded-md border p-3">
                  <Checkbox
                    checked={form.watch("proBono")}
                    onCheckedChange={(v) => form.setValue("proBono", Boolean(v))}
                  />
                  <Label>Pro Bono Available</Label>
                </div>
                <div className="flex items-center gap-2 rounded-md border p-3">
                  <Checkbox
                    checked={form.watch("emergencyAvailable")}
                    onCheckedChange={(v) => form.setValue("emergencyAvailable", Boolean(v))}
                  />
                  <Label>Emergency Services Available</Label>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Response SLA (hours)</Label>
                  <Input
                    type="number"
                    {...form.register("responseSlaHours", { valueAsNumber: true })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Availability Notes</Label>
                  <Input
                    placeholder="e.g., 'Available weekdays 9am-5pm'"
                    {...form.register("availabilityNotes")}
                  />
                </div>
              </div>

              <div>
                <Label>Booking Modes</Label>
                <div className="flex gap-4 mt-2">
                  {(["Call", "Video", "In-person"] as const).map((mode) => (
                    <div key={mode} className="flex items-center gap-2">
                      <Checkbox
                        checked={form.watch("bookingModes")?.includes(mode)}
                        onCheckedChange={(checked) => {
                          const current = form.watch("bookingModes") || [];
                          if (checked) {
                            form.setValue("bookingModes", [...current, mode]);
                          } else {
                            form.setValue(
                              "bookingModes",
                              current.filter((m) => m !== mode)
                            );
                          }
                        }}
                      />
                      <Label>{mode}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Document Review Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 rounded-md border p-3">
                <Checkbox
                  checked={form.watch("documentReviewEnabled")}
                  onCheckedChange={(v) => form.setValue("documentReviewEnabled", Boolean(v))}
                />
                <Label>Enable Document Review Marketplace</Label>
              </div>

              {form.watch("documentReviewEnabled") && (
                <div className="space-y-3 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-3">
                    Set fixed prices for document review services
                  </p>
                  <div className="grid gap-3">
                    {["Contract Review", "Will Review", "Employment Agreement", "NDA Review", "Tax Document Review"].map((docType) => (
                      <div key={docType} className="flex items-center gap-3">
                        <Label className="w-48">{docType}</Label>
                        <Input
                          type="number"
                          placeholder="Price in NGN"
                          value={form.watch(`documentReviewPricing.${docType}`) || ""}
                          onChange={(e) => {
                            const pricing = form.watch("documentReviewPricing") || {};
                            form.setValue("documentReviewPricing", {
                              ...pricing,
                              [docType]: e.target.value ? Number(e.target.value) : undefined,
                            });
                          }}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Firm & Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Firm Name</Label>
                  <Input {...form.register("firmName")} />
                </div>
                <div className="grid gap-2">
                  <Label>Firm Address</Label>
                  <Input {...form.register("firmAddress")} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label>City</Label>
                  <Input {...form.register("city")} />
                </div>
                <div className="grid gap-2">
                  <Label>State</Label>
                  <Input {...form.register("state")} />
                </div>
                <div className="grid gap-2">
                  <Label>Country</Label>
                  <Input {...form.register("country")} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verification & Claim</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 rounded-md border p-3">
                <Checkbox
                  checked={form.watch("verified")}
                  onCheckedChange={(v) => form.setValue("verified", Boolean(v))}
                />
                <Label>Verified by NBA</Label>
              </div>

              <div>
                <Label>Claim Token</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={claimToken || "Not generated"}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGenerateClaimToken}
                  >
                    Generate Token
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Share this token with the lawyer to claim their profile at /lawyer/claim
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/lawyers")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}




