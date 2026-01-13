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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, FilePlus, Trash2, LoaderCircle, Edit, Eye, EyeOff } from 'lucide-react';
import { ImageUpload } from '@/components/image-upload';
import {
  getInsights,
  getNews,
  createInsight,
  createNews,
  updateInsight,
  updateNews,
  deleteInsight,
  deleteNews,
  getFacultyMembers,
  type Insight,
  type News,
} from '@/app/actions';
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
import { Checkbox } from '@/components/ui/checkbox';

const insightSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  category: z.string().min(1, 'Category is required.'),
  summary: z.string().min(20, 'Summary must be at least 20 characters.'),
  body: z.string().min(50, 'Body must be at least 50 characters.'),
  tags: z.string().optional(),
  image: z.string().optional(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  authorId: z.string().optional(),
});

const newsSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  type: z.enum(['Press mention', 'Public statement', 'Commentary']),
  summary: z.string().min(20, 'Summary must be at least 20 characters.'),
  body: z.string().min(50, 'Body must be at least 50 characters.'),
  externalUrl: z.string().url().optional().or(z.literal('')),
  image: z.string().optional(),
  isPublished: z.boolean().default(false),
  authorId: z.string().optional(),
});

type InsightFormValues = z.infer<typeof insightSchema>;
type NewsFormValues = z.infer<typeof newsSchema>;

const insightCategories = [
  'Taxpayer Rights & State Authority',
  'Tax Process & Administration',
  'Dispute Prevention & Resolution',
  'Tax Adjudication Insights',
  'Tax Policy & Governance',
];

interface InsightsClientPageProps {
  initialInsights: Insight[];
  initialNews: News[];
  initialInsightsError?: string;
  initialNewsError?: string;
}

