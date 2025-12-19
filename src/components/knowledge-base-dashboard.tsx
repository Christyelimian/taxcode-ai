/**
 * Knowledge Base Management Dashboard
 * Admin panel for managing articles, embeddings, and analytics
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Plus, Search, BarChart3, TrendingUp, AlertTriangle, Pencil, Trash2, Power } from 'lucide-react';

export default function KnowledgeBaseDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [includeInactive, setIncludeInactive] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    summary: '',
    category: 'Personal Tax',
    tags: '',
    source: '',
    sourceUrl: '',
    author: '',
    isActive: true,
  });

  // Form state for new article
  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    summary: '',
    category: 'Personal Tax',
    tags: '',
    source: '',
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/knowledge/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      if (includeInactive) {
        const response = await fetch(
          `/api/knowledge/articles?q=${encodeURIComponent(searchQuery)}&includeInactive=1&limit=25`
        );
        const data = await response.json();
        // normalize to same shape used by UI
        setSearchResults((data.results || []).map((a: any) => ({ ...a, similarity: undefined })));
      } else {
        const response = await fetch(`/api/knowledge/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setSearchResults(data.results || []);
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = async (articleId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/knowledge/articles/${articleId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to load article');

      const a = data.article;
      setSelectedArticle(a);
      setEditForm({
        title: a.title || '',
        content: a.content || '',
        summary: a.summary || '',
        category: a.category || 'Personal Tax',
        tags: Array.isArray(a.tags) ? a.tags.join(', ') : '',
        source: a.source || '',
        sourceUrl: a.sourceUrl || '',
        author: a.author || '',
        isActive: !!a.isActive,
      });
      setEditOpen(true);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const saveEdit = async () => {
    if (!selectedArticle?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/knowledge/articles/${selectedArticle.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editForm.title,
          content: editForm.content,
          summary: editForm.summary,
          category: editForm.category,
          tags: editForm.tags.split(',').map(t => t.trim()).filter(Boolean),
          source: editForm.source || undefined,
          sourceUrl: editForm.sourceUrl || undefined,
          author: editForm.author || undefined,
          isActive: editForm.isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to update article');

      setEditOpen(false);
      await loadStats();
      // refresh current search results without forcing user to retype
      if (searchQuery.trim()) {
        await handleSearch({ preventDefault: () => {} } as any);
      }
      alert('Article updated');
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Failed to update article');
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (articleId: string, nextActive: boolean) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/knowledge/articles/${articleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to update status');

      await loadStats();
      if (searchQuery.trim()) {
        await handleSearch({ preventDefault: () => {} } as any);
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (article: any) => {
    setSelectedArticle(article);
    setDeleteOpen(true);
  };

  const doDelete = async () => {
    if (!selectedArticle?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/knowledge/articles/${selectedArticle.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to delete article');

      setDeleteOpen(false);
      setEditOpen(false);
      await loadStats();
      if (searchQuery.trim()) {
        await handleSearch({ preventDefault: () => {} } as any);
      }
      alert('Article deleted');
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Failed to delete article');
    } finally {
      setLoading(false);
    }
  };

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/knowledge/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newArticle,
          tags: newArticle.tags.split(',').map(t => t.trim()),
        }),
      });

      if (response.ok) {
        // Reset form
        setNewArticle({
          title: '',
          content: '',
          summary: '',
          category: 'Personal Tax',
          tags: '',
          source: '',
        });
        // Reload stats
        await loadStats();
        alert('Article added successfully!');
      } else {
        alert('Error adding article');
      }
    } catch (error) {
      console.error('Error adding article:', error);
      alert('Error adding article');
    } finally {
      setLoading(false);
    }
  };

  const handleBuildGraph = async () => {
    if (!confirm('This will rebuild the knowledge graph. This may take a few minutes.')) return;

    setLoading(true);
    try {
      const response = await fetch('/api/knowledge/build-graph', { method: 'POST' });
      if (response.ok) {
        alert('Knowledge graph built successfully!');
        await loadStats();
      } else {
        alert('Error building knowledge graph');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error building knowledge graph');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit Article</DialogTitle>
              <DialogDescription>
                Updating content will automatically regenerate embeddings for search.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <Input
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <Select
                    value={editForm.category}
                    onValueChange={(value) => setEditForm({ ...editForm, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Personal Tax">Personal Tax</SelectItem>
                      <SelectItem value="Corporate Tax">Corporate Tax</SelectItem>
                      <SelectItem value="VAT">VAT</SelectItem>
                      <SelectItem value="Capital Gains">Capital Gains</SelectItem>
                      <SelectItem value="Tax Reform">Tax Reform</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Summary</label>
                <Textarea
                  value={editForm.summary}
                  onChange={(e) => setEditForm({ ...editForm, summary: e.target.value })}
                  rows={3}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                <Textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  rows={10}
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Source</label>
                  <Input
                    value={editForm.source}
                    onChange={(e) => setEditForm({ ...editForm, source: e.target.value })}
                    disabled={loading}
                    placeholder="FIRS, Tax Code Trust, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Source URL</label>
                  <Input
                    value={editForm.sourceUrl}
                    onChange={(e) => setEditForm({ ...editForm, sourceUrl: e.target.value })}
                    disabled={loading}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
                  <Input
                    value={editForm.author}
                    onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                    disabled={loading}
                    placeholder="Admin / Editor"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma-separated)</label>
                  <Input
                    value={editForm.tags}
                    onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                    disabled={loading}
                    placeholder="vat, filing, pita"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">Active in answers</p>
                  <p className="text-xs text-slate-600">Inactive articles will not be retrieved for RAG answers.</p>
                </div>
                <Button
                  type="button"
                  variant={editForm.isActive ? 'secondary' : 'default'}
                  onClick={() => setEditForm({ ...editForm, isActive: !editForm.isActive })}
                  disabled={loading}
                >
                  <Power className="h-4 w-4 mr-2" />
                  {editForm.isActive ? 'Set Inactive' : 'Set Active'}
                </Button>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="destructive"
                onClick={() => confirmDelete(selectedArticle)}
                disabled={loading || !selectedArticle?.id}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <div className="flex-1" />
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button type="button" onClick={saveEdit} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete article?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove <span className="font-medium">{selectedArticle?.title}</span> from the database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={doDelete} disabled={loading}>
                {loading ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Knowledge Base Manager</h1>
            <p className="text-slate-600 mt-2">Manage articles, embeddings, and AI training</p>
          </div>
          <Button onClick={loadStats} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalArticles || 0}</div>
                <p className="text-xs text-slate-500 mt-1">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Active Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{stats.activeArticles || 0}</div>
                <p className="text-xs text-slate-500 mt-1">Published</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Most Viewed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.mostViewed?.[0]?.viewCount || 0}</div>
                <p className="text-xs text-slate-500 mt-1">{stats.mostViewed?.[0]?.title}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Most Helpful</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.mostHelpful?.[0]?.helpfulCount || 0}</div>
                <p className="text-xs text-slate-500 mt-1">{stats.mostHelpful?.[0]?.title}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="add">Add Article</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Articles by Category</CardTitle>
                <CardDescription>Distribution of knowledge base content</CardDescription>
              </CardHeader>
              <CardContent>
                {stats?.byCategory && stats.byCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats.byCategory}
                        dataKey="_count"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {stats.byCategory.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-slate-500 text-center py-8">No data available</p>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Articles</CardTitle>
                  <CardDescription>Latest additions to knowledge base</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats?.recentAdditions?.slice(0, 5).map((article: any) => (
                      <div key={article.id} className="p-2 bg-slate-50 rounded-lg">
                        <p className="font-medium text-sm text-slate-900">{article.title}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(article.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Rated</CardTitle>
                  <CardDescription>Most helpful articles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats?.mostHelpful?.slice(0, 5).map((article: any) => (
                      <div key={article.id} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                        <p className="font-medium text-sm text-slate-900 flex-1">{article.title}</p>
                        <Badge variant="secondary">{article.helpfulCount}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Search Knowledge Base</CardTitle>
                <CardDescription>Semantic and keyword search</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      disabled={loading}
                    />
                    <Button type="submit" disabled={loading}>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-slate-900">Include inactive</p>
                      <p className="text-xs text-slate-600">Lets admins find and reactivate retired articles.</p>
                    </div>
                    <Button
                      type="button"
                      variant={includeInactive ? 'default' : 'secondary'}
                      onClick={() => setIncludeInactive(!includeInactive)}
                      disabled={loading}
                    >
                      {includeInactive ? 'On' : 'Off'}
                    </Button>
                  </div>
                </form>

                {searchResults.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h3 className="font-semibold text-slate-900">{searchResults.length} Results</h3>
                    {searchResults.map((result: any) => (
                      <Card key={result.id} className="border-slate-200">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900">{result.title}</h4>
                              <p className="text-sm text-slate-600 mt-1">{result.summary}</p>
                              <div className="flex flex-wrap gap-2 mt-3">
                                <Badge>{result.category}</Badge>
                                {typeof result.isActive === 'boolean' && (
                                  <Badge variant={result.isActive ? 'secondary' : 'destructive'}>
                                    {result.isActive ? 'Active' : 'Inactive'}
                                  </Badge>
                                )}
                                {result.similarity !== undefined && result.similarity !== null && (
                                  <Badge variant="outline">
                                    Relevance: {(Number(result.similarity) * 100).toFixed(0)}%
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => openEdit(result.id)}
                                disabled={loading}
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => toggleActive(result.id, !(result.isActive ?? true))}
                                disabled={loading}
                              >
                                <Power className="h-4 w-4 mr-2" />
                                {(result.isActive ?? true) ? 'Deactivate' : 'Activate'}
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => confirmDelete(result)}
                                disabled={loading}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {searchQuery && searchResults.length === 0 && !loading && (
                  <Alert className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>No results found. Try different keywords.</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add Article Tab */}
          <TabsContent value="add" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add New Article</CardTitle>
                <CardDescription>Add an article to the knowledge base</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddArticle} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                    <Input
                      value={newArticle.title}
                      onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                      placeholder="Article title"
                      disabled={loading}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                    <Textarea
                      value={newArticle.content}
                      onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                      placeholder="Full article content"
                      rows={8}
                      disabled={loading}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Summary</label>
                    <Textarea
                      value={newArticle.summary}
                      onChange={(e) => setNewArticle({ ...newArticle, summary: e.target.value })}
                      placeholder="Brief summary"
                      rows={3}
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                      <Select
                        value={newArticle.category}
                        onValueChange={(value) => setNewArticle({ ...newArticle, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Personal Tax">Personal Tax</SelectItem>
                          <SelectItem value="Corporate Tax">Corporate Tax</SelectItem>
                          <SelectItem value="VAT">VAT</SelectItem>
                          <SelectItem value="Capital Gains">Capital Gains</SelectItem>
                          <SelectItem value="Tax Reform">Tax Reform</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Source</label>
                      <Input
                        value={newArticle.source}
                        onChange={(e) => setNewArticle({ ...newArticle, source: e.target.value })}
                        placeholder="FIRS, Tax Code Trust, etc."
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma-separated)</label>
                    <Input
                      value={newArticle.tags}
                      onChange={(e) => setNewArticle({ ...newArticle, tags: e.target.value })}
                      placeholder="tax, personal income, PITA"
                      disabled={loading}
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    {loading ? 'Adding...' : 'Add Article'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Article Performance</CardTitle>
                <CardDescription>Views and helpfulness trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={stats?.mostViewed || []}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="title" width={150} />
                    <Tooltip />
                    <Bar dataKey="viewCount" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Tools</CardTitle>
                <CardDescription>Advanced knowledge base operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <BarChart3 className="h-4 w-4" />
                  <AlertDescription>
                    Build knowledge graph to create connections between related articles
                  </AlertDescription>
                </Alert>

                <Button onClick={handleBuildGraph} disabled={loading} className="w-full">
                  {loading ? 'Building...' : 'Build Knowledge Graph'}
                </Button>

                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    Embed all articles for semantic search capability
                  </AlertDescription>
                </Alert>

                <Button disabled={loading} className="w-full">
                  {loading ? 'Embedding...' : 'Embed All Articles'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
