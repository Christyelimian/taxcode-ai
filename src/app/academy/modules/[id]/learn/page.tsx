"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  Award,
  Sparkles,
  LoaderCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/hooks/use-toast";

const COURSE_HEADER_IMAGES = [
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=2400&q=80",
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=2400&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2400&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=2400&q=80",
];

function stableIndex(input: string, modulo: number) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h % modulo;
}

function headerImageFor(title: string) {
  return COURSE_HEADER_IMAGES[stableIndex(title, COURSE_HEADER_IMAGES.length)];
}

interface Lesson {
  index: number;
  title: string;
  isCompleted: boolean;
  completedAt?: string;
  timeSpent: number;
}

interface EnrollmentData {
  enrollment: {
    id: string;
    status: string;
    progressPercent: number;
    currentLessonIndex: number;
    xpEarned: number;
    badgeEarned: boolean;
    startedAt: string;
    completedAt?: string;
    lastAccessedAt: string;
  };
  lessons: Lesson[];
}

export default function LearnPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const moduleId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [module, setModule] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<EnrollmentData | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completing, setCompleting] = useState(false);
  const [lessonContent, setLessonContent] = useState<any>(null);
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push(`/login?redirect=/academy/modules/${moduleId}/learn`);
      return;
    }

    // Check learner role - the layout will handle redirect, but we can show a message
    checkLearnerAccess();
    loadData();
  }, [moduleId, user]);

  async function checkLearnerAccess() {
    // Layout handles access control, but we can show a helpful message if needed
    // The LearnerProtectedLayout will redirect if user doesn't have learner role
  }

  useEffect(() => {
    if (module && enrollment) {
      loadLessonContent(currentLessonIndex);
    }
  }, [moduleId, currentLessonIndex, module, enrollment]);

  async function loadData() {
    try {
      setLoading(true);

      // Load module details
      const moduleRes = await fetch(`/api/training-modules/${moduleId}`);
      if (!moduleRes.ok) {
        const errorData = await moduleRes.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to load module");
      }
      const moduleData = await moduleRes.json();
      if (!moduleData.success || !moduleData.data) {
        throw new Error("Module not found");
      }
      setModule(moduleData.data);

      // Check enrollment and load progress
      const progressRes = await fetch(`/api/learning/progress?moduleId=${moduleId}`);
      if (progressRes.status === 404) {
        // Not enrolled yet
        setEnrollment(null);
      } else if (progressRes.ok) {
        const progressData = await progressRes.json();
        setEnrollment(progressData);
        setCurrentLessonIndex(progressData.enrollment.currentLessonIndex);
      }
    } catch (error: any) {
      console.error("Error loading data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load course",
      });
    } finally {
      setLoading(false);
    }
  }

  async function loadLessonContent(lessonIndex: number) {
    try {
      setLoadingContent(true);
      const res = await fetch(`/api/lessons/${moduleId}/${lessonIndex}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setLessonContent(data.lesson);
        } else {
          setLessonContent(null); // No content available, will show placeholder
        }
      } else {
        setLessonContent(null); // No content available
      }
    } catch (error) {
      console.error("Error loading lesson content:", error);
      setLessonContent(null);
    } finally {
      setLoadingContent(false);
    }
  }

  async function handleEnroll() {
    try {
      setEnrolling(true);
      const res = await fetch("/api/learning/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to enroll");
      }

      const data = await res.json();
      toast({
        title: "Enrolled!",
        description: "You've successfully enrolled in this course.",
      });

      // Reload to get enrollment data
      await loadData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to enroll",
      });
    } finally {
      setEnrolling(false);
    }
  }

  async function handleCompleteLesson() {
    if (!enrollment) return;

    try {
      setCompleting(true);
      const currentLesson = module.content[currentLessonIndex];
      const res = await fetch("/api/learning/lesson-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId,
          lessonIndex: currentLessonIndex,
          lessonTitle: currentLesson,
          timeSpent: 300, // 5 minutes default
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to complete lesson");
      }

      const data = await res.json();
      toast({
        title: "Lesson completed!",
        description: `You earned ${data.xpAwarded} XP!`,
      });

      // Reload progress
      await loadData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to complete lesson",
      });
    } finally {
      setCompleting(false);
    }
  }

  function handleNextLesson() {
    if (!module) return;
    const nextIndex = currentLessonIndex + 1;
    if (nextIndex < module.content.length) {
      setCurrentLessonIndex(nextIndex);
      // Update progress
      fetch("/api/learning/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId,
          currentLessonIndex: nextIndex,
        }),
      });
    }
  }

  function handlePreviousLesson() {
    const prevIndex = currentLessonIndex - 1;
    if (prevIndex >= 0) {
      setCurrentLessonIndex(prevIndex);
      // Update progress
      fetch("/api/learning/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId,
          currentLessonIndex: prevIndex,
        }),
      });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!module) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Module not found</h1>
        <Button asChild>
          <Link href="/academy">Back to Academy</Link>
        </Button>
      </div>
    );
  }

  const totalLessons = module.content?.length ?? 0;
  const currentLesson = module.content?.[currentLessonIndex];
  const lessonProgress = enrollment?.lessons.find((l) => l.index === currentLessonIndex);
  const isLessonCompleted = lessonProgress?.isCompleted ?? false;

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/academy/modules/${moduleId}`}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Course
              </Link>
            </Button>
            {enrollment && (
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  {enrollment.enrollment.xpEarned} XP earned
                </div>
                {enrollment.enrollment.badgeEarned && (
                  <Badge variant="secondary">
                    <Award className="mr-1 h-3 w-3" />
                    Completed
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Main Content */}
          <div>
            {!enrollment ? (
              <Card className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Start Learning</h2>
                <p className="text-muted-foreground mb-6">
                  Enroll in this course to start your learning journey.
                </p>
                <Button onClick={handleEnroll} disabled={enrolling} size="lg">
                  {enrolling ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Enrolling...
                    </>
                  ) : (
                    "Enroll Now (Free)"
                  )}
                </Button>
              </Card>
            ) : (
              <>
                {/* Progress Bar */}
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Course Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {enrollment.enrollment.progressPercent}%
                      </span>
                    </div>
                    <Progress value={enrollment.enrollment.progressPercent} className="h-2" />
                    <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        Lesson {currentLessonIndex + 1} of {totalLessons}
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        {enrollment.lessons.filter((l) => l.isCompleted).length} completed
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Lesson Content */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          Lesson {currentLessonIndex + 1} of {totalLessons}
                        </Badge>
                        <CardTitle className="text-2xl mt-2">{currentLesson}</CardTitle>
                      </div>
                      {isLessonCompleted && (
                        <Badge className="bg-green-500">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {loadingContent ? (
                      <div className="flex items-center justify-center py-8">
                        <LoaderCircle className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : lessonContent ? (
                      <div className="space-y-6">
                        {lessonContent.summary && (
                          <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                            <p className="text-sm font-medium text-foreground mb-1">
                              Learning Objective
                            </p>
                            <p className="text-sm text-muted-foreground">{lessonContent.summary}</p>
                          </div>
                        )}

                        {lessonContent.videoUrl && (
                          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                            {(() => {
                              // Convert YouTube/Vimeo URLs to embed format
                              const videoUrl = lessonContent.videoUrl;
                              let embedUrl = videoUrl;
                              
                              // YouTube
                              if (videoUrl.includes('youtube.com/watch')) {
                                const videoId = videoUrl.split('v=')[1]?.split('&')[0];
                                if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
                              } else if (videoUrl.includes('youtu.be/')) {
                                const videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
                                if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
                              }
                              // Vimeo
                              else if (videoUrl.includes('vimeo.com/')) {
                                const videoId = videoUrl.split('vimeo.com/')[1]?.split('?')[0];
                                if (videoId) embedUrl = `https://player.vimeo.com/video/${videoId}`;
                              }
                              
                              return (
                                <iframe
                                  src={embedUrl}
                                  className="w-full h-full"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              );
                            })()}
                          </div>
                        )}

                        <div className="prose prose-sm max-w-none">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: lessonContent.content
                                .replace(/\n/g, "<br />")
                                .replace(/#{3}\s(.+)/g, "<h3>$1</h3>")
                                .replace(/#{2}\s(.+)/g, "<h2>$1</h2>")
                                .replace(/#{1}\s(.+)/g, "<h1>$1</h1>")
                                .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                                .replace(/\*(.+?)\*/g, "<em>$1</em>"),
                            }}
                          />
                        </div>

                        {lessonContent.resources && Array.isArray(lessonContent.resources) && lessonContent.resources.length > 0 && (
                          <div className="border-t pt-4">
                            <h4 className="font-semibold mb-3">Resources</h4>
                            <div className="space-y-2">
                              {lessonContent.resources.map((resource: any, idx: number) => (
                                <a
                                  key={idx}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                  <BookOpen className="h-4 w-4" />
                                  {resource.title}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        <p className="text-muted-foreground">
                          This lesson covers: <strong>{currentLesson}</strong>
                        </p>
                        <p className="text-muted-foreground">
                          Detailed content for this lesson is being prepared. Check back soon!
                        </p>
                        <div className="bg-muted/50 rounded-lg p-4 mt-4">
                          <p className="text-sm">
                            <strong>Learning Objective:</strong> Understand the key concepts of{" "}
                            {currentLesson.toLowerCase()}.
                          </p>
                        </div>
                      </div>
                    )}

                    <Separator />

                    {/* Lesson Actions */}
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        onClick={handlePreviousLesson}
                        disabled={currentLessonIndex === 0}
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Previous
                      </Button>

                      <div className="flex gap-2">
                        {!isLessonCompleted && (
                          <Button onClick={handleCompleteLesson} disabled={completing}>
                            {completing ? (
                              <>
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                Completing...
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Mark as Complete
                              </>
                            )}
                          </Button>
                        )}
                        <Button
                          onClick={handleNextLesson}
                          disabled={currentLessonIndex >= totalLessons - 1}
                        >
                          Next
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Course Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{module.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>{totalLessons} lessons</span>
                </div>
                {enrollment && (
                  <>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span>{enrollment.enrollment.xpEarned} XP earned</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        Started {new Date(enrollment.enrollment.startedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Lesson List */}
            {enrollment && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lessons</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {module.content?.map((lesson: string, index: number) => {
                      const lessonData = enrollment.lessons.find((l) => l.index === index);
                      const isCompleted = lessonData?.isCompleted ?? false;
                      const isCurrent = index === currentLessonIndex;

                      return (
                        <button
                          key={index}
                          onClick={() => {
                            setCurrentLessonIndex(index);
                            fetch("/api/learning/progress", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                moduleId,
                                currentLessonIndex: index,
                              }),
                            });
                          }}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${
                            isCurrent
                              ? "border-primary bg-primary/5"
                              : "border-border hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                            ) : (
                              <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            )}
                            <span className={`text-sm ${isCurrent ? "font-semibold" : ""}`}>
                              {index + 1}. {lesson}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
