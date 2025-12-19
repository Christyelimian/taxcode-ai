import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, FileText, Landmark } from "lucide-react";

export const metadata = {
  title: "Tax Types Library | TaxCode",
  description: "Browse Nigerian tax types with practical explanations, examples, and next-step tools.",
};

const taxTypes = [
  { slug: "personal-income-tax", title: "Personal Income Tax (PIT)", description: "PAYE, reliefs, and filing basics." },
  { slug: "companies-income-tax", title: "Companies Income Tax (CIT)", description: "Rates, thresholds, and compliance." },
  { slug: "value-added-tax", title: "Value Added Tax (VAT)", description: "Registration, filing, and recovery." },
  { slug: "withholding-tax", title: "Withholding Tax (WHT)", description: "Common rates and remittance workflow." },
  { slug: "capital-gains-tax", title: "Capital Gains Tax (CGT)", description: "Disposals, exemptions, and computation." },
];

export default function TaxTypesIndexPage() {
  return (
    <div className="bg-background">
      <section className="border-b bg-primary/5">
        <div className="container mx-auto px-4 py-16">
          <Badge variant="secondary" className="mb-4">
            Tax Types Library
          </Badge>
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight">Browse Nigerian tax types</h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            Plain-English explanations, who it applies to, filing requirements, and examples—linked to tools when you’re ready.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/start-here">
                Start with your role <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/calculator">
                Try the calculator <Calculator className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {taxTypes.map((t) => (
            <Link key={t.slug} href={`/tax-types/${t.slug}`} className="block">
              <Card className="h-full transition hover:shadow-lg hover:-translate-y-0.5">
                <CardHeader>
                  <CardTitle className="text-lg">{t.title}</CardTitle>
                  <CardDescription>{t.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Guide + examples
                  </span>
                  <span className="inline-flex items-center gap-2 text-primary">
                    Open <ArrowRight className="h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="mt-10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Landmark className="h-5 w-5 text-primary" />
              Want the “tool-first” path?
            </CardTitle>
            <CardDescription>Use the platform tools and learn as you go.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/dashboard/assistant">Ask AI</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/tools">Explore tools</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}


