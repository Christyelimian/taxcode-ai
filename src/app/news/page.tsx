import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'News, Media & Public Statements | Tax Code',
  description:
    'Press mentions and official statements from Tax Code—neutral, institutional, and process-conscious.',
};

type NewsStub = {
  slug: string;
  type: 'Press mention' | 'Public statement' | 'Commentary';
  title: string;
  publishedAt: string;
  summary: string;
};

// Placeholder content (to be replaced with CMS-backed items)
const items: NewsStub[] = [
  {
    slug: 'public-statement-template',
    type: 'Public statement',
    title: 'Public statement: approach to major tax developments (template)',
    publishedAt: '2025-12-18',
    summary:
      'Our statements focus on clarity, lawful process, and balanced analysis—supporting reforms through accountability and trust.',
  },
  {
    slug: 'press-mention-template',
    type: 'Press mention',
    title: 'Press mention: Tax Code featured in policy dialogue (template)',
    publishedAt: '2025-12-18',
    summary:
      'A place to list press mentions with links, excerpts, and context for readers and partners.',
  },
];

export default function NewsPage() {
  return (
    <div className="bg-background">
      <section className="border-b bg-primary/5">
        <div className="container mx-auto px-4 py-16">
          <Badge variant="secondary" className="mb-4">
            News, Media & Public Statements
          </Badge>
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight">
            News & Public Statements
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            This space contains press mentions and official statements from Tax Code. It is distinct
            from the Insights hub: items here are time-bound and public-facing.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/insights">Go to insights</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Media enquiries</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6">
          {items.map((n) => (
            <Card key={n.slug}>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{n.type}</span>
                  <span>•</span>
                  <time dateTime={n.publishedAt}>{n.publishedAt}</time>
                </div>
                <CardTitle className="text-xl">
                  <Link href={`/news/${n.slug}`} className="hover:underline">
                    {n.title}
                  </Link>
                </CardTitle>
                <CardDescription>{n.summary}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end">
                <Button asChild variant="secondary">
                  <Link href={`/news/${n.slug}`}>Read</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

