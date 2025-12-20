import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getNews } from '@/app/actions';

export const metadata = {
  title: 'News, Media & Public Statements | Tax Code',
  description:
    'Press mentions and official statements from Tax Code—neutral, institutional, and process-conscious.',
};

export default async function NewsPage() {
  const newsResult = await getNews(false); // Only published news
  const items = newsResult.success ? newsResult.data : [];
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
          {items.length > 0 ? (
            items.map((n) => (
              <Card key={n.slug}>
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{n.type}</span>
                    <span>•</span>
                    <time dateTime={n.publishedAt || n.createdAt}>
                      {n.publishedAt
                        ? new Date(n.publishedAt).toLocaleDateString()
                        : new Date(n.createdAt).toLocaleDateString()}
                    </time>
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
            ))
          ) : (
            <div className="text-center text-muted-foreground py-12">
              No news items available yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}




