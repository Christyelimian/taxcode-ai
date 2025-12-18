/**
 * Knowledge Base Dashboard Page
 * Route: /dashboard/knowledge-base
 */

import { Suspense } from 'react';
import KnowledgeBaseDashboard from '@/components/knowledge-base-dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

async function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="h-12 bg-slate-200 rounded-lg animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-slate-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Knowledge Base Manager | TaxCode',
  description: 'Manage articles, embeddings, and AI training for the TaxCode knowledge base',
};

export default function KnowledgeBasePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <KnowledgeBaseDashboard />
    </Suspense>
  );
}
