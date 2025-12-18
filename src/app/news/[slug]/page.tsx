import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type NewsDoc = {
  slug: string;
  type: 'Press mention' | 'Public statement' | 'Commentary';
  title: string;
  publishedAt: string;
  summary: string;
  body: string[];
  externalUrl?: string;
};

const docs: NewsDoc[] = [
  {
    slug: 'public-statement-template',
    type: 'Public statement',
    title: 'Public statement: approach to major tax developments (template)',
    publishedAt: '2025-12-18',
    summary:
      'A template for Tax Code statements: neutral tone, process clarity, rights-conscious framing, and practical implications.',
    body: [
      'Tax Code is a public-interest platform focused on tax understanding beyond rates and revenue.',
      'Our public statements emphasize lawful process, clarity, fairness, and institutional credibility—supporting reforms through trust and accountability.',
      'This page will be replaced with CMS-backed statements, with clear dates, categories, and citations where appropriate.',
    ],
  },
  {
    slug: 'press-mention-template',
    type: 'Press mention',
    title: 'Press mention: Tax Code featured in policy dialogue (template)',
    publishedAt: '2025-12-18',
    summary:
      'A template for press mentions: link, excerpt, and institutional context—kept clean and verifiable.',
    body: [
      'Press mentions will be listed here with a link to the original source and a short excerpt for context.',
      'We keep this section factual and time-bound, separate from the Insights hub.',
    ],
    externalUrl: 'https://example.com',
  },
];

function getDoc(slug: string) {
  return docs.find((d) => d.slug === slug);
}

export function generateStaticParams() {
  return docs.map((d) => ({ slug: d.slug }));
}

export default function NewsDetailPage({ params }: { params: { slug: string } }) {
  const doc = getDoc(params.slug);
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
            <Link href="/news" className="hover:text-foreground">
              News
            </Link>
          </div>

          <Badge variant="secondary" className="mt-6">
            {doc.type}
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
              <Link href="/news">Back to news</Link>
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
                <CardTitle className="text-lg">Source</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                {doc.externalUrl ? (
                  <a
                    href={doc.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View original source
                  </a>
                ) : (
                  <div>No external link provided for this item.</div>
                )}
                <Separator />
                <Link href="/insights" className="text-primary hover:underline">
                  Go to Insights hub
                </Link>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  );
}

