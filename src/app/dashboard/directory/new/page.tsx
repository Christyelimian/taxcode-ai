"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { ArrowLeft, LoaderCircle, PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  firm: z.string().optional(),
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  photoInitials: z.string().length(2, { message: "Photo initials must be exactly 2 characters." }),
  locations: z.array(z.string()).min(1, { message: "At least one location is required." }),
  languages: z.array(z.string()).min(1, { message: "At least one language is required." }),
  specialties: z.array(z.string()).min(1, { message: "At least one specialty is required." }),
  industries: z.array(z.string()).min(1, { message: "At least one industry is required." }),
  yearsExperience: z.number().min(0).max(50),
  verifiedStatus: z.enum(["Verified", "In review"]),
  verifiedLastCheck: z.string(),
  verifiedScope: z.array(z.string()),
  consultationFeeNGN: z.number().min(0),
  hourlyRateNGN: z.number().optional(),
  fairPricingPledge: z.boolean(),
  proBono: z.boolean(),
  lowCostSlotsPerMonth: z.number().optional(),
  nextSlotLabel: z.string().min(1),
  responseSlaHours: z.number().min(1),
  bookingModes: z.array(z.enum(["Call", "Video", "In-person"])).min(1),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().min(0),
  verifiedReviewsOnly: z.boolean(),
  complaintResolutionSupported: z.boolean(),
  mediationSupported: z.boolean(),
  badges: z.array(z.enum(["Community Champion", "Featured", "Pro Bono", "Fast Response"])),
  successStories: z.array(
    z.object({
      title: z.string().min(1),
      outcome: z.string().min(1),
      tags: z.array(z.string()),
    })
  ),
  highlights: z.array(z.string()).min(1),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewDirectoryProfessionalPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      firm: "",
      title: "",
      photoInitials: "",
      locations: [""],
      languages: [""],
      specialties: [""],
      industries: [""],
      yearsExperience: 0,
      verifiedStatus: "In review",
      verifiedLastCheck: new Date().toISOString().split("T")[0],
      verifiedScope: ["Identity"],
      consultationFeeNGN: 0,
      hourlyRateNGN: undefined,
      fairPricingPledge: false,
      proBono: false,
      lowCostSlotsPerMonth: undefined,
      nextSlotLabel: "",
      responseSlaHours: 24,
      bookingModes: ["Call"],
      rating: 0,
      reviewCount: 0,
      verifiedReviewsOnly: true,
      complaintResolutionSupported: false,
      mediationSupported: false,
      badges: [],
      successStories: [],
      highlights: [""],
    },
  });

  const {
    fields: locationFields,
    append: appendLocation,
    remove: removeLocation,
  } = useFieldArray({ control: form.control, name: "locations" });
  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({ control: form.control, name: "languages" });
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
    fields: storyFields,
    append: appendStory,
    remove: removeStory,
  } = useFieldArray({ control: form.control, name: "successStories" });
  const {
    fields: highlightFields,
    append: appendHighlight,
    remove: removeHighlight,
  } = useFieldArray({ control: form.control, name: "highlights" });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    // TODO: Connect to backend action
    console.log("Form values:", values);
    
    toast({
      title: "Professional Created",
      description: "The new professional has been added to the directory (prototype - not saved to backend yet).",
    });
    
    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push("/dashboard/directory");
    setIsLoading(false);
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

        <Card>
          <CardHeader>
            <CardTitle>Add New Professional</CardTitle>
            <CardDescription>Add a new tax professional to the directory.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Adebayo Okonkwo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="photoInitials"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Photo Initials (2 chars) *</FormLabel>
                        <FormControl>
                          <Input placeholder="AO" maxLength={2} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Firm (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Okonkwo & Partners" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professional Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Tax Counsel (Disputes & Appeals)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="yearsExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="50"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Locations *</FormLabel>
                  <FormDescription>Where does this professional practice?</FormDescription>
                  {locationFields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`locations.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 mb-2">
                          <FormControl>
                            <Input placeholder="Lagos" {...field} />
                          </FormControl>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removeLocation(index)}
                            disabled={locationFields.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </FormItem>
                      )}
                    />
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => appendLocation("")}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Location
                  </Button>
                </div>

                <div>
                  <FormLabel>Languages *</FormLabel>
                  {languageFields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`languages.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 mb-2">
                          <FormControl>
                            <Input placeholder="English" {...field} />
                          </FormControl>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removeLanguage(index)}
                            disabled={languageFields.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </FormItem>
                      )}
                    />
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => appendLanguage("")}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Language
                  </Button>
                </div>

                <div>
                  <FormLabel>Specialties *</FormLabel>
                  {specialtyFields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`specialties.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 mb-2">
                          <FormControl>
                            <Input placeholder="Tax disputes" {...field} />
                          </FormControl>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removeSpecialty(index)}
                            disabled={specialtyFields.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </FormItem>
                      )}
                    />
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => appendSpecialty("")}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Specialty
                  </Button>
                </div>

                <div>
                  <FormLabel>Industries *</FormLabel>
                  {industryFields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`industries.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 mb-2">
                          <FormControl>
                            <Input placeholder="Fintech" {...field} />
                          </FormControl>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removeIndustry(index)}
                            disabled={industryFields.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </FormItem>
                      )}
                    />
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => appendIndustry("")}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Industry
                  </Button>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="consultationFeeNGN"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Consultation Fee (NGN) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hourlyRateNGN"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hourly Rate (NGN) - Optional</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fairPricingPledge"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 rounded-md border p-3">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>Fair Pricing Pledge</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="proBono"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 rounded-md border p-3">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>Pro Bono Available</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="nextSlotLabel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Next Available Slot *</FormLabel>
                        <FormControl>
                          <Input placeholder="Tomorrow, 2:00 PM" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="responseSlaHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Response SLA (hours) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="bookingModes"
                  render={() => (
                    <FormItem>
                      <FormLabel>Booking Modes *</FormLabel>
                      <div className="flex gap-4">
                        {(["Call", "Video", "In-person"] as const).map((mode) => (
                          <FormField
                            key={mode}
                            control={form.control}
                            name="bookingModes"
                            render={({ field }) => (
                              <FormItem className="flex items-center gap-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(mode)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      if (checked) {
                                        field.onChange([...current, mode]);
                                      } else {
                                        field.onChange(current.filter((v) => v !== mode));
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel>{mode}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="verifiedStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification Status *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Verified">Verified</SelectItem>
                            <SelectItem value="In review">In review</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating (0-5) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="reviewCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review Count *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Highlights *</FormLabel>
                  {highlightFields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`highlights.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 mb-2">
                          <FormControl>
                            <Textarea placeholder="Plain-language strategy memos..." {...field} />
                          </FormControl>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removeHighlight(index)}
                            disabled={highlightFields.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </FormItem>
                      )}
                    />
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => appendHighlight("")}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Highlight
                  </Button>
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => router.push("/dashboard/directory")}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Professional"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