export default function InsightsClientPage({
  initialInsights,
  initialNews,
  initialInsightsError,
  initialNewsError,
}: InsightsClientPageProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('insights');
  const [insights, setInsights] = useState<Insight[]>(initialInsights);
  const [news, setNews] = useState<News[]>(initialNews);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInsightDialogOpen, setIsInsightDialogOpen] = useState(false);
  const [isNewsDialogOpen, setIsNewsDialogOpen] = useState(false);
  const [editingInsight, setEditingInsight] = useState<Insight | null>(null);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [facultyMembers, setFacultyMembers] = useState<any[]>([]);

  const insightForm = useForm<InsightFormValues>({
    resolver: zodResolver(insightSchema),
    defaultValues: {
      title: '',
      category: '',
      summary: '',
      body: '',
      tags: '',
      image: '',
      isPublished: false,
      isFeatured: false,
      authorId: '',
    },
  });

  const newsForm = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: '',
      type: 'Press mention',
      summary: '',
      body: '',
      externalUrl: '',
      image: '',
      isPublished: false,
      authorId: '',
    },
  });

  useEffect(() => {
    if (initialInsightsError) {
      toast({
        variant: 'destructive',
        title: 'Error Loading Insights',
        description: initialInsightsError,
      });
    }
    if (initialNewsError) {
      toast({
        variant: 'destructive',
        title: 'Error Loading News',
        description: initialNewsError,
      });
    }

    // Fetch faculty members for author selection
    const fetchFacultyMembers = async () => {
      const result = await getFacultyMembers();
      if (result.success && result.data) {
        setFacultyMembers(result.data);
      }
    };
    fetchFacultyMembers();
  }, [initialInsightsError, initialNewsError, toast]);

  const fetchInsights = async () => {
    setIsLoading(true);
    const result = await getInsights(true);
    if (result.success && result.data) {
      setInsights(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
    setIsLoading(false);
  };

  const fetchNews = async () => {
    setIsLoading(true);
    const result = await getNews(true);
    if (result.success && result.data) {
      setNews(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
    setIsLoading(false);
  };

  const handleCreateInsight = async (values: InsightFormValues) => {
    setIsSubmitting(true);
    const tags = values.tags
      ? values.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    // Get author details if authorId is selected
    let authorData = {};
    if (values.authorId) {
      const selectedAuthor = facultyMembers.find(m => m.id === values.authorId);
      if (selectedAuthor) {
        authorData = {
          authorId: values.authorId,
          authorName: selectedAuthor.name,
          authorImage: selectedAuthor.image,
          authorTitle: selectedAuthor.title,
        };
      }
    }

    const result = editingInsight
      ? await updateInsight(editingInsight.id, { ...values, tags, ...authorData })
      : await createInsight({
          ...values,
          tags,
          ...authorData,
        });

    if (result.success) {
      toast({
        title: editingInsight ? 'Insight Updated' : 'Insight Created',
        description: `The insight has been ${editingInsight ? 'updated' : 'created'} successfully.`,
      });
      fetchInsights();
      setIsInsightDialogOpen(false);
      setEditingInsight(null);
      insightForm.reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed',
        description: result.error,
      });
    }
    setIsSubmitting(false);
  };

  const handleCreateNews = async (values: NewsFormValues) => {
    setIsSubmitting(true);
    
    // Get author details if authorId is selected
    let authorData = {};
    if (values.authorId) {
      const selectedAuthor = facultyMembers.find(m => m.id === values.authorId);
      if (selectedAuthor) {
        authorData = {
          authorId: values.authorId,
          authorName: selectedAuthor.name,
          authorImage: selectedAuthor.image,
          authorTitle: selectedAuthor.title,
        };
      }
    }

    const result = editingNews
      ? await updateNews(editingNews.id, { ...values, ...authorData })
      : await createNews({
          ...values,
          externalUrl: values.externalUrl || undefined,
          ...authorData,
        });

    if (result.success) {
      toast({
        title: editingNews ? 'News Updated' : 'News Created',
        description: `The news item has been ${editingNews ? 'updated' : 'created'} successfully.`,
      });
      fetchNews();
      setIsNewsDialogOpen(false);
      setEditingNews(null);
      newsForm.reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed',
        description: result.error,
      });
    }
    setIsSubmitting(false);
  };

  const handleDeleteInsight = async (id: string) => {
    const result = await deleteInsight(id);
    if (result.success) {
      toast({
        title: 'Insight Deleted',
        description: 'The insight has been deleted successfully.',
      });
      fetchInsights();
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to Delete',
        description: result.error,
      });
    }
  };

  const handleDeleteNews = async (id: string) => {
    const result = await deleteNews(id);
    if (result.success) {
      toast({
        title: 'News Deleted',
        description: 'The news item has been deleted successfully.',
      });
      fetchNews();
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to Delete',
        description: result.error,
      });
    }
  };

  const handleEditInsight = (insight: Insight) => {
    setEditingInsight(insight);
    insightForm.reset({
      title: insight.title,
      category: insight.category,
      summary: insight.summary,
      body: insight.body,
      tags: insight.tags.join(', '),
      image: insight.image || '',
      isPublished: insight.isPublished,
      isFeatured: insight.isFeatured,
      authorId: insight.authorId || '',
    });
    setIsInsightDialogOpen(true);
  };

  const handleEditNews = (newsItem: News) => {
    setEditingNews(newsItem);
    newsForm.reset({
      title: newsItem.title,
      type: newsItem.type as 'Press mention' | 'Public statement' | 'Commentary',
      summary: newsItem.summary,
      body: newsItem.body,
      externalUrl: newsItem.externalUrl || '',
      image: newsItem.image || '',
      isPublished: newsItem.isPublished,
      authorId: newsItem.authorId || '',
    });
    setIsNewsDialogOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Insights & News Management</CardTitle>
          <CardDescription>
            Manage insights and news content for the public pages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
            </TabsList>

            {/* Insights Tab */}
            <TabsContent value="insights" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Insights</h3>
                <Dialog
                  open={isInsightDialogOpen}
                  onOpenChange={(open) => {
                    setIsInsightDialogOpen(open);
                    if (!open) {
                      setEditingInsight(null);
                      insightForm.reset();
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <FilePlus className="mr-2 h-4 w-4" />
                      Add Insight
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingInsight ? 'Edit Insight' : 'Add New Insight'}
                      </DialogTitle>
                      <DialogDescription>
                        Create a structured explainer for tax education.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...insightForm}>
                      <form
                        onSubmit={insightForm.handleSubmit(handleCreateInsight)}
                        className="space-y-4"
                      >
                        <FormField
                          control={insightForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input placeholder="How tax assessments work..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={insightForm.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {insightCategories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                      {cat}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={insightForm.control}
                          name="summary"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Summary</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="A brief summary..."
                                  rows={3}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={insightForm.control}
                          name="body"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Body</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Main content (supports markdown)..."
                                  rows={10}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={insightForm.control}
                          name="tags"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tags (comma-separated)</FormLabel>
                              <FormControl>
                                <Input placeholder="assessment, process, notices" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={insightForm.control}
                          name="authorId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Author</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select an author" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {facultyMembers.map((member) => (
                                    <SelectItem key={member.id} value={member.id}>
                                      {member.name} - {member.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={insightForm.control}
                          name="image"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image</FormLabel>
                              <FormControl>
                                <ImageUpload
                                  onUpload={(result) => field.onChange(result.url)}
                                  onRemove={() => field.onChange('')}
                                  currentImage={field.value}
                                />
                              </FormControl>
                              <FormMessage />
                              <p className="text-sm text-muted-foreground">
                                Upload an image for this insight. Leave empty to use default image. Recommended size: 800x600px.
                              </p>
                            </FormItem>
                          )}
                        />
                        <div className="flex gap-4">
                          <FormField
                            control={insightForm.control}
                            name="isPublished"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Published</FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={insightForm.control}
                            name="isFeatured"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Featured</FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                        <DialogFooter>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              setIsInsightDialogOpen(false);
                              setEditingInsight(null);
                              insightForm.reset();
                            }}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            {editingInsight ? 'Update' : 'Create'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    [...Array(3)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-4 w-[250px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[150px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-8 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : insights.length > 0 ? (
                    insights.map((insight) => (
                      <TableRow key={insight.id}>
                         <TableCell className="font-medium">{insight.title}</TableCell>
                         <TableCell>{insight.category}</TableCell>
                         <TableCell className="text-sm text-muted-foreground">
                           {insight.authorName || 'No author'}
                         </TableCell>
                         <TableCell>
                           <div className="flex gap-2">
                            {insight.isPublished ? (
                              <Badge variant="default">Published</Badge>
                            ) : (
                              <Badge variant="secondary">Draft</Badge>
                            )}
                            {insight.isFeatured && (
                              <Badge variant="outline">Featured</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {insight.createdAt
                            ? formatDistanceToNow(new Date(insight.createdAt), { addSuffix: true })
                            : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditInsight(insight)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteInsight(insight.id)}
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
                      <TableCell colSpan={6} className="text-center h-24">
                        No insights yet. Create your first one!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            {/* News Tab */}
            <TabsContent value="news" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">News</h3>
                <Dialog
                  open={isNewsDialogOpen}
                  onOpenChange={(open) => {
                    setIsNewsDialogOpen(open);
                    if (!open) {
                      setEditingNews(null);
                      newsForm.reset();
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <FilePlus className="mr-2 h-4 w-4" />
                      Add News
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingNews ? 'Edit News' : 'Add New News'}
                      </DialogTitle>
                      <DialogDescription>
                        Create a press mention or public statement.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...newsForm}>
                      <form
                        onSubmit={newsForm.handleSubmit(handleCreateNews)}
                        className="space-y-4"
                      >
                        <FormField
                          control={newsForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Public statement: ..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={newsForm.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Press mention">Press mention</SelectItem>
                                  <SelectItem value="Public statement">Public statement</SelectItem>
                                  <SelectItem value="Commentary">Commentary</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={newsForm.control}
                          name="summary"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Summary</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Brief summary..." rows={3} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={newsForm.control}
                          name="body"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Body</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Main content (supports markdown)..."
                                  rows={10}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={newsForm.control}
                          name="externalUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>External URL (optional)</FormLabel>
                              <FormControl>
                                <Input
                                  type="url"
                                  placeholder="https://example.com/article"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={newsForm.control}
                          name="authorId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Author</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select an author" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {facultyMembers.map((member) => (
                                    <SelectItem key={member.id} value={member.id}>
                                      {member.name} - {member.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={newsForm.control}
                          name="image"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image</FormLabel>
                              <FormControl>
                                <ImageUpload
                                  onUpload={(result) => field.onChange(result.url)}
                                  onRemove={() => field.onChange('')}
                                  currentImage={field.value}
                                />
                              </FormControl>
                              <FormMessage />
                              <p className="text-sm text-muted-foreground">
                                Upload an image for this news item. Leave empty to use default image. Recommended size: 800x600px.
                              </p>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={newsForm.control}
                          name="isPublished"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Published</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              setIsNewsDialogOpen(false);
                              setEditingNews(null);
                              newsForm.reset();
                            }}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            {editingNews ? 'Update' : 'Create'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    [...Array(3)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-4 w-[250px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[150px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-8 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : news.length > 0 ? (
                    news.map((newsItem) => (
                      <TableRow key={newsItem.id}>
                         <TableCell className="font-medium">{newsItem.title}</TableCell>
                         <TableCell>{newsItem.type}</TableCell>
                         <TableCell className="text-sm text-muted-foreground">
                           {newsItem.authorName || 'No author'}
                         </TableCell>
                         <TableCell>
                           {newsItem.isPublished ? (
                            <Badge variant="default">Published</Badge>
                          ) : (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {newsItem.createdAt
                            ? formatDistanceToNow(new Date(newsItem.createdAt), { addSuffix: true })
                            : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditNews(newsItem)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteNews(newsItem.id)}
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
                      <TableCell colSpan={6} className="text-center h-24">
                        No news items yet. Create your first one!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}



