import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getInsightBySlug } from '@/app/actions';

export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getInsightBySlug(slug);
  
  if (!result.success || !result.data) {
    notFound();
  }

  const doc = result.data;
  
  // Split body into paragraphs (assuming it's stored as markdown/text)
  const bodyParagraphs = doc.body.split('\n\n').filter(Boolean);
  
  // Parse downloads if they exist
  const downloads = doc.downloads && typeof doc.downloads === 'object' && Array.isArray(doc.downloads)
    ? doc.downloads
    : [];

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
            <time dateTime={doc.publishedAt || doc.createdAt}>
              Published {doc.publishedAt ? new Date(doc.publishedAt).toLocaleDateString() : new Date(doc.createdAt).toLocaleDateString()}
            </time>
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
            {bodyParagraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
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




