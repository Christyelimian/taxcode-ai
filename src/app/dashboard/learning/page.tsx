"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Award,
  Sparkles,
  Clock,
  TrendingUp,
  CheckCircle2,
  Circle,
  ArrowRight,
  LoaderCircle,
  Bookmark,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/auth-provider";

interface Course {
  id: string;
  moduleId: string;
  moduleTitle: string;
  status: string;
  progressPercent: number;
  currentLessonIndex: number;
  xpEarned: number;
  badgeEarned: boolean;
  startedAt: string;
  completedAt?: string;
  lastAccessedAt: string;
  completedLessons: number;
}

interface BookmarkedCourse {
  id: string;
  moduleId: string;
  moduleTitle: string | null;
  createdAt: string;
}

export default function LearningDashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkedCourse[]>([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);

  useEffect(() => {
    loadCourses();
    loadBookmarks();
  }, [user]);

  async function loadCourses() {
    try {
      setLoading(true);
      const res = await fetch("/api/learning/my-courses");
      
      // Parse response - handle both success and error cases
      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
        setCourses([]);
        return;
      }
      
      // Always set courses array, even if empty
      if (data.success !== undefined) {
        setCourses(data.courses || []);
        // If message indicates learner role required, show it
        if (data.message && data.message.includes("Learner role required")) {
          // Layout will handle redirect, but we can show a message
        }
        // Log error message if present but don't throw
        if (data.error) {
          console.warn("API returned error message:", data.error);
        }
      } else {
        // Handle unexpected response format
        console.warn("Unexpected response format:", data);
        setCourses([]);
      }
    } catch (error: any) {
      console.error("Error loading courses:", error);
      // Set empty courses on error to prevent UI crash
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadBookmarks() {
    try {
      setLoadingBookmarks(true);
      const res = await fetch("/api/learning/bookmarks");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setBookmarks(data.bookmarks || []);
        }
      }
    } catch (error) {
      console.error("Error loading bookmarks:", error);
      setBookmarks([]);
    } finally {
      setLoadingBookmarks(false);
    }
  }

  // Allow access for all users - learning is open to everyone
  // if (!user) {
  //   return (
  //     <div className="container mx-auto px-4 py-16 text-center">
  //     <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
  //     <Button asChild>
  //       <Link href="/login">Sign In</Link>
  //     </Button>
  //   </div>
  //   );
  // }

  const totalXP = courses.reduce((sum, course) => sum + course.xpEarned, 0);
  const completedCourses = courses.filter((c) => c.status === "completed").length;
  const inProgressCourses = courses.filter((c) => c.status === "in_progress").length;

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-background flex-1">
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold text-foreground">
          {user ? "My Learning" : "Learning Dashboard"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {user
            ? "Track your progress and continue your learning journey."
            : "Sign in to access personalized learning features and track your progress."
          }
        </p>
        {!user && (
          <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Sign in to enroll in courses and track your learning progress.
            </p>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Stats Cards - Only show for authenticated users */}
          {user && (
            <div className="grid gap-4 md:grid-cols-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total XP</p>
                      <p className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        {totalXP.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
    
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                      <p className="text-2xl font-bold">{courses.length}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
    
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">In Progress</p>
                      <p className="text-2xl font-bold">{inProgressCourses}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
    
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold">{completedCourses}</p>
                    </div>
                    <Award className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Courses List */}
          {courses.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {user ? "No courses yet" : "Sign in to access courses"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {user
                    ? "Start your learning journey by enrolling in a course."
                    : "Create an account to enroll in courses and track your learning progress."
                  }
                </p>
                {user ? (
                  <Button asChild>
                    <Link href="/academy">Explore Courses</Link>
                  </Button>
                ) : (
                  <div className="flex gap-2 justify-center">
                    <Button asChild>
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/register">Create Account</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">{course.moduleTitle}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                Started {new Date(course.startedAt).toLocaleDateString()}
                              </span>
                              {course.completedAt && (
                                <span className="flex items-center gap-1">
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  Completed {new Date(course.completedAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {course.badgeEarned && (
                              <Badge className="bg-green-500">
                                <Award className="mr-1 h-3 w-3" />
                                Completed
                              </Badge>
                            )}
                            <Badge variant={course.status === "completed" ? "default" : "secondary"}>
                              {course.status === "completed" ? "Completed" : "In Progress"}
                            </Badge>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Progress</span>
                            <span className="text-sm text-muted-foreground">
                              {course.progressPercent}%
                            </span>
                          </div>
                          <Progress value={course.progressPercent} className="h-2" />
                          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                            <span>
                              Lesson {course.currentLessonIndex + 1} of{" "}
                              {course.completedLessons + course.currentLessonIndex + 1}
                            </span>
                            <span className="flex items-center gap-1">
                              <Sparkles className="h-4 w-4 text-primary" />
                              {course.xpEarned} XP
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 md:ml-4">
                        <Button asChild>
                          <Link href={`/academy/modules/${course.moduleId}/learn`}>
                            {course.status === "completed" ? "Review Course" : "Continue Learning"}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/academy/modules/${course.moduleId}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Bookmarked Courses Section */}
          {!loadingBookmarks && bookmarks.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-headline font-bold mb-4 flex items-center gap-2">
                <Bookmark className="h-6 w-6" />
                Bookmarked Courses
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {bookmarks.map((bookmark) => {
                  // Check if user is enrolled in this course
                  const enrollment = courses.find(c => c.moduleId === bookmark.moduleId);
                  
                  return (
                    <Card key={bookmark.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-2">{bookmark.moduleTitle || "Course"}</h3>
                        {enrollment ? (
                          <div className="space-y-2">
                            <Progress value={enrollment.progressPercent} className="h-2" />
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>{enrollment.progressPercent}% complete</span>
                              <span className="flex items-center gap-1">
                                <Sparkles className="h-3 w-3" />
                                {enrollment.xpEarned} XP
                              </span>
                            </div>
                            <Button asChild className="w-full mt-3">
                              <Link href={`/academy/modules/${bookmark.moduleId}/learn`}>
                                {enrollment.status === "completed" ? "Review Course" : "Continue Learning"}
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        ) : (
                          <Button asChild className="w-full mt-3">
                            <Link href={`/academy/modules/${bookmark.moduleId}`}>
                              Start Learning
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA to Browse More */}
          {courses.length > 0 && (
            <Card className="mt-8 bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Continue Learning</h3>
                    <p className="text-sm text-muted-foreground">
                      Explore more courses to expand your tax knowledge.
                    </p>
                  </div>
                  <Button asChild>
                    <Link href="/academy">
                      Browse All Courses
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

