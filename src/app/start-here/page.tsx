import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export const metadata = {
  title: 'Start Here | Tax Code',
  description: 'Know your rights and obligations in the Nigerian tax system—start here.',
};

const pathways = [
  {
    title: 'SMEs & corporate taxpayers',
    description:
      'Understand what compliance looks like in practice—records, filings, assessments, audits, and how to reduce dispute risk.',
    links: [
      { label: 'Tax Process & Administration', href: '/focus-areas/tax-process-administration' },
      { label: 'Dispute Prevention & Resolution', href: '/focus-areas/dispute-prevention-resolution' },
      { label: 'Ask the assistant', href: '/dashboard/assistant' },
    ],
  },
  {
    title: 'Business owners & finance leads',
    description:
      'Get clarity on obligations, timelines, documentation, and how to respond to official notices in a calm, evidence-based way.',
    links: [
      { label: 'Taxpayer Rights & State Authority', href: '/focus-areas/taxpayer-rights-state-authority' },
      { label: 'Tax Process & Administration', href: '/focus-areas/tax-process-administration' },
      { label: 'Insights hub', href: '/insights' },
    ],
  },
  {
    title: 'In-house legal & compliance teams',
    description:
      'Focus on statutory powers, procedural validity, evidence, and practical dispute strategy—before escalation becomes inevitable.',
    links: [
      { label: 'Tax Adjudication Insights', href: '/focus-areas/tax-adjudication-insights' },
      { label: 'Dispute Prevention & Resolution', href: '/focus-areas/dispute-prevention-resolution' },
      { label: 'News & public statements', href: '/news' },
    ],
  },
  {
    title: 'Practitioners, academics & policymakers',
    description:
      'Explore policy intent, governance trade-offs, institutional roles, and how reforms translate into day-to-day administration.',
    links: [
      { label: 'Tax Policy & Governance', href: '/focus-areas/tax-policy-governance' },
      { label: 'Browse focus areas', href: '/focus-areas' },
      { label: 'Contact Tax Code', href: '/contact' },
    ],
  },
];

export default function StartHerePage() {
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
          {pathways.map((p) => (
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
            <CardTitle className="text-xl">What Tax Code is (and is not)</CardTitle>
            <CardDescription>Clear positioning to build trust and credibility.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Tax Code is a public-interest platform advancing tax awareness, advocacy and strategic
              guidance by explaining how tax law actually works in practice.
            </p>
            <p>
              We do not act as an agent of any tax authority and we do not provide commercial tax
              compliance services. Our role is to support lawful implementation of reforms, strengthen
              taxpayer confidence, and encourage voluntary compliance through clarity and accountability.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

