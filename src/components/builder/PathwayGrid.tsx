import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function PathwayGrid(props: {
  pathways?: Array<{
    title: string;
    description: string;
    links: Array<{ label: string; href: string }>;
  }>;
  columns?: number;
  className?: string;
}) {
  const columns = props.columns || 2;
  const gridClass = columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2';

  return (
    <section className={props.className || ''}>
      <div className="container mx-auto px-4 py-16">
        <div className={`grid gap-6 ${gridClass}`}>
          {props.pathways?.map((pathway, idx) => (
            <Card key={idx} className="h-full">
              <CardHeader>
                <CardTitle className="text-xl">{pathway.title}</CardTitle>
                <CardDescription>{pathway.description}</CardDescription>
              </CardHeader>
              {pathway.links && pathway.links.length > 0 && (
                <CardContent className="space-y-2 text-sm">
                  {pathway.links.map((link, linkIdx) => (
                    <div key={linkIdx}>
                      <Link href={link.href} className="text-primary hover:underline">
                        {link.label}
                      </Link>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}



