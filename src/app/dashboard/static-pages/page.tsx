import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, ExternalLink, Edit } from 'lucide-react';
import AdminProtectedLayout from '@/components/admin-protected-layout';

const STATIC_PAGES = [
  {
    id: 'start-here',
    title: 'Start Here',
    route: '/start-here',
    description: 'Main landing page with pathways for different user types',
  },
  {
    id: 'about',
    title: 'About',
    route: '/about',
    description: 'About TaxCode page with mission, values, and team information',
  },
  {
    id: 'contact',
    title: 'Contact',
    route: '/contact',
    description: 'Contact page with form and contact information',
  },
  {
    id: 'tax-rights',
    title: 'Tax Rights',
    route: '/tax-rights',
    description: 'Taxpayer rights information and resources',
  },
  {
    id: 'resources',
    title: 'Resources',
    route: '/resources',
    description: 'Resources library with guides, templates, and checklists',
  },
  {
    id: 'reforms-2026',
    title: '2026 Tax Reforms',
    route: '/reforms-2026',
    description: '2026 tax reforms hub with timeline and explanations',
  },
];

export default function StaticPagesAdminPage() {
  const builderApiKey = process.env.NEXT_PUBLIC_BUILDER_API_KEY;
  const builderUrl = builderApiKey 
    ? `https://builder.io/content/edit?model=page&apiKey=${builderApiKey}`
    : null;

  return (
    <AdminProtectedLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Static Pages Management</h1>
          <p className="text-muted-foreground">
            Edit static pages using Builder.io visual editor. Changes are previewed before publishing.
          </p>
        </div>

        {!builderApiKey && (
          <Card className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950/30">
            <CardHeader>
              <CardTitle className="text-amber-900 dark:text-amber-200">
                Builder.io API Key Not Configured
              </CardTitle>
              <CardDescription className="text-amber-800 dark:text-amber-300">
                To use the visual page builder, you need to:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-amber-800 dark:text-amber-300">
              <ol className="list-decimal list-inside space-y-1">
                <li>Sign up for a Builder.io account at <a href="https://builder.io" target="_blank" rel="noopener noreferrer" className="underline">builder.io</a></li>
                <li>Get your API key from the Builder.io dashboard</li>
                <li>Add <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">NEXT_PUBLIC_BUILDER_API_KEY</code> to your <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">.env.local</code> file</li>
                <li>Restart your development server</li>
              </ol>
            </CardContent>
          </Card>
        )}

        {builderApiKey && (
          <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950/30">
            <CardHeader>
              <CardTitle className="text-blue-900 dark:text-blue-200">
                Getting Started with Builder.io
              </CardTitle>
              <CardDescription className="text-blue-800 dark:text-blue-300">
                Pages will show "Content entry not found" until you create content in Builder.io
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
              <p>
                This is normal! The site will automatically use default content until you create pages in Builder.io.
              </p>
              <ol className="list-decimal list-inside space-y-1 mt-2">
                <li>Click "Edit in Builder.io" on any page</li>
                <li>Create a new page entry in Builder.io</li>
                <li>Set the URL to match the page route (e.g., <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">/start-here</code>)</li>
                <li>Add components and content</li>
                <li>Publish when ready</li>
              </ol>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {STATIC_PAGES.map((page) => (
            <Card key={page.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{page.title}</CardTitle>
                    <CardDescription className="mt-1">{page.description}</CardDescription>
                  </div>
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Route:</span>
                  <code className="bg-muted px-2 py-1 rounded text-xs">{page.route}</code>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={page.route} target="_blank">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Page
                    </Link>
                  </Button>
                  {builderUrl ? (
                    <>
                      <Button asChild size="sm" className="flex-1">
                        <Link 
                          href={`${builderUrl}&url=${encodeURIComponent(page.route)}`}
                          target="_blank"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit in Builder.io
                        </Link>
                      </Button>
                      <div className="text-xs text-muted-foreground mt-1 w-full">
                        {`If you see "Content entry not found", click "Create New" in Builder.io`}
                      </div>
                    </>
                  ) : (
                    <Button disabled size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Configure API Key
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>
              Understanding the Builder.io integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">1. Create or Edit in Builder.io</h3>
              <p>
                Click "Edit in Builder.io" to open the visual editor. 
                <strong className="text-foreground"> If you see "Content entry not found":</strong>
              </p>
              <ol className="list-decimal list-inside mt-2 space-y-1 ml-2">
                <li>Click the <strong>"Create New"</strong> or <strong>"New Entry"</strong> button</li>
                <li>Set the <strong>URL</strong> field to match the page route (e.g., <code className="bg-muted px-1 rounded text-xs">/start-here</code>)</li>
                <li>Click <strong>"Create"</strong></li>
                <li>Now you can drag and drop components, edit text, change layouts, and customize styling</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">2. Preview & Publish</h3>
              <p>
                Preview your changes in Builder.io before publishing. Once published, changes will appear
                on the live site.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">3. Fallback Safety</h3>
              <p>
                If Builder.io content is not available, the site automatically falls back to the original
                hardcoded content, ensuring the site never breaks.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminProtectedLayout>
  );
}

