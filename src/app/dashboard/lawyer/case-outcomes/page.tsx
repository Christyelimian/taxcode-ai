"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getLawyerById, updateConsultant, type TeamMember } from "@/app/actions";
import { TrendingUp, Award, PlusCircle, Trash2, LoaderCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const caseOutcomeSchema = z.object({
  caseOutcomes: z.array(z.object({
    area: z.string(),
    winRate: z.number().min(0).max(100),
    casesHandled: z.number().min(0),
    averageSettlement: z.number().optional(),
  })),
});

type CaseOutcomeFormValues = z.infer<typeof caseOutcomeSchema>;

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

export default function CaseOutcomesPage() {
  const { toast } = useToast();
  const [lawyer, setLawyer] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<CaseOutcomeFormValues>({
    resolver: zodResolver(caseOutcomeSchema),
    defaultValues: {
      caseOutcomes: [],
    },
  });

  const {
    fields: caseOutcomeFields,
    append: appendCaseOutcome,
    remove: removeCaseOutcome,
  } = useFieldArray({ control: form.control, name: "caseOutcomes" });

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/lawyer/me");
        const data = await res.json();
        
        if (data.success && data.data) {
          setLawyer(data.data);
          form.reset({
            caseOutcomes: data.data.caseOutcomes || [],
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load profile",
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile",
        });
      }
      setIsLoading(false);
    }
    load();
  }, [form, toast]);

  async function onSubmit(values: CaseOutcomeFormValues) {
    if (!lawyer?.id) return;

    setIsSaving(true);
    const result = await updateConsultant(lawyer.id, {
      caseOutcomes: values.caseOutcomes,
    });
    
    if (result.success) {
      toast({
        title: "Case outcomes updated",
        description: "Your case statistics have been saved.",
      });
      // Reload lawyer data
      const res = await fetch("/api/lawyer/me");
      const data = await res.json();
      if (data.success && data.data) {
        setLawyer(data.data);
      }
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Failed to update case outcomes",
      });
    }
    setIsSaving(false);
  }

  const avgWinRate = lawyer?.caseOutcomes && lawyer.caseOutcomes.length > 0
    ? lawyer.caseOutcomes.reduce((sum, co) => sum + co.winRate, 0) / lawyer.caseOutcomes.length
    : 0;

  const totalCases = lawyer?.caseOutcomes?.reduce((sum, co) => sum + co.casesHandled, 0) || 0;

  if (isLoading) {
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
            <Link href="/dashboard/lawyer">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-headline font-bold">Case Outcome Tracker</h1>
          <p className="text-muted-foreground mt-1">Manage your case statistics and win rates</p>
        </div>

        {/* Summary Stats */}
        {lawyer?.caseOutcomes && lawyer.caseOutcomes.length > 0 && (
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Overall Win Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">{avgWinRate.toFixed(1)}%</div>
                <p className="text-sm text-muted-foreground mt-1">Across all practice areas</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalCases}</div>
                <p className="text-sm text-muted-foreground mt-1">Cases handled</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Practice Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{lawyer.caseOutcomes.length}</div>
                <p className="text-sm text-muted-foreground mt-1">Tracked areas</p>
              </CardContent>
            </Card>
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Case Outcomes by Practice Area</CardTitle>
              <CardDescription>
                Track your win rates and case statistics. This helps clients understand your expertise.
              </CardDescription>
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

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/lawyer">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Case Outcomes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}




