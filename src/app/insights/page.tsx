import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export const metadata = {
  title: 'Insights & Education Hub | Tax Code',
  description:
    'Structured tax explainers focused on law, process, and justice—designed for clarity, not news.',
};

type InsightStub = {
  title: string;
  slug: string;
  category: string;
  publishedAt: string;
  summary: string;
  tags: string[];
};

// Placeholder content (to be replaced with CMS-backed insights)
const featured: InsightStub[] = [
  {
    title: 'How tax assessments work in practice: notices, timelines, and responses',
    slug: 'how-tax-assessments-work',
    category: 'Tax Process & Administration',
    publishedAt: '2025-12-18',
    summary:
      'A process-first guide to how assessments are raised, what validity looks like, and how to respond clearly and lawfully.',
    tags: ['assessment', 'process', 'notices'],
  },
  {
    title: 'Taxpayer rights and administrative discretion: what the law allows (and limits)',
    slug: 'taxpayer-rights-and-discretion',
    category: 'Taxpayer Rights & State Authority',
    publishedAt: '2025-12-18',
    summary:
      'Understanding due process, fairness, and the lawful limits of power—without turning tax into a confrontation.',
    tags: ['rights', 'authority', 'due process'],
  },
  {
    title: 'Dispute prevention checklist for SMEs: evidence, records, and early engagement',
    slug: 'dispute-prevention-checklist-smes',
    category: 'Dispute Prevention & Resolution',
    publishedAt: '2025-12-18',
    summary:
      'Practical steps that reduce dispute risk and make your position stronger if disagreements arise.',
    tags: ['SME', 'disputes', 'documentation'],
  },
];

const categories = [
  'Taxpayer Rights & State Authority',
  'Tax Process & Administration',
  'Dispute Prevention & Resolution',
  'Tax Adjudication Insights',
  'Tax Policy & Governance',
];

export default function InsightsPage() {
  return (
    <div className="bg-background">
      <section className="border-b bg-primary/5">
        <div className="container mx-auto px-4 py-16">
          <Badge variant="secondary" className="mb-4">
            Insights & Education Hub
          </Badge>
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight">Insights</h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            This is not a news blog. Insights are structured explainers designed to help readers
            understand tax through law, process, and justice—with clear headings, dates, categories,
            and downloadable resources where relevant.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/start-here">Start here</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/focus-areas">Explore focus areas</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="text-2xl font-headline font-bold">Featured</h2>
            <div className="mt-6 grid gap-6">
              {featured.map((i) => (
                <Card key={i.slug} className="h-full">
                  <CardHeader>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{i.category}</span>
                      <span>•</span>
                      <time dateTime={i.publishedAt}>{i.publishedAt}</time>
                    </div>
                    <CardTitle className="text-xl">
                      <Link href={`/insights/${i.slug}`} className="hover:underline">
                        {i.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>{i.summary}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between gap-4">
                    <div className="text-xs text-muted-foreground">
                      {i.tags.map((t) => (
                        <span key={t} className="mr-2">
                          #{t}
                        </span>
                      ))}
                    </div>
                    <Button asChild variant="secondary">
                      <Link href={`/insights/${i.slug}`}>Read</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Browse by category</CardTitle>
                <CardDescription>Quick access without overwhelm.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {categories.map((c) => (
                  <div key={c}>
                    <span className="text-muted-foreground">• </span>
                    <Link href="/insights" className="text-primary hover:underline">
                      {c}
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg">Need clarity on a specific issue?</CardTitle>
                <CardDescription>Use the assistant for orientation, then verify.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Ask your question in plain language. We’ll point you to the relevant process and
                  explain what typically matters.
                </p>
                <Button asChild className="w-full">
                  <Link href="/dashboard/assistant">Ask the Tax Assistant</Link>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>

        <Separator className="my-16" />

        <div className="text-sm text-muted-foreground">
          This section will be connected to the editorial CMS next (categories, tags, PDF downloads,
          and search).
        </div>
      </section>
    </div>
  );
}


