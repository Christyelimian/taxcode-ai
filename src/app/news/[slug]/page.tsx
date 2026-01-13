import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getNewsBySlug } from '@/app/actions';

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

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getNewsBySlug(slug);
  
  if (!result.success || !result.data) {
    notFound();
  }

  const doc = result.data;

  // Parse content with images
  const contentParts = parseContentWithImages(doc.body);

  return (
    <div className="bg-background">
      {/* Hero Section with Image */}
      <section className="relative h-[80vh] overflow-hidden">
        <Image
          src={doc.image || '/news.jpg'}
          alt={doc.title}
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-8 max-w-6xl pb-8">
            <div className="flex flex-wrap items-center gap-2 text-sm text-white/80 mb-6">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/news" className="hover:text-white transition-colors">
                News
              </Link>
            </div>

            <Badge variant="secondary" className={`mb-6 text-xs border-0 ${
              doc.type === 'Press mention' ? 'bg-blue-500/90 text-white' :
              doc.type === 'Public statement' ? 'bg-green-500/90 text-white' :
              'bg-purple-500/90 text-white'
            }`}>
              {doc.type}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 max-w-3xl">
              <span className="line-clamp-2">{doc.title}</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-6 max-w-2xl font-light">
              {doc.summary.split(' ').slice(0, 20).join(' ')}{doc.summary.split(' ').length > 20 ? '...' : ''}
            </p>
            <div className="text-white/80 mb-8">
              <time className="text-sm font-medium">
                Published {doc.publishedAt ? new Date(doc.publishedAt).toLocaleDateString() : new Date(doc.createdAt).toLocaleDateString()}
              </time>
            </div>

            {/* Author Information */}
            {doc.authorName && (
              <Link href={`/team/${doc.authorId}`} className="flex items-center gap-2 mb-3 hover:bg-gray-100 p-2 rounded-lg transition-colors">
                <Avatar className="h-10 w-10">
                  {doc.authorImage ? (
                    <AvatarImage asChild>
                      <Image
                        src={doc.authorImage || ''}
                        alt={doc.authorName}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </AvatarImage>
                  ) : (
                    <AvatarFallback className="text-sm">
                      {doc.authorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="text-sm">
                  <div className="text-gray-900 font-medium">{doc.authorName}</div>
                  <div className="text-gray-600 text-xs">{doc.authorTitle}</div>
                </div>
              </Link>
            )}

            <div className="flex flex-wrap gap-4 mt-4">
              <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 backdrop-blur-sm">
                <Link href="/news">Back to news</Link>
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
                return (
                  <figure key={idx} className="my-8">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-lg shadow-lg">
                      <Image
                        src={part.src || ''}
                        alt={part.alt || ''}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
                      />
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
                const paragraphs = (part.content || '').split('\n\n').filter(Boolean);
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




