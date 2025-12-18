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

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { hybridSearch, saveTrainingData } from '@/lib/knowledge-base';

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
  })).optional().describe('Articles used to generate the answer'),
});
export type AskTaxLawQuestionOutput = z.infer<typeof AskTaxLawQuestionOutputSchema>;

export async function askTaxLawQuestion(input: AskTaxLawQuestionInput): Promise<AskTaxLawQuestionOutput> {
  return askTaxLawQuestionFlow(input);
}

// Define the tool for the AI to use - performs semantic + keyword search
const getKnowledge = ai.defineTool(
  {
    name: 'getKnowledge',
    description: 'Retrieves relevant articles from the vector-based knowledge base using semantic and keyword search.',
    inputSchema: z.object({
      query: z.string().describe('The search query to find relevant knowledge base articles.'),
      limit: z.number().optional().default(5).describe('Maximum number of articles to retrieve'),
    }),
    outputSchema: z.string().describe('A JSON string of relevant knowledge base articles with similarity scores.'),
  },
  async (input) => {
    try {
      const articles = await hybridSearch(input.query, input.limit || 5);
      
      // Format for AI consumption
      const formattedArticles = articles.map((article) => ({
        title: article.title,
        content: article.content,
        summary: article.summary,
        category: article.category,
        tags: article.tags,
        similarity: (article.similarity || 0).toFixed(3),
        source: article.source,
      }));

      return JSON.stringify(formattedArticles);
    } catch (error) {
      console.error('Knowledge base search error:', error);
      return JSON.stringify([]);
    }
  }
);

const prompt = ai.definePrompt({
  name: 'askTaxLawQuestionPrompt',
  input: { schema: AskTaxLawQuestionInputSchema },
  output: { schema: AskTaxLawQuestionOutputSchema },
  tools: [getKnowledge],
  prompt: `You are TaxCode, the official assistant for the TaxCode platform. Your purpose is to help users understand Nigerian tax law, especially in the context of the 2026 Tax Reform Act.

  About the TaxCode Platform:
  - Purpose: To provide a strategic and inclusive transition for individuals, businesses, and public institutions to Nigeria's new tax landscape.
  - Key Features: AI Tax Assistant, Interactive Tools (Calculators, Compliance Checkers), Gamified Learning Modules, and Real-Time Compliance Monitoring.
  - Training: We offer comprehensive training modules on the new Tax Reform Act, covering everything from key changes to strategic planning.

  Your Persona:
  - You are helpful, knowledgeable, and an expert on Nigerian tax.
  - You should always identify yourself as "TaxCode" if asked who you are.
  - When relevant, you can mention the features or training modules available on the TaxCode platform to help the user further. For example, if they ask about calculating tax, you can mention the "Tax Calculator" tool.

  Your Task:
  - FIRST, use the 'getKnowledge' tool to search the knowledge base for information related to the user's question. This is your primary source of truth.
  - The tool returns articles with similarity scores - prioritize higher similarity scores (>0.7 is very relevant).
  - If you find relevant information in the knowledge base, use it to construct your answer with proper citations.
  - If the knowledge base does not contain relevant information, use your general knowledge of Nigerian tax law to answer.
  - Provide supporting documentation or cite relevant sections of the tax code where possible.
  - Do not make up information. If you don't know the answer, say so clearly.
  - Include the sourceArticles in your response with title, category, and similarity score so users know what was referenced.

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
  async (input) => {
    // Get AI response using knowledge base
    const { output } = await prompt(input);

    // Log training data for continuous improvement
    if (input.userId && output?.answer) {
      try {
        // Get the articles that were used
        const articles = await hybridSearch(input.question, 3);
        
        // Save for training
        for (const article of articles) {
          await saveTrainingData({
            articleId: article.id,
            question: input.question,
            answer: output.answer,
            userId: input.userId,
          });
        }
      } catch (error) {
        console.error('Error saving training data:', error);
        // Don't throw - allow answer to be returned even if training data fails
      }
    }

    return output!;
  }
);
