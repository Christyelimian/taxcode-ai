'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileUp, LoaderCircle, Wand2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { createTrainingModule, generateTrainingModuleFromDocument } from '@/app/actions';

export default function ImportModuleFromDocumentPage() {
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [draft, setDraft] = useState<any>(null);

  const canGenerate = extractedText.trim().length >= 200;
  const canCreate = !!draft?.title && Array.isArray(draft?.content) && draft.content.length > 0;

  const wordCount = useMemo(() => {
    const t = extractedText.trim();
    if (!t) return 0;
    return t.split(/\s+/).length;
  }, [extractedText]);

  async function extract() {
    if (!file) return;
    setIsExtracting(true);
    setDraft(null);
    try {
      const fd = new FormData();
      fd.append('file', file);

      const res = await fetch('/api/admin/document-extract', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to extract');

      setExtractedText(data.text || '');
      setSourceName(data.fileName || file.name);
      toast({ title: 'Extracted', description: `Extracted ${data.length} characters.` });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Extraction failed', description: e?.message || 'Error extracting document' });
    } finally {
      setIsExtracting(false);
    }
  }

  async function generate() {
    if (!canGenerate) return;
    setIsGenerating(true);
    try {
      const res = await generateTrainingModuleFromDocument({ sourceName, text: extractedText });
      if (!res.success || !res.data) throw new Error(res.error || 'Generation failed');
      setDraft(res.data);
      toast({ title: 'Draft generated', description: 'Review and create the module.' });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Generation failed', description: e?.message || 'Error generating module' });
    } finally {
      setIsGenerating(false);
    }
  }

  async function createModule() {
    if (!canCreate) return;
    const ok = confirm('Create this module as Draft? You can edit/publish after.');
    if (!ok) return;
    const res = await createTrainingModule({
      title: draft.title,
      dates: draft.dates || '',
      status: 'Draft',
      summary: draft.summary,
      tags: draft.tags || [],
      jurisdiction: draft.jurisdiction || 'Nigeria',
      effectiveDate: draft.effectiveDate,
      content: draft.content,
    } as any);

    if (res.success) {
      toast({ title: 'Module created', description: 'Saved as Draft. You can now edit/publish it.' });
    } else {
      toast({ variant: 'destructive', title: 'Create failed', description: res.error || 'Failed to create module' });
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/modules">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Modules
            </Link>
          </Button>
          <Badge variant="secondary">AI Course Builder</Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload a document</CardTitle>
            <CardDescription>PDF, DOCX, TXT, or Markdown. We’ll extract the text and draft a course module.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Document file</label>
                <Input
                  type="file"
                  accept=".pdf,.docx,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Source name</label>
                <Input value={sourceName} onChange={(e) => setSourceName(e.target.value)} placeholder="e.g. 2026 Tax Reform Act PDF" />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={extract} disabled={!file || isExtracting}>
                <FileUp className="h-4 w-4 mr-2" />
                {isExtracting ? 'Extracting…' : 'Extract text'}
              </Button>
              <Button onClick={generate} disabled={!canGenerate || isGenerating}>
                <Wand2 className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generating…' : 'Generate module draft'}
              </Button>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium mb-1">Extracted text</label>
                <span className="text-xs text-muted-foreground">{wordCount} words</span>
              </div>
              <Textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                rows={12}
                placeholder="Extracted text will appear here (you can edit before generating)."
              />
            </div>
          </CardContent>
        </Card>

        {draft && (
          <Card>
            <CardHeader>
              <CardTitle>Draft module preview</CardTitle>
              <CardDescription>Review this draft. You can edit after creating in Modules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Title</p>
                <p className="text-sm">{draft.title}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Summary</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{draft.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge>{draft.jurisdiction || 'Nigeria'}</Badge>
                {draft.effectiveDate && <Badge variant="outline">Effective: {draft.effectiveDate}</Badge>}
                {Array.isArray(draft.tags) && draft.tags.slice(0, 12).map((t: string) => (
                  <Badge key={t} variant="secondary">{t}</Badge>
                ))}
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Topics</p>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                  {draft.content.map((t: string, idx: number) => (
                    <li key={`${idx}-${t}`}>{t}</li>
                  ))}
                </ol>
              </div>

              <Button onClick={createModule} disabled={!canCreate}>
                <LoaderCircle className="h-4 w-4 mr-2" />
                Create module (Draft)
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}


