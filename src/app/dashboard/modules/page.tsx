
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FilePlus,
  Filter,
  Search,
  BookOpen,
  Calendar,
  MoreVertical,
  Pencil,
  Trash2,
  View,
  LoaderCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { deleteTrainingModule, getTrainingModules, type TrainingModule } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';

const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'published':
      return 'default';
    case 'draft':
      return 'secondary';
    case 'archived':
      return 'outline';
    default:
      return 'default';
  }
};

export default function ModuleManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadModules() {
      setIsLoading(true);
      const result = await getTrainingModules();
      if (result.success && result.data) {
        setModules(result.data);
      } else {
        setError(result.error || 'An unexpected error occurred.');
      }
      setIsLoading(false);
    }
    loadModules();
  }, []);

  async function handleDelete(moduleId?: string) {
    if (!moduleId) return;
    const ok = confirm('Delete this module? This will also remove its synced AI KB entry if present.');
    if (!ok) return;
    setIsLoading(true);
    const res = await deleteTrainingModule(moduleId);
    if (res.success) {
      const refreshed = await getTrainingModules();
      if (refreshed.success && refreshed.data) setModules(refreshed.data);
    } else {
      setError(res.error || 'Failed to delete module.');
    }
    setIsLoading(false);
  }

  const filteredModules = useMemo(() => {
    return modules.filter((module) =>
      module.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, modules]);

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-background flex-1">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-foreground">
            Training Modules
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage, filter, and create new training modules.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/modules/new">
            <FilePlus className="mr-2" />
            Create Module
          </Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search modules by title..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>All</DropdownMenuItem>
                <DropdownMenuItem>Published</DropdownMenuItem>
                <DropdownMenuItem>Draft</DropdownMenuItem>
                <DropdownMenuItem>Archived</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                 <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredModules.map((module) => (
            <Card
              key={module.id}
              className="flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="font-headline text-lg text-foreground pr-4">
                    {module.title}
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        <Link href={`/dashboard/modules/${module.id}/edit`}>Edit</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <View className="mr-2 h-4 w-4" />
                        <Link href={`/academy/modules/${module.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(module.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                 <Badge variant={getStatusBadgeVariant(module.status)} className="w-fit">{module.status}</Badge>
              </CardHeader>
              <CardContent className="flex-grow space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>{module.content.length} topics</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{module.dates}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/dashboard/modules/${module.id}/edit`}>Edit Module</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {(!isLoading && filteredModules.length === 0) && (
          <div className="col-span-full text-center py-16 text-muted-foreground">
              <Search className="mx-auto h-12 w-12 mb-4" />
              <h3 className="text-xl font-semibold">No modules found</h3>
              <p>Try adjusting your search or create a new module.</p>
          </div>
      )}

      {error && (
         <div className="col-span-full text-center py-16 text-destructive">
            <h3 className="text-xl font-semibold">An Error Occurred</h3>
            <p>{error}</p>
        </div>
      )}
    </div>
  );
}
