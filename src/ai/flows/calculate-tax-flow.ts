
'use server';
/**
 * @fileOverview An AI agent for calculating estimated tax liability in Nigeria.
 *
 * - calculateTax - A function that handles the tax calculation process.
 * - CalculateTaxInput - The input type for the calculateTax function.
 * - CalculateTaxOutput - The return type for the calculateTax function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
  return calculateTaxFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateTaxPrompt',
  input: {schema: CalculateTaxInputSchema},
  output: {schema: CalculateTaxOutputSchema},
  prompt: `You are an expert AI tax calculator for Nigeria. Your task is to calculate the estimated personal income tax liability based on the provided details.

  Use the current Nigerian Personal Income Tax Act (PITA) for your calculations.

  Consider the following in your calculation:
  1.  **Consolidated Relief Allowance (CRA):** This is the higher of ₦200,000 or 1% of gross income, plus 20% of gross income.
  2.  **Taxable Income:** Gross Income minus CRA.
  3.  **Graduated Tax Rates:**
      - First ₦300,000 @ 7%
      - Next ₦300,000 @ 11%
      - Next ₦500,000 @ 15%
      - Next ₦500,000 @ 19%
      - Next ₦1,600,000 @ 21%
      - Above ₦3,200,000 @ 24%

  User Details:
  - Annual Income: ₦{{{income}}}
  - Filing Status: {{{filingStatus}}}
  - Number of Dependents: {{{dependents}}}

  Please perform the calculation and provide the final estimated tax amount. Also, provide a clear, step-by-step breakdown of how you arrived at the final figure in the 'explanation' field.
  `,
});

const calculateTaxFlow = ai.defineFlow(
  {
    name: 'calculateTaxFlow',
    inputSchema: CalculateTaxInputSchema,
    outputSchema: CalculateTaxOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
