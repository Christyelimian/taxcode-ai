
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calculator,
  CheckCircle2,
  FileText,
  CalendarCheck,
  ChevronRight,
  Lock,
} from 'lucide-react';
import Link from 'next/link';

const tools = [
  {
    icon: <Calculator className="h-8 w-8 text-primary" />,
    title: 'Tax Calculator',
    description: 'Estimate your tax liability under the new reform with our AI-powered tool.',
    link: '/dashboard/calculator',
    status: 'active',
  },
  {
    icon: <CheckCircle2 className="h-8 w-8 text-muted-foreground" />,
    title: 'Compliance Checker',
    description: 'Verify your compliance status instantly against the new regulations.',
    link: '#',
    status: 'coming_soon',
  },
  {
    icon: <FileText className="h-8 w-8 text-muted-foreground" />,
    title: 'Document Generator',
    description: 'Automate the creation of essential tax forms and documents.',
    link: '#',
    status: 'coming_soon',
  },
  {
    icon: <CalendarCheck className="h-8 w-8 text-muted-foreground" />,
    title: 'Deadline Tracker',
    description: 'Never miss an important filing date with our automated reminder system.',
    link: '#',
    status: 'coming_soon',
  },
];

export default function InteractiveToolsPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-headline font-bold text-foreground mb-2">
          Interactive Tools
        </h1>
        <p className="text-muted-foreground mb-8">
          A suite of powerful, AI-driven tools to simplify your tax management.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {tools.map((tool, index) => (
            <Card
              key={index}
              className={`flex flex-col transition-all duration-300 ${
                tool.status === 'active'
                  ? 'hover:shadow-xl hover:-translate-y-1'
                  : 'bg-muted/50'
              }`}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  {tool.icon}
                  <div>
                    <CardTitle className="font-headline text-xl text-foreground">
                      {tool.title}
                    </CardTitle>
                    {tool.status === 'coming_soon' && (
                       <span className="text-xs font-semibold text-primary">Coming Soon</span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{tool.description}</p>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  variant={tool.status === 'active' ? 'default' : 'secondary'}
                  className="w-full"
                  disabled={tool.status !== 'active'}
                >
                  <Link href={tool.link}>
                    {tool.status === 'active' ? (
                      <>
                        Launch Tool <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Coming Soon
                      </>
                    )}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
