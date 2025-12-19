
'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { createTrainingModule } from '@/app/actions';
import { LoaderCircle, PlusCircle, Trash2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const formSchema = z.object({
  title: z.string().min(10, { message: 'Title must be at least 10 characters long.' }),
  dates: z.string().min(5, { message: 'Please provide training dates.' }),
  status: z.enum(['Draft', 'Published', 'Archived']),
  summary: z.string().min(20, { message: 'Summary must be at least 20 characters.' }),
  tags: z.string().optional(),
  jurisdiction: z.string().min(2, { message: 'Jurisdiction is required.' }).default('Nigeria'),
  effectiveDate: z.string().optional(),
  content: z.array(z.object({ value: z.string().min(5, { message: 'Topic must be at least 5 characters.' }) })),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewModulePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      dates: '',
      status: 'Draft',
      summary: '',
      tags: '',
      jurisdiction: 'Nigeria',
      effectiveDate: '',
      content: [{ value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'content',
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    const moduleData = {
      ...values,
      content: values.content.map(item => item.value),
      tags: (values.tags || '').split(',').map(t => t.trim()).filter(Boolean),
    };

    const response = await createTrainingModule(moduleData);

    if (response.success) {
      toast({
        title: 'Module Created',
        description: 'The new training module has been successfully saved.',
      });
      router.push('/dashboard/modules');
    } else {
      toast({
        variant: 'destructive',
        title: 'Creation Failed',
        description: response.error || 'An unexpected error occurred.',
      });
    }

    setIsLoading(false);
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/modules">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Modules
            </Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Create New Training Module</CardTitle>
            <CardDescription>Fill out the form below to add a new module to the CMS.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Module Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Understanding the New Tax Reform Act" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dates"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Training Dates</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., (1st – 4th September 2025)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Published">Published</SelectItem>
                          <SelectItem value="Archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summary / Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A short, practical overview of what this module teaches (used by AI retrieval)."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This becomes the KB summary and improves retrieval accuracy.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="jurisdiction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jurisdiction</FormLabel>
                        <FormControl>
                          <Input placeholder="Nigeria" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="effectiveDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Effective date (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="YYYY-MM-DD" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags (comma-separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="vat, pita, compliance, reforms" {...field} />
                      </FormControl>
                      <FormDescription>
                        Add acronyms + synonyms to improve discovery.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                   <FormLabel>Module Topics</FormLabel>
                   <FormDescription className="mb-4">Add the topics that will be covered in this module.</FormDescription>
                    {fields.map((field, index) => (
                         <FormField
                            key={field.id}
                            control={form.control}
                            name={`content.${index}.value`}
                            render={({ field }) => (
                               <FormItem className="flex items-center gap-2 mb-2">
                                    <FormControl>
                                        <Input placeholder={`Topic ${index + 1}`} {...field} />
                                    </FormControl>
                                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                     <Button type="button" variant="outline" size="sm" onClick={() => append({ value: '' })}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Topic
                    </Button>
                </div>


                <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                        <>
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                        </>
                        ) : (
                        'Create Module'
                        )}
                    </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
