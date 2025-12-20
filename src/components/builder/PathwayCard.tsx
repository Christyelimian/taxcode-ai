import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function PathwayCard(props: {
  title?: string;
  description?: string;
  links?: Array<{ label: string; href: string }>;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        {props.title && <CardTitle className="text-xl">{props.title}</CardTitle>}
        {props.description && <CardDescription>{props.description}</CardDescription>}
      </CardHeader>
      {props.links && props.links.length > 0 && (
        <CardContent className="space-y-2 text-sm">
          {props.links.map((link, idx) => (
            <div key={idx}>
              <Link href={link.href} className="text-primary hover:underline">
                {link.label}
              </Link>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}

