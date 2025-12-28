import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function HeroSection(props: {
  badge?: string;
  heading?: string;
  description?: string;
  buttons?: Array<{ label: string; href: string; variant?: 'default' | 'outline' | 'ghost' }>;
  className?: string;
}) {
  return (
    <section className={`border-b bg-primary/5 ${props.className || ''}`}>
      <div className="container mx-auto px-4 py-16">
        {props.badge && (
          <Badge variant="secondary" className="mb-4">
            {props.badge}
          </Badge>
        )}
        {props.heading && (
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight">
            {props.heading}
          </h1>
        )}
        {props.description && (
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            {props.description}
          </p>
        )}
        {props.buttons && props.buttons.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {props.buttons.map((button, idx) => (
              <Button key={idx} asChild variant={button.variant || 'default'}>
                <Link href={button.href}>{button.label}</Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}



