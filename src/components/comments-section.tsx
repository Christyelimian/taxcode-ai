'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { getComments, createComment, deleteComment } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Send, Trash2 } from 'lucide-react';

// Simple MessageIcon component to avoid import issues
interface MessageIconProps {
  className?: string;
}

function MessageIcon({ className }: MessageIconProps) {
  return (
    <div className={`w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary ${className || ''}`} />
  );
}
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Comment {
    id: string;
    authorName?: string;
    authorEmail?: string;
    content: string;
    createdAt: string;
    isOwner?: boolean;
}

interface CommentsSectionProps {
    contentId: string;
    contentType: 'insight' | 'news';
    isAuthenticated: boolean;
        currentUser?: {
        email: string;
        name?: string;
        image?: string;
    } | null;
}

export default function CommentsSection({ contentId, contentType, isAuthenticated, currentUser }: CommentsSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const fetchComments = async () => {
            const result = await getComments(contentId, contentType);
            if (result.success && result.data) {
                const commentsWithOwnership = result.data.map(comment => ({
                    ...comment,
                    isOwner: isAuthenticated && currentUser?.email === comment.authorEmail,
                }));
                setComments(commentsWithOwnership);
            }
        };

        fetchComments();
    }, [contentId, contentType, isAuthenticated, currentUser]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isAuthenticated) {
            toast({
                title: 'Authentication Required',
                description: 'Please log in to post comments.',
                variant: 'destructive',
            });
            return;
        }

        if (!newComment.trim()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await createComment({
                contentId,
                contentType,
                content: newComment.trim(),
                authorId: currentUser?.email,
                authorName: currentUser?.name || currentUser?.email,
                authorEmail: currentUser?.email,
            });

            if (result.success) {
                setNewComment('');
                toast({
                    title: 'Comment Posted',
                    description: 'Your comment has been submitted for approval.',
                });
                
                // Refresh comments
                const commentsResult = await getComments(contentId, contentType);
                if (commentsResult.success && commentsResult.data) {
                    const updatedComments = commentsResult.data.map(comment => ({
                        ...comment,
                        isOwner: isAuthenticated && currentUser?.email === comment.authorEmail,
                    }));
                    setComments(updatedComments);
                }
            } else {
                toast({
                    title: 'Error',
                    description: result.error || 'Failed to post comment.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to post comment. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        try {
            const result = await deleteComment(commentId);
            if (result.success) {
                setComments(prev => prev.filter(c => c.id !== commentId));
                toast({
                    title: 'Comment Deleted',
                    description: 'Your comment has been deleted.',
                });
            } else {
                toast({
                    title: 'Error',
                    description: result.error || 'Failed to delete comment.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete comment. Please try again.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <span className="text-sm font-medium">{comments.length}</span>
                        </div>
                        Comments ({comments.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {!isAuthenticated ? (
                        <div className="text-center py-8 border-2 border-dashed rounded-lg">
                            <div className="h-12 w-12 mx-auto text-muted-foreground mb-4 rounded-full bg-muted flex items-center justify-center">
                            <MessageCircle className="h-6 w-6" />
                        </div>
                            <p className="text-muted-foreground mb-4">
                                Please <Link href="/login" className="text-primary hover:underline">log in</Link> to post comments.
                            </p>
                            <Button asChild className="mx-auto">
                                <Link href="/login">Sign In</Link>
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Textarea
                                    placeholder={isAuthenticated ? "Share your thoughts on this content..." : "Please log in to comment"}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    disabled={!isAuthenticated || isSubmitting}
                                    rows={4}
                                    className="min-h-[100px]"
                                />
                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={!isAuthenticated || isSubmitting || !newComment.trim()}
                                        className="flex items-center gap-2"
                                    >
                                        <Send className="h-4 w-4" />
                                        {isSubmitting ? 'Posting...' : 'Post Comment'}
                                    </Button>
                                </div>
                            </div>
                            
                            {currentUser && (
                            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="text-sm font-medium">👤</span>
                                </div>
                            </div>
                                </div>
                            )}
                        </form>
                    )}
                </CardContent>
            </Card>

            {comments.length > 0 && (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <Card key={comment.id} className="bg-muted/30">
                            <CardContent className="pt-4">
                                <div className="flex items-start gap-3">
                                    <Avatar className="h-10 w-10">
                                        {comment.authorName && (
                                            <AvatarFallback className="text-xs">
                                                {comment.authorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-medium text-sm">{comment.authorName}</span>
                                            {comment.authorEmail && comment.authorEmail !== comment.authorName && (
                                                <span className="text-xs text-muted-foreground">
                                                    ({comment.authorEmail})
                                                </span>
                                            )}
                                            <span className="text-xs text-muted-foreground ml-auto">
                                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <div className="text-sm leading-relaxed">
                                            {comment.content.split('\n').map((paragraph, index) => (
                                                <p key={index}>{paragraph}</p>
                                            ))}
                                        </div>
                                        {comment.isOwner && (
                                            <div className="flex gap-2 mt-3">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => router.push(`/dashboard/edit-comment/${comment.id}`)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(comment.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                        </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </section>
    </div>
  );
}