
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { calculateTax } from '@/app/actions';
import { LoaderCircle, Terminal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { streamChatWithPuter } from '@/lib/puter-ai';
import type { CalculateTaxOutput } from '@/ai/flows/calculate-tax-flow';

const formSchema = z.object({
  income: z.coerce.number().positive({ message: 'Annual income must be a positive number.' }),
  filingStatus: z.enum(['single', 'married_jointly', 'married_separately', 'head_of_household']),
  dependents: z.coerce.number().min(0).int(),
});

type FormValues = z.infer<typeof formSchema>;

export default function TaxCalculatorPage() {
  const { toast } = useToast();
  const [calculationResult, setCalculationResult] = useState<CalculateTaxOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [puterAvailable, setPuterAvailable] = useState<boolean | null>(null);
  const [enhancedExplanation, setEnhancedExplanation] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: 1000000,
      filingStatus: 'single',
      dependents: 0,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setCalculationResult(null);
    setEnhancedExplanation(null);

    const response = await calculateTax(values);

    if (response.success && response.data) {
      setCalculationResult(response.data);
      
      // If Puter is available, get an enhanced explanation with AI
      if (puterAvailable !== false && typeof window !== 'undefined') {
        try {
          const prompt = `As a Nigerian tax expert, provide a brief, actionable explanation of why the estimated tax is ₦${response.data.estimatedTax.toLocaleString()} for someone with:
- Annual income: ₦${values.income.toLocaleString()}
- Filing status: ${values.filingStatus}
- Number of dependents: ${values.dependents}

Focus on key tax reliefs and how they apply. Keep it concise (2-3 sentences).`;

          let explanation = '';
          const generator = streamChatWithPuter(prompt, 'anthropic/claude-3.5-sonnet');

          for await (const chunk of generator) {
            if (!chunk.done) {
              explanation += chunk.text;
              setEnhancedExplanation(explanation);
            }
          }
          setPuterAvailable(true); // Mark as available
        } catch (error) {
          console.error('Error generating enhanced explanation:', error);
          setPuterAvailable(false); // Mark as unavailable
          // Silently fail - use original explanation
        }
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Calculation Failed',
        description: response.error || 'An unexpected error occurred.',
      });
    }

    setIsLoading(false);
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-headline font-bold text-foreground mb-2">AI-Powered Tax Calculator</h1>
        <p className="text-muted-foreground mb-8">
          Estimate your tax liability based on Nigerian tax laws. Provide your details below.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Details</CardTitle>
              <CardDescription>Enter your financial information to get started.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="income"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Income (₦)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 5000000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="filingStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Filing Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a filing status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="married_jointly">Married, Filing Jointly</SelectItem>
                            <SelectItem value="married_separately">Married, Filing Separately</SelectItem>
                            <SelectItem value="head_of_household">Head of Household</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dependents"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Dependents</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      'Calculate Tax'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <div className="space-y-8">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Calculation Result</CardTitle>
                <CardDescription>Your estimated tax liability breakdown.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading && (
                   <div className="space-y-4">
                        <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
                        <div className="h-24 w-full bg-muted animate-pulse rounded-md" />
                    </div>
                )}
                {!isLoading && calculationResult && (
                  <div className="space-y-4">
                     <Alert variant="default" className="bg-primary text-primary-foreground border-primary-foreground/20">
                        <Terminal className="h-4 w-4 !text-primary-foreground" />
                        <AlertTitle className="font-bold text-lg">
                          Estimated Tax: ₦{calculationResult.estimatedTax.toLocaleString()}
                        </AlertTitle>
                        <AlertDescription className="!text-primary-foreground/80">
                          {enhancedExplanation ? "AI-powered insights below" : "This is an estimate based on the provided information."}
                        </AlertDescription>
                      </Alert>

                     <div className="prose prose-sm text-foreground max-w-none">
                        <h4 className="font-semibold">{enhancedExplanation ? "AI Insights:" : "Breakdown & Explanation:"}</h4>
                        <p className="text-muted-foreground">{enhancedExplanation || calculationResult.explanation}</p>
                     </div>
                  </div>
                )}
                 {!isLoading && !calculationResult && (
                    <div className="text-center text-muted-foreground py-10">
                        <p>Your results will appear here after calculation.</p>
                    </div>
                 )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
