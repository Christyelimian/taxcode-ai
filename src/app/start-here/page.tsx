import { getBuilderContent } from '@/lib/builder-server';
import { BuilderWrapper } from '@/components/builder/BuilderWrapper';
import { BuilderContent } from '@/components/builder/BuilderContent';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { defaultPathways, defaultAboutSection } from './default-content';

export const metadata = {
  title: 'Start Here | Tax Code',
  description: 'Know your rights and obligations in the Nigerian tax system—start here.',
};

// Default page component (fallback)
function DefaultStartHerePage() {
  return (
    <div className="bg-background">
      <section className="border-b bg-primary/5">
        <div className="container mx-auto px-4 py-16">
          <Badge variant="secondary" className="mb-4">
            Start Here
          </Badge>
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight">
            Know your rights and obligations
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            Tax Code explains how tax law works in practice—from assessment to enforcement and dispute
            resolution. Use the pathways below to find the most relevant starting point for your role.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/focus-areas">Explore focus areas</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/insights">Go to insights hub</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {defaultPathways.map((p) => (
            <Card key={p.title} className="h-full">
              <CardHeader>
                <CardTitle className="text-xl">{p.title}</CardTitle>
                <CardDescription>{p.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {p.links.map((l) => (
                  <div key={l.href}>
                    <Link href={l.href} className="text-primary hover:underline">
                      {l.label}
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-12" />

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl">{defaultAboutSection.title}</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div dangerouslySetInnerHTML={{ __html: defaultAboutSection.content }} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default async function StartHerePage() {
  // Try to fetch Builder.io content first
  const builderContent = await getBuilderContent('page', {
    url: '/start-here',
    noTargeting: true,
  });

  // If Builder.io content exists, use it; otherwise use default
  if (builderContent) {
    return (
      <BuilderWrapper>
        <div className="bg-background">
          <BuilderContent content={builderContent} model="page" />
        </div>
      </BuilderWrapper>
    );
  }

  return <DefaultStartHerePage />;
}




