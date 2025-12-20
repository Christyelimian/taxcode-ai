"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LoaderCircle, Save, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { getConsultantById, updateConsultant, type TeamMember } from "@/app/actions";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const consultantSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email(),
  bio: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
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
  availabilityNotes: z.string().optional(),
});

type ConsultantFormValues = z.infer<typeof consultantSchema>;

export default function EditConsultantProfilePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [consultantId, setConsultantId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/consultant/me");
        const data = await res.json();
        
        if (data.success && data.data?.id) {
          setConsultantId(data.data.id);
        } else {
          router.push("/consultant/claim");
          return;
        }
      } catch (error) {
        router.push("/consultant/claim");
      }
    }
    load();
  }, [router]);

  const form = useForm<ConsultantFormValues>({
    resolver: zodResolver(consultantSchema),
    defaultValues: {
      phone: "",
      email: "",
      bio: "",
      website: "",
      linkedin: "",
      twitter: "",
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
      availabilityNotes: "",
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
    if (!consultantId) return;

    async function load() {
      setIsFetching(true);
      const result = await getConsultantById(consultantId);
      if (result.success && result.data) {
        const data = result.data;
        form.reset({
          phone: data.phone || "",
          email: data.email || "",
          bio: data.bio || "",
          website: data.website || "",
          linkedin: data.linkedin || "",
          twitter: data.twitter || "",
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
          availabilityNotes: data.availabilityNotes || "",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to load profile",
        });
      }
      setIsFetching(false);
    }
    load();
  }, [consultantId, form, toast]);

  async function onSubmit(values: ConsultantFormValues) {
    if (!consultantId) return;

    setIsLoading(true);
    const result = await updateConsultant(consultantId, values);
    if (result.success) {
      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully.",
      });
      router.push("/dashboard/consultant");
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Failed to update profile",
      });
    }
    setIsLoading(false);
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
            <Link href="/dashboard/consultant">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Update your contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Email *</Label>
                  <Input type="email" {...form.register("email")} />
                  <p className="text-xs text-muted-foreground">
                    This email will receive booking notifications
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label>Phone</Label>
                  <Input type="tel" placeholder="+234..." {...form.register("phone")} />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Bio</Label>
                <Textarea rows={4} placeholder="Tell clients about yourself..." {...form.register("bio")} />
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
              <CardTitle>Professional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Years of Experience</Label>
                <Input
                  type="number"
                  {...form.register("yearsExperience", { valueAsNumber: true })}
                />
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

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/consultant")}>
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


