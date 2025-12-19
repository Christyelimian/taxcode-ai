import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type InsightDoc = {
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
  summary: string;
  body: string[];
  downloads?: Array<{ label: string; href: string }>;
};

// Placeholder content (until CMS-backed insights are wired)
const docs: InsightDoc[] = [
  {
    slug: 'how-tax-assessments-work',
    title: 'How tax assessments work in practice: notices, timelines, and responses',
    category: 'Tax Process & Administration',
    publishedAt: '2025-12-18',
    summary:
      'A process-first guide to how assessments are raised, what validity looks like, and how to respond clearly and lawfully.',
    body: [
      'Tax assessments are not just numbers—they are decisions made through defined processes. Understanding the steps helps taxpayers respond calmly and lawfully.',
      'This page will be expanded into a structured explainer with headings, timelines, sample notice anatomy, and a practical response checklist.',
    ],
    downloads: [{ label: 'Download: Response checklist (PDF) — coming soon', href: '/insights' }],
  },
  {
    slug: 'taxpayer-rights-and-discretion',
    title: 'Taxpayer rights and administrative discretion: what the law allows (and limits)',
    category: 'Taxpayer Rights & State Authority',
    publishedAt: '2025-12-18',
    summary:
      'Understanding due process, fairness, and the lawful limits of power—without turning tax into a confrontation.',
    body: [
      'Tax powers are statutory. That means authority exists within limits—and procedure matters.',
      'This page will be expanded with “rights & safeguards” summaries, examples of invalid actions, and practical steps for engagement.',
    ],
  },
  {
    slug: 'dispute-prevention-checklist-smes',
    title: 'Dispute prevention checklist for SMEs: evidence, records, and early engagement',
    category: 'Dispute Prevention & Resolution',
    publishedAt: '2025-12-18',
    summary:
      'Practical steps that reduce dispute risk and make your position stronger if disagreements arise.',
    body: [
      'Most disputes become expensive because facts are unclear and records are incomplete. Good documentation is preventive medicine.',
      'This page will be expanded into a step-by-step checklist with templates and sample record sets.',
    ],
  },
];

function getDoc(slug: string) {
  return docs.find((d) => d.slug === slug);
}

export function generateStaticParams() {
  return docs.map((d) => ({ slug: d.slug }));
}

export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();

  return (
    <div className="bg-background">
      <section className="border-b bg-primary/5">
        <div className="container mx-auto px-4 py-14">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href="/insights" className="hover:text-foreground">
              Insights
            </Link>
          </div>

          <Badge variant="secondary" className="mt-6">
            {doc.category}
          </Badge>
          <h1 className="mt-4 text-3xl md:text-5xl font-headline font-bold tracking-tight">
            {doc.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">{doc.summary}</p>
          <div className="mt-3 text-sm text-muted-foreground">
            <time dateTime={doc.publishedAt}>Published {doc.publishedAt}</time>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/insights">Back to insights</Link>
            </Button>
            <Button asChild>
              <Link href="/contact">Contact</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <article className="prose prose-neutral max-w-none">
            {doc.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </article>

          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Downloads</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {doc.downloads?.length ? (
                  doc.downloads.map((d) => (
                    <div key={d.label}>
                      <Link href={d.href} className="text-primary hover:underline">
                        {d.label}
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground">No downloads for this item yet.</div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg">Related focus areas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <Link href="/focus-areas" className="text-primary hover:underline">
                  Explore focus areas
                </Link>
                <Separator />
                <Link href="/dashboard/assistant" className="text-primary hover:underline">
                  Ask the Tax Assistant
                </Link>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  );
}


