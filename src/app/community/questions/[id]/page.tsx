"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  LoaderCircle,
  ArrowLeft,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  Tag
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";

interface Question {
  id: string;
  title: string;
  body: string;
  category: string;
  tags: string[];
  urgency: string;
  status: string;
  views: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatarUrl?: string;
    level: number;
    isVerified: boolean;
  };
  answers: Answer[];
  _count: {
    answers: number;
  };
}

interface Answer {
  id: string;
  body: string;
  upvotes: number;
  downvotes: number;
  isVerified: boolean;
  createdAt: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatarUrl?: string;
    level: number;
    isVerified: boolean;
  };
}

export default function QuestionPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [answerBody, setAnswerBody] = useState("");
  const [votingAnswer, setVotingAnswer] = useState<string | null>(null);

  const questionId = params?.id as string;

  useEffect(() => {
    fetchQuestion();
  }, [questionId]);

  const fetchQuestion = async () => {
    try {
      const response = await fetch(`/api/community/questions/${questionId}`);
      if (!response.ok) {
        if (response.status === 404) {
          router.push("/community");
          return;
        }
        throw new Error("Failed to fetch question");
      }
      const data = await response.json();
      setQuestion(data.question);
    } catch (error) {
      console.error("Error fetching question:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load question. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!answerBody.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please write an answer before submitting.",
      });
      return;
    }

    setSubmittingAnswer(true);

    try {
      const response = await fetch(`/api/community/questions/${questionId}/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: answerBody,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            variant: "destructive",
            title: "Authentication Required",
            description: "Please sign in to answer questions.",
          });
          router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
          return;
        }
        throw new Error(data.error || "Failed to post answer");
      }

      toast({
        title: "Answer Posted!",
        description: "Your answer has been posted successfully.",
      });

      setAnswerBody("");
      // Refresh the question to show the new answer
      fetchQuestion();
    } catch (error: any) {
      console.error("Error posting answer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to post answer. Please try again.",
      });
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleVote = async (answerId: string, voteType: "up" | "down") => {
    setVotingAnswer(answerId);

    try {
      const response = await fetch(`/api/community/answers/${answerId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ voteType }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401) {
          toast({
            variant: "destructive",
            title: "Authentication Required",
            description: "Please sign in to vote on answers.",
          });
          router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
          return;
        }
        throw new Error(data.error || "Failed to vote");
      }

      // Refresh the question to show updated vote counts
      fetchQuestion();
    } catch (error: any) {
      console.error("Error voting:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to vote. Please try again.",
      });
    } finally {
      setVotingAnswer(null);
    }
  };

  const getUserInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading question...</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Question Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The question you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/community">
            <Button>Back to Community</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/community"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Community
          </Link>
        </div>

        {/* Question */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={question.urgency === "urgent" ? "destructive" : "secondary"}>
                    {question.urgency === "urgent" && <AlertCircle className="h-3 w-3 mr-1" />}
                    {question.category}
                  </Badge>
                  <Badge variant="outline">{question.status}</Badge>
                  {question.urgency === "urgent" && (
                    <Badge variant="destructive">Urgent</Badge>
                  )}
                </div>
                <CardTitle className="text-2xl mb-4">{question.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{question.views} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{question._count.answers} answers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(question.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-gray dark:prose-invert max-w-none mb-6">
              <p className="whitespace-pre-wrap">{question.body}</p>
            </div>

            {question.tags.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t">
              <Avatar className="h-10 w-10">
                <AvatarImage src={question.author.avatarUrl} alt={question.author.name} />
                <AvatarFallback>
                  {getUserInitials(question.author.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{question.author.name}</span>
                  {question.author.username && (
                    <span className="text-sm text-muted-foreground">
                      @{question.author.username}
                    </span>
                  )}
                  {question.author.isVerified && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Level {question.author.level}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answers */}
        <div className="space-y-6 mb-8">
          <h2 className="text-xl font-semibold">
            {question._count.answers} Answer{question._count.answers !== 1 ? "s" : ""}
          </h2>

          {question.answers.map((answer) => (
            <Card key={answer.id}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  {/* Vote buttons */}
                  <div className="flex flex-col items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(answer.id, "up")}
                      disabled={votingAnswer === answer.id || !user}
                      className="h-8 w-8 p-0"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">
                      {answer.upvotes - answer.downvotes}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(answer.id, "down")}
                      disabled={votingAnswer === answer.id || !user}
                      className="h-8 w-8 p-0"
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Answer content */}
                  <div className="flex-1">
                    <div className="prose prose-gray dark:prose-invert max-w-none mb-4">
                      <p className="whitespace-pre-wrap">{answer.body}</p>
                    </div>

                    {/* Answer author */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={answer.author.avatarUrl} alt={answer.author.name} />
                          <AvatarFallback className="text-xs">
                            {getUserInitials(answer.author.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{answer.author.name}</span>
                            {answer.author.username && (
                              <span className="text-xs text-muted-foreground">
                                @{answer.author.username}
                              </span>
                            )}
                            {answer.author.isVerified && (
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            )}
                            {answer.isVerified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified Answer
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Level {answer.author.level} • {formatDate(answer.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {question._count.answers === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No answers yet</h3>
                <p className="text-muted-foreground">
                  Be the first to answer this question and help the community!
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Answer Form */}
        {user ? (
          <Card>
            <CardHeader>
              <CardTitle>Your Answer</CardTitle>
              <CardDescription>
                Share your knowledge and help others in the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitAnswer}>
                <Textarea
                  placeholder="Write your answer here..."
                  value={answerBody}
                  onChange={(e) => setAnswerBody(e.target.value)}
                  rows={6}
                  className="mb-4"
                  required
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={submittingAnswer}>
                    {submittingAnswer ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      "Post Answer"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Sign in to answer</h3>
              <p className="text-muted-foreground mb-4">
                Join the community to share your knowledge and help others.
              </p>
              <Button asChild>
                <Link href={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}>
                  Sign In to Answer
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}