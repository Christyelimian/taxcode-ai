'use server';
/**
 * AI flow: Convert an uploaded document into a draft Training Module.
 */

import { z } from 'zod';
import { chatCompletion } from '@/lib/openrouter-client';

const DocumentToCourseInputSchema = z.object({
  sourceName: z.string().optional(),
  text: z.string().min(100),
});

const DocumentToCourseOutputSchema = z.object({
  title: z.string(),
  summary: z.string(),
  tags: z.array(z.string()).default([]),
  jurisdiction: z.string().default('Nigeria'),
  effectiveDate: z.string().optional(),
  dates: z.string().default(''),
  status: z.enum(['Draft', 'Published', 'Archived']).default('Draft'),
  content: z.array(z.string()).min(5).max(30),
});

export type DocumentToCourseInput = z.infer<typeof DocumentToCourseInputSchema>;
export type DocumentToCourseOutput = z.infer<typeof DocumentToCourseOutputSchema>;

export async function generateCourseFromDocument(input: DocumentToCourseInput): Promise<DocumentToCourseOutput> {
  const parsed = DocumentToCourseInputSchema.parse(input);

  const prompt = `You are a curriculum designer for TaxCode Academy (Nigeria-focused tax education).

Given a document's extracted text, produce a draft training module suitable for the platform.

Rules:
- The output must be practical and easy to follow.
- Prefer Nigeria as jurisdiction unless the document clearly indicates otherwise.
- If the document contains an "effective date", "commencement date", "as at", etc., include it as YYYY-MM-DD when possible.
- Create 8–18 topics (content array). Each topic should be a short lesson title, action-oriented, non-repetitive.
- summary should be 2–5 sentences.
- tags should include acronyms + synonyms (5–12 tags).
- status must be Draft.
- Do not invent legal facts; if unclear, keep topics high-level and mark uncertainty in summary.

Return ONLY valid JSON with this shape:
{"title": string, "summary": string, "tags": string[], "jurisdiction": string, "effectiveDate"?: string, "dates": string, "status": "Draft", "content": string[]}
No markdown, no code fences.

Source name: ${parsed.sourceName ?? ''}

Document text:
${parsed.text.slice(0, 60000)}
`;

  const { text } = await chatCompletion({
    model: process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
    maxTokens: 1400,
  });

  const jsonText = extractFirstJsonObject(text);
  const out = DocumentToCourseOutputSchema.parse(JSON.parse(jsonText));
  return out;
}

function extractFirstJsonObject(s: string): string {
  const start = s.indexOf('{');
  const end = s.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Model did not return JSON.');
  }
  return s.slice(start, end + 1);
}


