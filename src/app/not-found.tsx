import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-20">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Page not found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            <p>
              The page you’re looking for doesn’t exist or may have moved. Use the links below to
              continue.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/">Go to homepage</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/start-here">Start here</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/focus-areas">Focus areas</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/insights">Insights</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

