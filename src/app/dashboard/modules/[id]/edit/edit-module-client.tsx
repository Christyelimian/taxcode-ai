'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, LoaderCircle, PlusCircle, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getTrainingModuleById, updateTrainingModule } from '@/app/actions';
import { LessonContentEditor } from '@/components/lesson-content-editor';

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

export default function EditModuleClient({ moduleId }: { moduleId: string }) {
  const { toast } = useToast();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [kbArticleId, setKbArticleId] = useState<string | undefined>(undefined);

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

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: 'content',
  });

  const status = form.watch('status');
  const publishHint = useMemo(() => {
    if (status === 'Published') return 'Published modules will be synced into the AI Knowledge Base and become answerable with citations.';
    return 'Draft/Archived modules remain hidden from users and are retired from AI retrieval (soft “untrain”).';
  }, [status]);

  useEffect(() => {
    let alive = true;
    async function load() {
      setIsFetching(true);
      const res = await getTrainingModuleById(moduleId);
      if (!alive) return;

      if (!res.success || !res.data) {
        toast({ variant: 'destructive', title: 'Load Failed', description: res.error || 'Module not found.' });
        router.push('/dashboard/modules');
        return;
      }

      const m: any = res.data;
      setKbArticleId(m.kbArticleId);
      form.setValue('title', m.title || '');
      form.setValue('dates', m.dates || '');
      form.setValue('status', m.status || 'Draft');
      form.setValue('summary', m.summary || '');
      form.setValue('jurisdiction', m.jurisdiction || 'Nigeria');
      form.setValue('effectiveDate', m.effectiveDate || '');
      form.setValue('tags', Array.isArray(m.tags) ? m.tags.join(', ') : '');
      replace((m.content || []).map((t: string) => ({ value: t })) || [{ value: '' }]);

      setIsFetching(false);
    }
    load();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId]);

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    const moduleData = {
      title: values.title,
      dates: values.dates,
      status: values.status,
      summary: values.summary,
      jurisdiction: values.jurisdiction,
      effectiveDate: values.effectiveDate || undefined,
      tags: (values.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
      content: values.content.map((item) => item.value),
      kbArticleId,
    };

    const response = await updateTrainingModule(moduleId, moduleData);

    if (response.success) {
      toast({
        title: 'Module Updated',
        description: 'Saved. If Published, the module is now synced into the AI Knowledge Base.',
      });
      router.push('/dashboard/modules');
    } else {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: response.error || 'An unexpected error occurred.',
      });
    }

    setIsLoading(false);
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/modules">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Modules
            </Link>
          </Button>
          {kbArticleId && (
            <p className="text-xs text-muted-foreground">
              KB link: <span className="font-mono">{kbArticleId}</span>
            </p>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Training Module</CardTitle>
            <CardDescription>Update the module and control whether it’s used by the AI assistant.</CardDescription>
          </CardHeader>
          <CardContent>
            {isFetching ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Loading module…
              </div>
            ) : (
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
                        <FormDescription>{publishHint}</FormDescription>
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
                          <Textarea rows={4} placeholder="Short overview used by AI retrieval." {...field} />
                        </FormControl>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <FormLabel>Module Topics</FormLabel>
                    <FormDescription className="mb-4">These topics become structured AI knowledge when published.</FormDescription>
                    {fields.map((f, index) => (
                      <FormField
                        key={f.id}
                        control={form.control}
                        name={`content.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2 mb-2">
                            <FormControl>
                              <Input placeholder={`Topic ${index + 1}`} {...field} />
                            </FormControl>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => remove(index)}
                              disabled={fields.length <= 1}
                            >
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
                          Saving…
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        {/* Lesson Content Editor */}
        {!isFetching && form.watch('content').length > 0 && (
          <div className="mt-6">
            <LessonContentEditor
              moduleId={moduleId}
              lessonTopics={form.watch('content').map((c) => c.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}




