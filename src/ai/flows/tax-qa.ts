'use server';
/**
 * @fileOverview An AI agent for answering questions about Nigerian tax law.
 *
 * Uses the Knowledge Base with vector embeddings and semantic search for accurate answers.
 * Integrates with Genkit for structured AI flows and training data collection.
 *
 * - askTaxLawQuestion - A function that handles the question answering process.
 * - AskTaxLawQuestionInput - The input type for the askTaxLawQuestion function.
 * - AskTaxLawQuestionOutput - The return type for the askTaxLawQuestion function.
 */

import { z } from 'zod';
import { hybridSearch, saveTrainingData } from '@/lib/knowledge-base';
import { chatCompletion } from '@/lib/openrouter-client';

const AskTaxLawQuestionInputSchema = z.object({
  question: z.string().describe('The question about Nigerian tax law.'),
  userId: z.string().optional().describe('Optional user ID for training data logging'),
});
export type AskTaxLawQuestionInput = z.infer<typeof AskTaxLawQuestionInputSchema>;

const AskTaxLawQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
  documentation: z.string().describe('Supporting documentation for the answer.'),
  sourceArticles: z.array(z.object({
    title: z.string(),
    category: z.string(),
    similarity: z.number(),
    sectionHeading: z.string().optional(),
    sectionNumber: z.number().optional(),
  })).optional().describe('Articles used to generate the answer'),
});
export type AskTaxLawQuestionOutput = z.infer<typeof AskTaxLawQuestionOutputSchema>;

export async function askTaxLawQuestion(input: AskTaxLawQuestionInput): Promise<AskTaxLawQuestionOutput> {
  const parsed = AskTaxLawQuestionInputSchema.parse(input);

  // Retrieve relevant KB context ourselves (no tool-calling needed).
  const articles = await hybridSearch(parsed.question, 5);
  const formattedArticles = articles.map((article) => ({
    title: article.title,
    content: article.content,
    summary: article.summary,
    category: article.category,
    tags: article.tags,
    similarity: Number(((article as any).similarity || 0).toFixed?.(3) ?? (article as any).similarity ?? 0),
    source: article.source,
    sourceUrl: (article as any).sourceUrl,
    sectionHeading: (article as any).sectionHeading,
    sectionNumber: (article as any).sectionNumber,
    id: article.id,
  }));

  const system = `You are TaxCode, the official assistant for the TaxCode platform. You help users understand Nigerian tax law (including the 2026 Tax Reform context).
Rules:
- Use the provided knowledge base articles as primary source when relevant.
- If KB is insufficient, answer using general Nigerian tax knowledge, but do NOT invent citations.
- Return ONLY valid JSON with shape:
{"answer": string, "documentation": string, "sourceArticles"?: [{"title": string, "category": string, "similarity": number, "sectionHeading"?: string, "sectionNumber"?: number}]}
No markdown, no code fences.`;

  const user = `User question:
${parsed.question}

Knowledge base articles (JSON):
${JSON.stringify(formattedArticles)}
`;

  const { text } = await chatCompletion({
    model: process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet',
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    temperature: 0.2,
    maxTokens: 1400,
  });

  const jsonText = extractFirstJsonObject(text);
  const output = AskTaxLawQuestionOutputSchema.parse(JSON.parse(jsonText));

  // Log training data for continuous improvement
  if (parsed.userId && output?.answer) {
    try {
      const used = await hybridSearch(parsed.question, 3);
      for (const article of used) {
        await saveTrainingData({
          articleId: article.id,
          question: parsed.question,
          answer: output.answer,
          retrievalContext: {
            query: parsed.question,
            similarity: (article as any).similarity ?? null,
            sectionId: (article as any).sectionId ?? null,
            sectionHeading: (article as any).sectionHeading ?? null,
            sectionNumber: (article as any).sectionNumber ?? null,
            source: article.source ?? null,
          },
        });
      }
    } catch (error) {
      console.error('Error saving training data:', error);
    }
  }

  return output;
}

function extractFirstJsonObject(s: string): string {
  const start = s.indexOf('{');
  const end = s.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Model did not return JSON.');
  }
  return s.slice(start, end + 1);
}
