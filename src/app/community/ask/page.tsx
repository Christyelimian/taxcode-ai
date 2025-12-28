"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { LoaderCircle, ArrowLeft, Tag, AlertCircle } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/components/auth-provider";

const categories = [
  "Personal Tax",
  "Corporate Tax",
  "VAT",
  "Withholding Tax",
  "Capital Gains Tax",
  "Stamp Duty",
  "Education Tax",
  "Legal",
  "Other",
];

export default function AskQuestionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    category: "",
    tags: [] as string[],
    urgency: "normal",
  });
  const [tagInput, setTagInput] = useState("");

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated using community-specific auth check
        const response = await fetch("/api/community/auth-check");
        if (!response.ok) {
          // Not authenticated, redirect to login
          router.push(`/login?redirect=${encodeURIComponent("/community/ask")}`);
          return;
        }
        setCheckingAuth(false);
      } catch (error) {
        // Not authenticated, redirect to login
        router.push(`/login?redirect=${encodeURIComponent("/community/ask")}`);
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.body.trim() || !formData.category) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in the title, body, and category fields.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/community/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          body: formData.body,
          category: formData.category,
          tags: formData.tags,
          urgency: formData.urgency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized - redirect to login
          toast({
            variant: "destructive",
            title: "Authentication Required",
            description: "Please sign in to ask a question.",
          });
          router.push(`/login?redirect=${encodeURIComponent("/community/ask")}`);
          return;
        }
        throw new Error(data.error || "Failed to create question");
      }

      toast({
        title: "Question Posted!",
        description: "Your question has been posted successfully.",
      });

      router.push(`/community/questions/${data.question.id}`);
    } catch (error: any) {
      console.error("Error creating question:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to post question. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  // Show loading state while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoaderCircle className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Checking authentication...</p>
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
          <h1 className="text-4xl font-bold mb-2">Ask a Question</h1>
          <p className="text-muted-foreground">
            Get help from the TaxCode community. Be specific and clear for the best answers.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            {/* Title */}
            <Card>
              <CardHeader>
                <CardTitle>Question Title</CardTitle>
                <CardDescription>
                  Write a clear, specific title that summarizes your question
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="e.g., How do I calculate VAT on imported services?"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  maxLength={200}
                  required
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {formData.title.length}/200 characters
                </p>
              </CardContent>
            </Card>

            {/* Category */}
            <Card>
              <CardHeader>
                <CardTitle>Category</CardTitle>
                <CardDescription>Select the most relevant category for your question</CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Question Body */}
            <Card>
              <CardHeader>
                <CardTitle>Question Details</CardTitle>
                <CardDescription>
                  Provide context, background information, and any relevant details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Describe your question in detail. Include any relevant context, what you've already tried, or specific scenarios..."
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  rows={10}
                  className="min-h-[200px]"
                  required
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Minimum 20 characters. Be as detailed as possible for better answers.
                </p>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
                <CardDescription>
                  Add up to 5 tags to help others find your question (optional)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="e.g., vat, imports, services"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    disabled={formData.tags.length >= 5}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTag}
                    disabled={formData.tags.length >= 5 || !tagInput.trim()}
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    Add Tag
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                )}
                {formData.tags.length >= 5 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Maximum 5 tags reached
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Urgency */}
            <Card>
              <CardHeader>
                <CardTitle>Urgency</CardTitle>
                <CardDescription>How urgent is your question?</CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={formData.urgency}
                  onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="urgent">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        Urgent
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {formData.urgency === "urgent" && (
                  <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                      <div className="text-sm text-destructive">
                        <p className="font-medium">Use urgent only for time-sensitive questions</p>
                        <p className="text-muted-foreground mt-1">
                          Urgent questions are highlighted but should be reserved for situations requiring immediate attention.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-base">Tips for getting good answers</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Be specific about your situation and what you need help with</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Include relevant details like business type, amounts, or deadlines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Search existing questions first to avoid duplicates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Use clear, professional language</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex items-center justify-between gap-4">
              <Link href="/community">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={loading} className="min-w-[120px]">
                {loading ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post Question"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}




