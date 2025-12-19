
'use server';
/**
 * @fileOverview An AI agent for calculating estimated tax liability in Nigeria.
 *
 * - calculateTax - A function that handles the tax calculation process.
 * - CalculateTaxInput - The input type for the calculateTax function.
 * - CalculateTaxOutput - The return type for the calculateTax function.
 */

import { z } from 'zod';
import { chatCompletion } from '@/lib/openrouter-client';

const CalculateTaxInputSchema = z.object({
  income: z.number().describe('The annual income of the individual in Nigerian Naira (₦).'),
  filingStatus: z.string().describe("The individual's filing status (e.g., 'single', 'married_jointly')."),
  dependents: z.number().describe('The number of dependents the individual has.'),
});
export type CalculateTaxInput = z.infer<typeof CalculateTaxInputSchema>;

const CalculateTaxOutputSchema = z.object({
  estimatedTax: z.number().describe('The final estimated tax liability in Nigerian Naira (₦).'),
  explanation: z.string().describe('A step-by-step explanation of how the tax was calculated, including applicable rates, deductions, and reliefs based on Nigerian tax law.'),
});
export type CalculateTaxOutput = z.infer<typeof CalculateTaxOutputSchema>;

export async function calculateTax(input: CalculateTaxInput): Promise<CalculateTaxOutput> {
  const parsed = CalculateTaxInputSchema.parse(input);

  const prompt = `You are an expert Nigerian tax calculator. Compute an estimated personal income tax liability using the rules below.

Rules (use these exact rules):
1) Consolidated Relief Allowance (CRA) = max(200000, 1% of gross income) + 20% of gross income
2) Taxable income = gross income - CRA (not below 0)
3) Apply graduated rates to taxable income:
   - First 300000 @ 7%
   - Next 300000 @ 11%
   - Next 500000 @ 15%
   - Next 500000 @ 19%
   - Next 1600000 @ 21%
   - Above 3200000 @ 24%

User details:
- Annual income (gross): ₦${parsed.income}
- Filing status: ${parsed.filingStatus}
- Dependents: ${parsed.dependents}

Return ONLY valid JSON with this shape:
{"estimatedTax": number, "explanation": string}
No markdown, no code fences.`;

  const { text } = await chatCompletion({
    model: process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
    maxTokens: 900,
  });

  const jsonText = extractFirstJsonObject(text);
  const out = CalculateTaxOutputSchema.parse(JSON.parse(jsonText));
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
