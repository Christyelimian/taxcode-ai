import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getInsightBySlug } from '@/app/actions';

// Markdown image regex
const markdownImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;

// Function to parse content with images
function parseContentWithImages(content: string) {
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = markdownImageRegex.exec(content)) !== null) {
    // Add text before the image
    if (match.index > lastIndex) {
      const textBefore = content.slice(lastIndex, match.index).trim();
      if (textBefore) {
        parts.push({ type: 'text', content: textBefore });
      }
    }

    // Add the image
    const altText = match[1] || '';
    const imageUrl = match[2];
    parts.push({
      type: 'image',
      alt: altText,
      src: imageUrl,
      caption: altText || null
    });

    lastIndex = markdownImageRegex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    const remainingText = content.slice(lastIndex).trim();
    if (remainingText) {
      parts.push({ type: 'text', content: remainingText });
    }
  }

  return parts;
}

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

  // Parse content with images
  const contentParts = parseContentWithImages(doc.body);

  // Parse downloads if they exist
  const downloads = doc.downloads && typeof doc.downloads === 'object' && Array.isArray(doc.downloads)
    ? doc.downloads
    : [];

  return (
    <div className="bg-background">
      {/* Hero Section with Image */}
      <section className="relative h-[70vh] overflow-hidden">
        <Image
          src={doc.image || '/hero2.jpg'}
          alt={doc.title}
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-8 max-w-6xl">
            <div className="flex flex-wrap items-center gap-2 text-sm text-white/80 mb-6">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/insights" className="hover:text-white transition-colors">
                Insights
              </Link>
            </div>

            <Badge variant="secondary" className="bg-white/10 text-white border-white/30 backdrop-blur-sm mb-6">
              {doc.category}
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 max-w-4xl">
              {doc.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8 max-w-3xl font-light">
              {doc.summary}
            </p>
            <div className="text-white/80 mb-8">
              <time className="text-sm font-medium">
                Published {doc.publishedAt ? new Date(doc.publishedAt).toLocaleDateString() : new Date(doc.createdAt).toLocaleDateString()}
              </time>
              {Array.isArray(doc.tags) && doc.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {doc.tags.map((tag: string) => (
                    <span key={tag} className="text-xs bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 backdrop-blur-sm">
                <Link href="/insights">Back to insights</Link>
              </Button>
              <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-gray-50 shadow-lg">
                <Link href="/contact">Contact</Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <article className="prose prose-neutral max-w-none">
            {contentParts.map((part, idx) => {
              if (part.type === 'image') {
                // Check if it's an external image (starts with http)
                const isExternalImage = part.src && part.src.startsWith('http');
                
                return (
                  <figure key={idx} className="my-8">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-lg shadow-lg">
                      {isExternalImage ? (
                        // Use regular img tag for external images to avoid Next.js optimization issues
                        <img
                          src={part.src}
                          alt={part.alt || ''}
                          className="w-full h-full object-cover"
                          style={{ width: '100%', height: '100%' }}
                        />
                      ) : (
                        // Use Next.js Image for local images
                        <Image
                          src={part.src || '/hero.jpg'}
                          alt={part.alt || ''}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
                        />
                      )}
                    </div>
                    {part.caption && (
                      <figcaption className="mt-3 text-sm text-muted-foreground text-center italic">
                        {part.caption}
                      </figcaption>
                    )}
                  </figure>
                );
              } else {
                // Split text into paragraphs
                const paragraphs = part.content.split('\n\n').filter(Boolean);
                return paragraphs.map((p, pIdx) => (
                  <p key={`${idx}-${pIdx}`} className="mb-4 leading-relaxed">
                    {p}
                  </p>
                ));
              }
            })}
          </article>

          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Downloads</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {doc.downloads?.length ? (
                  doc.downloads.map((d: { label: string; href: string }) => (
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




