import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getFocusAreaBySlug, focusAreas } from '../_focus-areas-data';

export function generateStaticParams() {
  return focusAreas.map((fa) => ({ slug: fa.slug }));
}

export default function FocusAreaDetailPage({ params }: { params: { slug: string } }) {
  const focusArea = getFocusAreaBySlug(params.slug);
  if (!focusArea) notFound();

  return (
    <div className="bg-background">
      <section className="border-b bg-primary/5">
        <div className="container mx-auto px-4 py-14">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href="/focus-areas" className="hover:text-foreground">
              Focus Areas
            </Link>
          </div>

          <Badge variant="secondary" className="mt-6">
            Focus Area
          </Badge>
          <h1 className="mt-4 text-4xl md:text-5xl font-headline font-bold tracking-tight">
            {focusArea.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">{focusArea.summary}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/start-here">Start here</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Contact Tax Code</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="max-w-none">
            <h2 className="text-2xl font-headline font-bold">What we cover</h2>
            <p className="mt-3 text-muted-foreground">
              We focus on how tax law is interpreted and applied in practice—what triggers decisions,
              how powers are exercised, and where rights and safeguards arise.
            </p>

            <Separator className="my-8" />

            <h3 className="text-xl font-headline font-bold">Key pillars</h3>
            <ul className="mt-4 space-y-2 text-muted-foreground list-disc pl-5">
              {focusArea.pillars.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>

            <Separator className="my-8" />

            <h3 className="text-xl font-headline font-bold">Common questions</h3>
            <Accordion type="single" collapsible className="mt-4">
              {focusArea.commonQuestions.map((item, idx) => (
                <AccordionItem key={idx} value={`q-${idx}`}>
                  <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <Separator className="my-8" />

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">How to use this page</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Start with the common questions, then move to relevant insights for deeper reading.
                When you have a specific scenario, use the AI assistant for orientation—then verify
                obligations, timelines, and evidence requirements through the relevant process pages.
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related reading</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <Link href="/insights" className="text-primary hover:underline">
                    Browse Insights & Education Hub
                  </Link>
                  <p className="text-muted-foreground">
                    Structured explainers (not a news blog) with categories, tags, and downloads.
                  </p>
                </div>
                <div>
                  <Link href="/news" className="text-primary hover:underline">
                    News, Media & Public Statements
                  </Link>
                  <p className="text-muted-foreground">
                    Official statements and commentary on major developments.
                  </p>
                </div>
                <div>
                  <Link href="/dashboard/assistant" className="text-primary hover:underline">
                    Ask the Tax Assistant
                  </Link>
                  <p className="text-muted-foreground">
                    Get a fast orientation, then confirm details against published guidance.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg">Engage with Tax Code</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  We support public education, policy dialogue, and advisory engagements grounded in
                  lawful process and credible reasoning.
                </p>
                <Button asChild className="w-full">
                  <Link href="/contact">Make an enquiry</Link>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  );
}

