"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, TrendingUp, Clock, Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Question {
  id: string;
  title: string;
  body: string;
  category: string;
  tags: string[];
  urgency: string;
  views: number;
  status: string;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    username: string | null;
    level: number;
    isVerified: boolean;
  };
  _count: {
    answers: number;
    votes: number;
  };
}

export default function CommunityPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [trending, setTrending] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchQuestions();
    fetchTrending();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/community/questions?sort=newest&limit=10");
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrending = async () => {
    try {
      const res = await fetch("/api/community/questions/trending?limit=5");
      const data = await res.json();
      setTrending(data.questions || []);
    } catch (error) {
      console.error("Error fetching trending:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchQuestions();
      return;
    }

    try {
      const res = await fetch(`/api/community/questions/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tax Code Community</h1>
          <p className="text-muted-foreground">
            Ask questions, share knowledge, and help others navigate Nigerian tax law
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
          <Link href="/community/ask">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ask Question
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Recent Questions</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Newest</Button>
                <Button variant="outline" size="sm">Trending</Button>
                <Button variant="outline" size="sm">Unanswered</Button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : questions.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No questions found. Be the first to ask!
                </CardContent>
              </Card>
            ) : (
              questions.map((question) => (
                <Card key={question.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link href={`/community/questions/${question.id}`}>
                          <CardTitle className="text-lg hover:text-primary cursor-pointer">
                            {question.title}
                          </CardTitle>
                        </Link>
                        <CardDescription className="mt-2 line-clamp-2">
                          {question.body}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {question._count.answers} answers
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(question.createdAt).toLocaleDateString()}
                        </div>
                        <div>{question.views} views</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{question.category}</Badge>
                        {question.urgency === "urgent" && (
                          <Badge variant="destructive">Urgent</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="text-sm text-muted-foreground">
                        by {question.author.name || question.author.username || "Anonymous"}
                      </div>
                      {question.author.isVerified && (
                        <Badge variant="outline" className="text-xs">Verified</Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        Level {question.author.level}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Trending */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trending Now
                </CardTitle>
              </CardHeader>
              <CardContent>
                {trending.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No trending questions yet</p>
                ) : (
                  <div className="space-y-3">
                    {trending.map((q) => (
                      <Link
                        key={q.id}
                        href={`/community/questions/${q.id}`}
                        className="block text-sm hover:text-primary"
                      >
                        <div className="font-medium line-clamp-2">{q.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {q.views} views • {q._count.answers} answers
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Community Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Questions</span>
                    <span className="font-medium">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Answers</span>
                    <span className="font-medium">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Users</span>
                    <span className="font-medium">-</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


