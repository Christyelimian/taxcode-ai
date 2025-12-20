"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LoaderCircle, PlusCircle, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getConsultantById, updateConsultant, generateClaimToken, type TeamMember } from "@/app/actions";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const consultantSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  title: z.string().min(2),
  firmName: z.string().optional(),
  firmAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  licenseNo: z.string().optional(),
  memberNo: z.string().optional(),
  verified: z.boolean(),
  specialties: z.array(z.string()),
  industries: z.array(z.string()),
  yearsExperience: z.number().min(0),
  languages: z.array(z.string()),
  consultationFeeNGN: z.number().min(0),
  hourlyRateNGN: z.number().optional(),
  fairPricingPledge: z.boolean(),
  proBono: z.boolean(),
  lowCostSlotsPerMonth: z.number().optional(),
  bookingModes: z.array(z.enum(["Call", "Video", "In-person"])),
  responseSlaHours: z.number().min(1),
  bio: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  availabilityNotes: z.string().optional(),
  paymentStatus: z.enum(["free", "basic", "premium", "enterprise"]).optional(),
});

type ConsultantFormValues = z.infer<typeof consultantSchema>;

export default function EditConsultantClient({ consultantId }: { consultantId: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [claimToken, setClaimToken] = useState<string | null>(null);

  const form = useForm<ConsultantFormValues>({
    resolver: zodResolver(consultantSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      title: "",
      firmName: "",
      firmAddress: "",
      city: "",
      state: "",
      country: "Nigeria",
      licenseNo: "",
      memberNo: "",
      verified: false,
      specialties: [],
      industries: [],
      yearsExperience: 0,
      languages: ["English"],
      consultationFeeNGN: 25000,
      hourlyRateNGN: undefined,
      fairPricingPledge: true,
      proBono: false,
      lowCostSlotsPerMonth: undefined,
      bookingModes: ["Call", "Video"],
      responseSlaHours: 24,
      bio: "",
      website: "",
      linkedin: "",
      twitter: "",
      availabilityNotes: "",
      paymentStatus: "free",
    },
  });

  const {
    fields: specialtyFields,
    append: appendSpecialty,
    remove: removeSpecialty,
  } = useFieldArray({ control: form.control, name: "specialties" });
  const {
    fields: industryFields,
    append: appendIndustry,
    remove: removeIndustry,
  } = useFieldArray({ control: form.control, name: "industries" });
  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({ control: form.control, name: "languages" });

  useEffect(() => {
    async function load() {
      setIsFetching(true);
      const result = await getConsultantById(consultantId);
      if (result.success && result.data) {
        const data = result.data;
        form.reset({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          title: data.title || "",
          firmName: data.firmName || "",
          firmAddress: data.firmAddress || "",
          city: data.city || "",
          state: data.state || "",
          country: data.country || "Nigeria",
          licenseNo: data.licenseNo || "",
          memberNo: data.memberNo || "",
          verified: data.verified ?? false,
          specialties: data.specialties || [],
          industries: data.industries || [],
          yearsExperience: data.yearsExperience || 0,
          languages: data.languages || ["English"],
          consultationFeeNGN: data.consultationFeeNGN || 25000,
          hourlyRateNGN: data.hourlyRateNGN,
          fairPricingPledge: data.fairPricingPledge ?? true,
          proBono: data.proBono ?? false,
          lowCostSlotsPerMonth: data.lowCostSlotsPerMonth,
          bookingModes: (data.bookingModes || ["Call", "Video"]) as ("Call" | "Video" | "In-person")[],
          responseSlaHours: data.responseSlaHours || 24,
          bio: data.bio || "",
          website: data.website || "",
          linkedin: data.linkedin || "",
          twitter: data.twitter || "",
          availabilityNotes: data.availabilityNotes || "",
          paymentStatus: (data.paymentStatus as "free" | "basic" | "premium" | "enterprise") || "free",
        });
        setClaimToken(data.claimToken || null);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to load consultant",
        });
        router.push("/dashboard/directory");
      }
      setIsFetching(false);
    }
    load();
  }, [consultantId, form, router, toast]);

  async function onSubmit(values: ConsultantFormValues) {
    setIsLoading(true);
    const result = await updateConsultant(consultantId, values);
    if (result.success) {
      toast({
        title: "Consultant updated",
        description: "Changes have been saved successfully.",
      });
      router.push("/dashboard/directory");
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Failed to update consultant",
      });
    }
    setIsLoading(false);
  }

  async function handleGenerateClaimToken() {
    const result = await generateClaimToken(consultantId);
    if (result.success && result.data) {
      setClaimToken(result.data.token);
      toast({
        title: "Claim token generated",
        description: "Share this token with the consultant to claim their profile.",
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
            <Link href="/dashboard/directory">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Directory
            </Link>
          </Button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update consultant's basic details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Full Name *</Label>
                  <Input {...form.register("name")} />
                  {form.formState.errors.name && (
                    <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label>Email *</Label>
                  <Input type="email" {...form.register("email")} />
                  <p className="text-xs text-muted-foreground">
                    This email will receive booking notifications
                  </p>
                  {form.formState.errors.email && (
                    <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                  )}
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
              <CardTitle>Firm & Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Firm Name</Label>
                  <Input {...form.register("firmName")} />
                </div>
                <div className="grid gap-2">
                  <Label>License Number</Label>
                  <Input {...form.register("licenseNo")} />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Firm Address</Label>
                <Input {...form.register("firmAddress")} />
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
              <CardTitle>Professional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Years of Experience</Label>
                  <Input
                    type="number"
                    {...form.register("yearsExperience", { valueAsNumber: true })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Payment Status</Label>
                  <Select
                    value={form.watch("paymentStatus") || "free"}
                    onValueChange={(v) => form.setValue("paymentStatus", v as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Specialties</Label>
                {specialtyFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 mt-2">
                    <Input {...form.register(`specialties.${index}`)} />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeSpecialty(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendSpecialty("")}
                  className="mt-2"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Specialty
                </Button>
              </div>

              <div>
                <Label>Industries</Label>
                {industryFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 mt-2">
                    <Input {...form.register(`industries.${index}`)} />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeIndustry(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendIndustry("")}
                  className="mt-2"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Industry
                </Button>
              </div>

              <div>
                <Label>Languages</Label>
                {languageFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 mt-2">
                    <Input {...form.register(`languages.${index}`)} />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeLanguage(index)}
                      disabled={languageFields.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendLanguage("")}
                  className="mt-2"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Language
                </Button>
              </div>
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
              </div>

              {form.watch("proBono") && (
                <div className="grid gap-2">
                  <Label>Low-cost Slots per Month</Label>
                  <Input
                    type="number"
                    {...form.register("lowCostSlotsPerMonth", { valueAsNumber: true })}
                  />
                </div>
              )}

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
              <CardTitle>Verification & Claim</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 rounded-md border p-3">
                <Checkbox
                  checked={form.watch("verified")}
                  onCheckedChange={(v) => form.setValue("verified", Boolean(v))}
                />
                <Label>Verified</Label>
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
                  Share this token with the consultant to claim their profile at /consultant/claim
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/directory")}>
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


