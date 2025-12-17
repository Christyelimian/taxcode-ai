
'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MoreHorizontal, FilePlus, Trash2, LoaderCircle } from 'lucide-react';
import { getKnowledgeBaseArticles, createKnowledgeBaseArticle, deleteKnowledgeBaseArticle, type KnowledgeBaseArticle } from '@/app/actions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

const addArticleSchema = z.object({
  topic: z.string().min(5, 'Topic must be at least 5 characters.'),
  content: z.string().min(20, 'Content must be at least 20 characters.'),
});

type AddArticleFormValues = z.infer<typeof addArticleSchema>;

interface KnowledgeClientPageProps {
  initialArticles: KnowledgeBaseArticle[];
  initialError?: string;
}

export default function KnowledgeClientPage({ initialArticles, initialError }: KnowledgeClientPageProps) {
  const { toast } = useToast();
  const [articles, setArticles] = useState<KnowledgeBaseArticle[]>(initialArticles);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<AddArticleFormValues>({
    resolver: zodResolver(addArticleSchema),
    defaultValues: {
      topic: '',
      content: '',
    },
  });
  
  useEffect(() => {
    if(initialError) {
      toast({
        variant: 'destructive',
        title: 'Error Loading Articles',
        description: initialError,
      });
    }
  }, [initialError, toast]);


  const fetchArticles = async () => {
    setIsLoading(true);
    const result = await getKnowledgeBaseArticles();
    if (result.success && result.data) {
      setArticles(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
    setIsLoading(false);
  };


  const handleAddArticle = async (values: AddArticleFormValues) => {
    setIsSubmitting(true);
    const result = await createKnowledgeBaseArticle(values);
    if (result.success) {
      toast({
        title: 'Article Added',
        description: 'The new article has been added to the knowledge base.',
      });
      fetchArticles();
      setIsDialogOpen(false);
      form.reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to Add Article',
        description: result.error,
      });
    }
    setIsSubmitting(false);
  };

  const handleDeleteArticle = async (articleId: string) => {
    const result = await deleteKnowledgeBaseArticle(articleId);
    if (result.success) {
      toast({
        title: 'Article Deleted',
        description: 'The article has been removed from the knowledge base.',
      });
      fetchArticles();
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to Delete Article',
        description: result.error,
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Knowledge Base</CardTitle>
            <CardDescription>
              Manage the information used to train your AI assistant.
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <FilePlus className="mr-2 h-4 w-4" />
                Add Article
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Knowledge Article</DialogTitle>
                <DialogDescription>
                  This information will be used by the AI to answer user questions.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddArticle)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topic</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Value Added Tax (VAT)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide detailed information about the topic..."
                            rows={6}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                      Add Article
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Topic</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : articles.length > 0 ? (
                articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">{article.topic}</TableCell>
                    <TableCell className="text-muted-foreground">
                       {article.createdAt ? formatDistanceToNow(new Date(article.createdAt), { addSuffix: true }) : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => article.id && handleDeleteArticle(article.id)}
                            disabled={!article.id}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-24">
                    No articles in the knowledge base yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
