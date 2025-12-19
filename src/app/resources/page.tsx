import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Download, FileText, Search, ClipboardList, BookOpen } from "lucide-react";

export const metadata = {
  title: "Resources Library | TaxCode",
  description: "Downloads, templates, checklists, and explainers to make tax compliance simpler.",
};

const categories = [
  {
    title: "Guides",
    icon: <BookOpen className="h-5 w-5 text-primary" />,
    items: ["2026 reforms overview", "Taxpayer rights primer", "Small business compliance starter"],
  },
  {
    title: "Templates",
    icon: <FileText className="h-5 w-5 text-primary" />,
    items: ["Objection letter (draft)", "Appeal checklist", "Record-keeping template"],
  },
  {
    title: "Checklists",
    icon: <ClipboardList className="h-5 w-5 text-primary" />,
    items: ["VAT readiness", "PAYE/employee compliance", "Year-end close"],
  },
];

export default function ResourcesPage() {
  return (
    <div className="bg-background">
      <section className="border-b bg-primary/5">
        <div className="container mx-auto px-4 py-16">
          <Badge variant="secondary" className="mb-4">
            Resources Library
          </Badge>
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight">
            Downloads, templates & checklists
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            Practical resources you can use immediately. This library will expand as we publish more tools and guides.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-lg">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search resources (coming soon)..." disabled />
            </div>
            <Button asChild variant="outline">
              <Link href="/dashboard/assistant">
                Ask AI to find a template <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14">
        <div className="grid gap-6 lg:grid-cols-3">
          {categories.map((c) => (
            <Card key={c.title} className="h-full">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-primary/10 p-2">{c.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{c.title}</CardTitle>
                    <CardDescription>Starter pack (Phase B scaffold)</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                {c.items.map((x) => (
                  <div key={x} className="flex items-center justify-between rounded-md border bg-background px-3 py-2">
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {x}
                    </span>
                    <span className="inline-flex items-center gap-2 text-xs">
                      <Download className="h-4 w-4" />
                      soon
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Next: connect resources to the Knowledge Base</CardTitle>
            <CardDescription>
              In Phase B+, we’ll power this page from KB categories/tags and enable downloads + search.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/tax-types">Browse tax types</Link>
            </Button>
            <Button asChild>
              <Link href="/reforms-2026">Go to reforms hub</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}


