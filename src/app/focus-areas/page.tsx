import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { focusAreas } from './_focus-areas-data';

export const metadata = {
  title: 'Focus Areas | Tax Code',
  description:
    'Explore Tax Code’s focus areas: taxpayer rights, tax process, dispute resolution, adjudication insights, and tax policy & governance.',
};

export default function FocusAreasPage() {
  return (
    <div className="bg-background">
      <section className="border-b bg-primary/5">
        <div className="container mx-auto px-4 py-16">
          <Badge variant="secondary" className="mb-4">
            What We Do
          </Badge>
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight">
            Focus Areas
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            Tax Code explains taxation beyond figures and deadlines. We examine power, process and
            accountability within the tax system—helping taxpayers, professionals, and institutions
            understand how tax law operates in practice.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/start-here">Start here: Know your rights</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/insights">Browse insights</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {focusAreas.map((fa) => (
            <Card key={fa.slug} className="h-full">
              <CardHeader>
                <CardTitle className="text-xl">{fa.title}</CardTitle>
                <CardDescription>{fa.summary}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                  {fa.pillars.slice(0, 2).map((p) => (
                    <div key={p}>- {p}</div>
                  ))}
                </div>
                <Button asChild variant="secondary">
                  <Link href={`/focus-areas/${fa.slug}`}>Read</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

