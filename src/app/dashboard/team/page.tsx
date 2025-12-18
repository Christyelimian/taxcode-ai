
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserRolesManagement from '@/components/user-roles-management';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, UserPlus, Trash2, LoaderCircle, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getTeamMembers, addTeamMember, removeTeamMember, updateTeamMember, type TeamMember } from '@/app/actions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

const facultyRoles = [
  'Lead Facilitator',
  'Training Coordinator',
  'Curriculum and Content Development',
  'Corporate and Legal Services',
  'Economist and Human Capital Strategist',
  'Policy and Strategy Desk',
  'Business Strategist',
  'Business Development',
  'Operations and Logistics',
  'Admin',
  'Member'
] as const;

const memberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email.'),
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  image: z.string().url('Please enter a valid image URL.').or(z.literal('')),
  role: z.enum(facultyRoles),
});

type MemberFormValues = z.infer<typeof memberSchema>;

export default function FacultyManagementPage() {
  const { toast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: '',
      email: '',
      title: '',
      image: '',
      role: 'Member',
    },
  });

  const fetchMembers = async () => {
    setIsLoading(true);
    const result = await getTeamMembers();
    if (result.success && result.data) {
      setMembers(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (editingMember) {
      form.reset(editingMember);
      setIsEditDialogOpen(true);
    } else {
      form.reset({
        name: '',
        email: '',
        title: '',
        image: '',
        role: 'Member',
      });
    }
  }, [editingMember, form]);

  const handleAddMember = async (values: MemberFormValues) => {
    setIsSubmitting(true);
    const result = await addTeamMember(values);
    if (result.success) {
      toast({
        title: 'Faculty Member Added',
        description: `${values.name} has been added to the faculty.`,
      });
      fetchMembers();
      setIsAddDialogOpen(false);
      form.reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to Add Member',
        description: result.error,
      });
    }
    setIsSubmitting(false);
  };

  const handleUpdateMember = async (values: MemberFormValues) => {
    if (!editingMember?.id) return;

    setIsSubmitting(true);
    const result = await updateTeamMember(editingMember.id, values);
    if (result.success) {
        toast({
            title: 'Faculty Member Updated',
            description: `${values.name}'s profile has been updated.`,
        });
        fetchMembers();
        closeEditDialog();
    } else {
        toast({
            variant: 'destructive',
            title: 'Failed to Update Member',
            description: result.error,
        });
    }
    setIsSubmitting(false);
};

  const handleRemoveMember = async (memberId: string) => {
    const result = await removeTeamMember(memberId);
    if (result.success) {
      toast({
        title: 'Faculty Member Removed',
        description: `The member has been removed from the faculty.`,
      });
      fetchMembers();
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to Remove Member',
        description: result.error,
      });
    }
  };

  const openEditDialog = (member: TeamMember) => {
    setEditingMember(member);
  };

  const closeEditDialog = () => {
    setEditingMember(null);
    setIsEditDialogOpen(false);
  }

  const MemberForm = ({ onSubmit }: { onSubmit: (values: MemberFormValues) => void }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Lead Facilitator" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="e.g., jane@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://placehold.co/128x128.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {facultyRoles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={editingMember ? closeEditDialog : () => setIsAddDialogOpen(false)}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            {editingMember ? 'Save Changes' : 'Add Member'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
  

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <Tabs defaultValue="faculty" className="w-full">
        <TabsList>
          <TabsTrigger value="faculty">Faculty Management</TabsTrigger>
          <TabsTrigger value="roles">User Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="faculty">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Faculty Management</CardTitle>
                <CardDescription>
                  Add, remove, and manage your faculty members and experts.
                </CardDescription>
              </div>
               <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Faculty
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Add a new faculty member</DialogTitle>
                      <DialogDescription>
                        This information will be displayed on the homepage.
                      </DialogDescription>
                    </DialogHeader>
                     <MemberForm onSubmit={handleAddMember} />
                  </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    [...Array(3)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-[150px]" />
                              <Skeleton className="h-3 w-[200px]" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : members.length > 0 ? (
                    members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={member.image} data-ai-hint="headshot" alt={member.name} />
                              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {member.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                         <TableCell className="text-muted-foreground">{member.title}</TableCell>
                        <TableCell>
                          <Badge variant={member.role === 'Admin' ? 'default' : 'secondary'}>{member.role}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {member.createdAt ? formatDistanceToNow(new Date(member.createdAt), { addSuffix: true }) : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                               <DropdownMenuItem onClick={() => openEditDialog(member)}>
                                 <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => member.id && handleRemoveMember(member.id)}
                                disabled={!member.id}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No faculty members found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Faculty Member</DialogTitle>
                <DialogDescription>
                  Update the details for {editingMember?.name}.
                </DialogDescription>
              </DialogHeader>
              <MemberForm onSubmit={handleUpdateMember} />
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="roles">
          <UserRolesManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
