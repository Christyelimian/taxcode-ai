
'use server';
/**
 * @fileOverview An AI agent for answering questions about Nigerian tax law.
 *
 * - askTaxLawQuestion - A function that handles the question answering process.
 * - AskTaxLawQuestionInput - The input type for the askTaxLaw-question function.
 * - AskTaxLawQuestionOutput - The return type for the askTaxLawQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { db } from '@/lib/firebase-server';

const AskTaxLawQuestionInputSchema = z.object({
  question: z.string().describe('The question about Nigerian tax law.'),
});
export type AskTaxLawQuestionInput = z.infer<typeof AskTaxLawQuestionInputSchema>;

const AskTaxLawQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
  documentation: z.string().describe('Supporting documentation for the answer.'),
});
export type AskTaxLawQuestionOutput = z.infer<typeof AskTaxLawQuestionOutputSchema>;

export async function askTaxLawQuestion(input: AskTaxLawQuestionInput): Promise<AskTaxLawQuestionOutput> {
  return askTaxLawQuestionFlow(input);
}

// Define the tool for the AI to use
const getKnowledge = ai.defineTool(
  {
    name: 'getKnowledge',
    description: 'Retrieves relevant articles from the knowledge base to answer a user\'s question.',
    inputSchema: z.object({
      query: z.string().describe('The search query to find relevant knowledge base articles.'),
    }),
    outputSchema: z.string().describe('A JSON string of relevant knowledge base articles.'),
  },
  async (input) => {
    if (!db) {
        return JSON.stringify([]);
    }
    // In a real-world scenario, you would use a vector search here.
    // For simplicity, we are doing a full-text search-like query.
    const articlesSnapshot = await db.collection('knowledgeBase').get();
    const articles = articlesSnapshot.docs
      .map(doc => doc.data())
      .filter(doc => {
          const content = doc.content?.toLowerCase() || '';
          const topic = doc.topic?.toLowerCase() || '';
          const query = input.query.toLowerCase();
          return content.includes(query) || topic.includes(query);
      });
    return JSON.stringify(articles);
  }
);

const prompt = ai.definePrompt({
  name: 'askTaxLawQuestionPrompt',
  input: {schema: AskTaxLawQuestionInputSchema},
  output: {schema: AskTaxLawQuestionOutputSchema},
  tools: [getKnowledge],
  prompt: `You are TaxCode, the official assistant for the TaxCode platform. Your purpose is to help users understand Nigerian tax law, especially in the context of the 2026 Tax Reform Act.

  About the TaxCode Platform:
  - Purpose: To provide a strategic and inclusive transition for individuals, businesses, and public institutions to Nigeria’s new tax landscape.
  - Key Features: AI Tax Assistant, Interactive Tools (Calculators, Compliance Checkers), Gamified Learning Modules, and Real-Time Compliance Monitoring.
  - Training: We offer comprehensive training modules on the new Tax Reform Act, covering everything from key changes to strategic planning.

  Your Persona:
  - You are helpful, knowledgeable, and an expert on Nigerian tax.
  - You should always identify yourself as "TaxCode" if asked who you are.
  - When relevant, you can mention the features or training modules available on the TaxCode platform to help the user further. For example, if they ask about calculating tax, you can mention the "Tax Calculator" tool.

  Your Task:
  - FIRST, use the 'getKnowledge' tool to search the knowledge base for information related to the user's question. This is your primary source of truth.
  - If you find relevant information in the knowledge base, use it to construct your answer.
  - If the knowledge base does not contain relevant information, use your general knowledge of Nigerian tax law to answer.
  - Provide supporting documentation or cite relevant sections of the tax code where possible.
  - Do not make up information. If you don't know the answer, say so.

  User's Question:
  "{{{question}}}"
  `,
});

const askTaxLawQuestionFlow = ai.defineFlow(
  {
    name: 'askTaxLawQuestionFlow',
    inputSchema: AskTaxLawQuestionInputSchema,
    outputSchema: AskTaxLawQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
