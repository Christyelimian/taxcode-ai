import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getNews } from '@/app/actions';
import Image from 'next/image';

// Force dynamic rendering to avoid Firestore issues during build
export const dynamic = 'force-dynamic';

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
      {/* HERO SECTION */}
      <section className="relative h-[70vh] overflow-hidden">
        <Image
          src="/news.jpg"
          alt="News, Media & Public Statements"
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
                News, Media & Public Statements
              </Badge>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                News & Public
                <br />
                <span className="text-white/90">Statements</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8 max-w-3xl font-light">
                This space contains press mentions and official statements from Tax Code. It is distinct
                from the Insights hub: items here are time-bound and public-facing.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-gray-50 shadow-lg">
                  <Link href="/insights">Go to insights</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 backdrop-blur-sm">
                  <Link href="/contact">Media enquiries</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Latest News & Updates</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay informed with our latest press mentions, public statements, and official communications.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.length > 0 ? (
            items.map((n) => (
              <Card key={n.slug} className="group h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={n.image || '/news.jpg'}
                    alt={n.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className={`text-xs border-0 ${
                      n.type === 'Press mention' ? 'bg-blue-500/90 text-white' :
                      n.type === 'Public statement' ? 'bg-green-500/90 text-white' :
                      'bg-purple-500/90 text-white'
                    }`}>
                      {n.type}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">
                      <Link href={`/news/${n.slug}`} className="hover:underline">
                        {n.title}
                      </Link>
                    </h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {n.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <time className="text-xs text-gray-500">
                      {n.publishedAt
                        ? new Date(n.publishedAt).toLocaleDateString()
                        : new Date(n.createdAt).toLocaleDateString()}
                    </time>
                    <Button asChild size="sm" className="bg-[#9E1B1F] hover:bg-[#7a1418] text-white">
                      <Link href={`/news/${n.slug}`}>Read More</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-12">
              <div className="text-4xl mb-4">📰</div>
              <p className="text-lg">No news items available yet.</p>
              <p className="text-sm mt-2">Check back soon for updates and announcements.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}




