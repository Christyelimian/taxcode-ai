import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getInsights } from '@/app/actions';
import Image from 'next/image';

// Force dynamic rendering to avoid Firestore issues during build
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Insights & Education Hub | Tax Code',
  description:
    'Structured tax explainers focused on law, process, and justice—designed for clarity, not news.',
};

const categories = [
  'Taxpayer Rights & State Authority',
  'Tax Process & Administration',
  'Dispute Prevention & Resolution',
  'Tax Adjudication Insights',
  'Tax Policy & Governance',
];

export default async function InsightsPage() {
  const insightsResult = await getInsights(false); // Only published insights
  const insights = insightsResult.success ? insightsResult.data : [];
  const featured = insights.filter((i) => i.isFeatured).slice(0, 3);
  return (
    <div className="bg-background">
      {/* HERO SECTION */}
      <section className="relative h-[70vh] overflow-hidden">
        <Image
          src="/hero2.jpg"
          alt="Insights & Education Hub"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-8 max-w-6xl">
            <div className="max-w-4xl">
              <Badge variant="secondary" className="mb-6 text-white border-white/30 bg-white/10 backdrop-blur-sm">
                Insights & Education Hub
              </Badge>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                Tax Insights &
                <br />
                <span className="text-white/90">Education</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8 max-w-3xl font-light">
                This is not a news blog. Insights are structured explainers designed to help readers
                understand tax through law, process, and justice—with clear headings, dates, categories,
                and downloadable resources where relevant.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-gray-50 shadow-lg">
                  <Link href="/start-here">Start here</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 backdrop-blur-sm">
                  <Link href="/focus-areas">Explore focus areas</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="text-2xl font-headline font-bold">Featured</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featured.length > 0 ? (
                featured.map((i) => (
                  <Card key={i.slug} className="group h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={i.image || '/hero2.jpg'}
                        alt={i.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="bg-white/90 text-gray-900 border-0 text-xs">
                          {i.category}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">
                          <Link href={`/insights/${i.slug}`} className="hover:underline">
                            {i.title}
                          </Link>
                        </h3>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {i.summary}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {i.tags.slice(0, 2).map((t) => (
                            <span key={t} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              #{t}
                            </span>
                          ))}
                        </div>
                        <time className="text-xs text-gray-500">
                          {i.publishedAt
                            ? new Date(i.publishedAt).toLocaleDateString()
                            : new Date(i.createdAt).toLocaleDateString()}
                        </time>
                      </div>
                      <Button asChild className="w-full mt-4 bg-[#9E1B1F] hover:bg-[#7a1418] text-white">
                        <Link href={`/insights/${i.slug}`}>Read Article</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center text-muted-foreground py-12">
                  <div className="text-4xl mb-4">📚</div>
                  <p className="text-lg">No featured insights yet.</p>
                  <p className="text-sm mt-2">Check back soon for new educational content.</p>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Browse by category</CardTitle>
                <CardDescription>Quick access without overwhelm.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {categories.map((c) => (
                  <div key={c}>
                    <span className="text-muted-foreground">• </span>
                    <Link href="/insights" className="text-primary hover:underline">
                      {c}
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg">Need clarity on a specific issue?</CardTitle>
                <CardDescription>Use the assistant for orientation, then verify.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Ask your question in plain language. We’ll point you to the relevant process and
                  explain what typically matters.
                </p>
                <Button asChild className="w-full">
                  <Link href="/dashboard/assistant">Ask the Tax Assistant</Link>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>

        <Separator className="my-16" />

        {/* ALL INSIGHTS SECTION */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-12">All Insights</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {insights.length > 0 ? (
              insights.map((i) => (
                <Card key={i.slug} className="group h-full overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={i.image || '/hero.jpg'}
                      alt={i.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-black/20 text-white border-0 text-xs backdrop-blur-sm">
                        {i.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2">
                      <Link href={`/insights/${i.slug}`} className="hover:text-[#9E1B1F] transition-colors">
                        {i.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                      {i.summary}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <time>
                        {i.publishedAt
                          ? new Date(i.publishedAt).toLocaleDateString()
                          : new Date(i.createdAt).toLocaleDateString()}
                      </time>
                      <Link href={`/insights/${i.slug}`} className="text-[#9E1B1F] hover:underline font-medium">
                        Read →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-12">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-lg">No insights available yet.</p>
                <p className="text-sm mt-2">Content will be added soon.</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 text-center text-sm text-muted-foreground border-t pt-8">
          <p className="mb-2">This section will be connected to the editorial CMS next (categories, tags, PDF downloads, and search).</p>
          <p>Stay tuned for enhanced filtering and search capabilities.</p>
        </div>
      </section>
    </div>
  );
}




