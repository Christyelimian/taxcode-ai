"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Video,
  FileText,
  Plus,
  Save,
  Eye,
  Trash2,
  LoaderCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface LessonContent {
  id?: string;
  moduleId: string;
  lessonIndex: number;
  title: string;
  content: string;
  summary?: string;
  contentType?: string;
  videoUrl?: string;
  videoDuration?: number;
  hasQuiz?: boolean;
  quizData?: any;
  resources?: Array<{ type: string; title: string; url: string }>;
  estimatedMinutes?: number;
  difficulty?: string;
}

interface LessonContentEditorProps {
  moduleId: string;
  lessonTopics: string[]; // Array of topic titles from module.content
}

export function LessonContentEditor({
  moduleId,
  lessonTopics,
}: LessonContentEditorProps) {
  const { toast } = useToast();
  const [lessons, setLessons] = useState<LessonContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [expandedLessons, setExpandedLessons] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadLessons();
  }, [moduleId]);

  async function loadLessons() {
    try {
      setLoading(true);
      const res = await fetch(`/api/lessons/module/${moduleId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setLessons(data.lessons);
        }
      }
    } catch (error) {
      console.error("Error loading lessons:", error);
    } finally {
      setLoading(false);
    }
  }

  function initializeLessons() {
    const initialized: LessonContent[] = lessonTopics.map((topic, index) => {
      const existing = lessons.find((l) => l.lessonIndex === index);
      return (
        existing || {
          moduleId,
          lessonIndex: index,
          title: topic,
          content: "",
          contentType: "markdown",
          hasQuiz: false,
          estimatedMinutes: 5,
          difficulty: "beginner",
        }
      );
    });
    setLessons(initialized);
  }

  async function saveLesson(lessonIndex: number) {
    const lesson = lessons[lessonIndex];
    if (!lesson) return;

    try {
      setSaving(`${lessonIndex}`);
      const res = await fetch("/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lesson),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save lesson");
      }

      toast({
        title: "Lesson saved",
        description: `Lesson ${lessonIndex + 1} content has been saved.`,
      });

      await loadLessons();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save lesson",
      });
    } finally {
      setSaving(null);
    }
  }

  function updateLesson(index: number, updates: Partial<LessonContent>) {
    setLessons((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
  }

  function toggleLesson(index: number) {
    setExpandedLessons((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }

  function addResource(lessonIndex: number) {
    const lesson = lessons[lessonIndex];
    if (!lesson) return;

    const newResource = { type: "link", title: "", url: "" };
    updateLesson(lessonIndex, {
      resources: [...(lesson.resources || []), newResource],
    });
  }

  function removeResource(lessonIndex: number, resourceIndex: number) {
    const lesson = lessons[lessonIndex];
    if (!lesson || !lesson.resources) return;

    updateLesson(lessonIndex, {
      resources: lesson.resources.filter((_, i) => i !== resourceIndex),
    });
  }

  function updateResource(
    lessonIndex: number,
    resourceIndex: number,
    updates: Partial<{ type: string; title: string; url: string }>
  ) {
    const lesson = lessons[lessonIndex];
    if (!lesson || !lesson.resources) return;

    const updated = lesson.resources.map((r, i) =>
      i === resourceIndex ? { ...r, ...updates } : r
    );
    updateLesson(lessonIndex, { resources: updated });
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading lesson content...</p>
        </CardContent>
      </Card>
    );
  }

  // Initialize lessons from topics if not loaded
  if (lessons.length === 0 && lessonTopics.length > 0) {
    initializeLessons();
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Lesson Content</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Add detailed content for each lesson. Content will be displayed to learners.
            </p>
          </div>
          {lessons.length === 0 && lessonTopics.length > 0 && (
            <Button onClick={initializeLessons} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Initialize Lessons
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {lessons.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No lesson content yet.</p>
            <p className="text-sm mt-2">
              Add topics to the module first, then initialize lesson content.
            </p>
          </div>
        ) : (
          lessons.map((lesson, index) => {
            const isExpanded = expandedLessons.has(index);
            const hasContent = lesson.content.trim().length > 0;

            return (
              <Collapsible
                key={index}
                open={isExpanded}
                onOpenChange={() => toggleLesson(index)}
              >
                <Card>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                          <div className="text-left">
                            <CardTitle className="text-base">
                              Lesson {index + 1}: {lesson.title}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              {hasContent && (
                                <Badge variant="secondary" className="text-xs">
                                  <FileText className="h-3 w-3 mr-1" />
                                  Content
                                </Badge>
                              )}
                              {lesson.videoUrl && (
                                <Badge variant="secondary" className="text-xs">
                                  <Video className="h-3 w-3 mr-1" />
                                  Video
                                </Badge>
                              )}
                              {lesson.hasQuiz && (
                                <Badge variant="secondary" className="text-xs">
                                  Quiz
                                </Badge>
                              )}
                              {lesson.resources && lesson.resources.length > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  {lesson.resources.length} Resources
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            saveLesson(index);
                          }}
                          disabled={saving === `${index}`}
                        >
                          {saving === `${index}` ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save
                            </>
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="space-y-6 pt-0">
                      {/* Basic Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`summary-${index}`}>Summary / Learning Objective</Label>
                          <Textarea
                            id={`summary-${index}`}
                            rows={3}
                            placeholder="What will learners gain from this lesson?"
                            value={lesson.summary || ""}
                            onChange={(e) =>
                              updateLesson(index, { summary: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor={`minutes-${index}`}>Estimated Minutes</Label>
                            <Input
                              id={`minutes-${index}`}
                              type="number"
                              min="1"
                              value={lesson.estimatedMinutes || 5}
                              onChange={(e) =>
                                updateLesson(index, {
                                  estimatedMinutes: parseInt(e.target.value) || 5,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor={`difficulty-${index}`}>Difficulty</Label>
                            <Select
                              value={lesson.difficulty || "beginner"}
                              onValueChange={(value) =>
                                updateLesson(index, { difficulty: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Content */}
                      <div>
                        <Label htmlFor={`content-${index}`}>Lesson Content (Markdown)</Label>
                        <Textarea
                          id={`content-${index}`}
                          rows={12}
                          placeholder="# Lesson Title

## Introduction
Write your lesson content here using Markdown...

- Use **bold** and *italic* text
- Create lists
- Add code blocks
- Include links

## Key Concepts
Explain the main concepts..."
                          value={lesson.content}
                          onChange={(e) =>
                            updateLesson(index, { content: e.target.value })
                          }
                          className="font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Supports Markdown formatting. Use # for headings, ** for bold, * for italic.
                        </p>
                      </div>

                      <Separator />

                      {/* Video */}
                      <div>
                        <Label htmlFor={`video-${index}`}>Video URL (Optional)</Label>
                        <div className="flex gap-2">
                          <Input
                            id={`video-${index}`}
                            type="url"
                            placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                            value={lesson.videoUrl || ""}
                            onChange={(e) =>
                              updateLesson(index, { videoUrl: e.target.value })
                            }
                          />
                          {lesson.videoUrl && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => updateLesson(index, { videoUrl: "" })}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Supports YouTube and Vimeo URLs
                        </p>
                      </div>

                      <Separator />

                      {/* Resources */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Resources</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addResource(index)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Resource
                          </Button>
                        </div>
                        {lesson.resources && lesson.resources.length > 0 ? (
                          <div className="space-y-2">
                            {lesson.resources.map((resource, resIndex) => (
                              <div
                                key={resIndex}
                                className="flex gap-2 p-3 border rounded-lg"
                              >
                                <Select
                                  value={resource.type}
                                  onValueChange={(value) =>
                                    updateResource(index, resIndex, { type: value })
                                  }
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="link">Link</SelectItem>
                                    <SelectItem value="pdf">PDF</SelectItem>
                                    <SelectItem value="video">Video</SelectItem>
                                    <SelectItem value="document">Document</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Input
                                  placeholder="Resource title"
                                  value={resource.title}
                                  onChange={(e) =>
                                    updateResource(index, resIndex, { title: e.target.value })
                                  }
                                  className="flex-1"
                                />
                                <Input
                                  placeholder="URL"
                                  type="url"
                                  value={resource.url}
                                  onChange={(e) =>
                                    updateResource(index, resIndex, { url: e.target.value })
                                  }
                                  className="flex-1"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeResource(index, resIndex)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No resources added yet. Click "Add Resource" to add PDFs, links, etc.
                          </p>
                        )}
                      </div>

                      {/* Quiz Toggle */}
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <Label htmlFor={`quiz-${index}`}>Include Quiz</Label>
                          <p className="text-xs text-muted-foreground">
                            Add interactive quiz questions (coming soon)
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant={lesson.hasQuiz ? "default" : "outline"}
                          onClick={() =>
                            updateLesson(index, { hasQuiz: !lesson.hasQuiz })
                          }
                        >
                          {lesson.hasQuiz ? "Quiz Enabled" : "Enable Quiz"}
                        </Button>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
