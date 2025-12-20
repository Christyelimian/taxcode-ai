import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Calculator, MessageCircleQuestion } from "lucide-react";

type TaxType = {
  slug: string;
  title: string;
  summary: string;
  appliesTo: string[];
  whatYouDo: string[];
  examples: string[];
  toolCta?: { label: string; href: string };
};

const TAX_TYPES: TaxType[] = [
  {
    slug: "personal-income-tax",
    title: "Personal Income Tax (PIT)",
    summary: "Personal income tax covers employment income and other taxable income for individuals, including PAYE in many cases.",
    appliesTo: ["Employees (PAYE)", "Self-employed individuals", "Mixed income earners"],
    whatYouDo: ["Determine taxable income", "Apply reliefs/allowances where applicable", "Pay and file returns (where required)"],
    examples: ["PAYE withholding via employer", "Self-assessment for non-PAYE income"],
    toolCta: { label: "Estimate PIT", href: "/dashboard/calculator" },
  },
  {
    slug: "companies-income-tax",
    title: "Companies Income Tax (CIT)",
    summary: "CIT applies to corporate profits and includes compliance around filings, payments, and record keeping.",
    appliesTo: ["Registered companies", "Certain incorporated entities"],
    whatYouDo: ["Maintain proper accounting records", "Compute taxable profits", "File returns and pay within deadlines"],
    examples: ["Small vs large company treatment (where thresholds apply)"],
    toolCta: { label: "Explore company tools", href: "/dashboard/tools" },
  },
  {
    slug: "value-added-tax",
    title: "Value Added Tax (VAT)",
    summary: "VAT is a consumption tax charged on taxable supplies. Businesses may need to register, charge, remit, and claim input VAT where allowed.",
    appliesTo: ["VAT-registered businesses", "Suppliers of taxable goods/services"],
    whatYouDo: ["Determine if registration applies", "Issue VAT invoices where required", "File returns and remit VAT"],
    examples: ["Output VAT vs input VAT recovery"],
    toolCta: { label: "Ask about VAT", href: "/dashboard/assistant" },
  },
  {
    slug: "withholding-tax",
    title: "Withholding Tax (WHT)",
    summary: "WHT is typically deducted at source on certain payments, then remitted, and may serve as a credit against final tax.",
    appliesTo: ["Payors making specified payments", "Recipients subject to withholding rules"],
    whatYouDo: ["Identify payments subject to withholding", "Deduct correct rate", "Remit and keep evidence"],
    examples: ["WHT credits and reconciliation"],
    toolCta: { label: "Explore tools", href: "/dashboard/tools" },
  },
  {
    slug: "capital-gains-tax",
    title: "Capital Gains Tax (CGT)",
    summary: "CGT may apply to gains from disposal of chargeable assets, subject to exemptions and specific rules.",
    appliesTo: ["Individuals and companies disposing assets", "Asset disposals within scope of CGT"],
    whatYouDo: ["Determine whether disposal is chargeable", "Compute gain and apply exemptions", "Declare/pay where required"],
    examples: ["Real estate disposals (depending on rules)"],
    toolCta: { label: "Ask the assistant", href: "/dashboard/assistant" },
  },
];

export function generateStaticParams() {
  return TAX_TYPES.map((t) => ({ slug: t.slug }));
}

export default async function TaxTypePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = TAX_TYPES.find((t) => t.slug === slug);
  if (!item) return notFound();

  return (
    <div className="bg-background">
      <section className="border-b bg-primary/5">
        <div className="container mx-auto px-4 py-14">
          <Badge variant="secondary" className="mb-4">
            Tax Types
          </Badge>
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight">{item.title}</h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">{item.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/tax-types">
                Back to library <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            {item.toolCta ? (
              <Button asChild variant="outline">
                <Link href={item.toolCta.href}>
                  {item.toolCta.label}
                  {item.toolCta.href.includes("calculator") ? (
                    <Calculator className="ml-2 h-4 w-4" />
                  ) : (
                    <MessageCircleQuestion className="ml-2 h-4 w-4" />
                  )}
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Who it applies to</CardTitle>
              <CardDescription>Quick orientation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {item.appliesTo.map((x) => (
                <div key={x} className="rounded-md border bg-background px-3 py-2">
                  {x}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">What you do</CardTitle>
              <CardDescription>The compliance workflow at a glance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {item.whatYouDo.map((x) => (
                <div key={x} className="rounded-md border bg-background px-3 py-2">
                  {x}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Examples</CardTitle>
              <CardDescription>Common real-world scenarios.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {item.examples.map((x) => (
                <div key={x} className="rounded-md border bg-background px-3 py-2">
                  {x}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            This is a Phase B scaffold. We’ll expand with rates, thresholds, and citations as we populate the library.
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/dashboard/assistant">Ask AI about this</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/calculator">Use calculators</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}



