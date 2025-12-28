"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, LoaderCircle, Sparkles, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/hooks/use-toast";

interface EnrollmentButtonProps {
  moduleId: string;
}

export function EnrollmentButton({ moduleId }: EnrollmentButtonProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      checkUserRole();
      checkEnrollment();
    } else {
      setLoading(false);
    }
  }, [user, moduleId]);

  async function checkUserRole() {
    try {
      const res = await fetch("/api/user/role");
      if (res.ok) {
        const data = await res.json();
        setUserRole(data.role);
      }
    } catch (error) {
      console.error("Error checking user role:", error);
    }
  }

  async function checkEnrollment() {
    try {
      setLoading(true);
      const res = await fetch(`/api/learning/progress?moduleId=${moduleId}`);
      if (res.status === 404) {
        setEnrollment(null);
      } else if (res.ok) {
        const data = await res.json();
        setEnrollment(data);
      }
    } catch (error) {
      console.error("Error checking enrollment:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleEnroll() {
    if (!user) {
      router.push(`/login?redirect=/academy/modules/${moduleId}`);
      return;
    }

    try {
      setEnrolling(true);
      const res = await fetch("/api/learning/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (res.status === 403 && data.message) {
          // Redirect to onboarding if learner role required
          router.push("/academy/onboard?message=" + encodeURIComponent(data.message));
          return;
        }
        throw new Error(data.error || "Failed to enroll");
      }

      // Redirect to learning interface for this course immediately after enrollment
      router.push(`/academy/modules/${moduleId}/learn`);
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

  // Show loading while checking role or enrollment
  if (loading || (user && userRole === null)) {
    return (
      <Button disabled className="font-semibold">
        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  // Not logged in - show login button
  if (!user) {
    return (
      <>
        <Button asChild className="font-semibold">
          <Link href={`/login?redirect=/academy/modules/${moduleId}`}>
            Start learning (free)
          </Link>
        </Button>
        <Button asChild variant="outline" className="font-semibold bg-white/10 border-white/20 text-white hover:bg-white/20">
          <Link href="/dashboard/assistant">Ask AI about this course</Link>
        </Button>
      </>
    );
  }

  // User is logged in but not enrolled
  if (!enrollment) {
    // If user doesn't have learner/admin role, show "Join Academy" button that redirects to onboarding
    // Default to "user" role if role check failed
    const role = userRole || 'user';
    if (role !== 'learner' && role !== 'admin') {
      return (
        <>
          <Button 
            onClick={() => router.push(`/academy/onboard?type=learner&moduleId=${moduleId}`)} 
            className="font-semibold"
          >
            Join Academy
          </Button>
          <Button asChild variant="outline" className="font-semibold bg-white/10 border-white/20 text-white hover:bg-white/20">
            <Link href="/dashboard/assistant">Ask AI about this course</Link>
          </Button>
        </>
      );
    }

    // User has learner role or is admin - show enroll button
    return (
      <>
        <Button onClick={handleEnroll} disabled={enrolling} className="font-semibold">
          {enrolling ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Enrolling...
            </>
          ) : (
            "Start learning (free)"
          )}
        </Button>
        <Button asChild variant="outline" className="font-semibold bg-white/10 border-white/20 text-white hover:bg-white/20">
          <Link href="/dashboard/assistant">Ask AI about this course</Link>
        </Button>
      </>
    );
  }

  // User is enrolled
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button asChild className="font-semibold">
          <Link href={`/academy/modules/${moduleId}/learn`}>
            {enrollment.enrollment.status === "completed" ? "Review Course" : "Continue Learning"}
          </Link>
        </Button>
        {enrollment.enrollment.badgeEarned && (
          <Badge className="bg-green-500">
            <Award className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        )}
      </div>

      {/* Progress Display */}
      <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white/90">Your Progress</span>
          <span className="text-sm text-white/80">
            {enrollment.enrollment.progressPercent}%
          </span>
        </div>
        <Progress value={enrollment.enrollment.progressPercent} className="h-2 mb-2" />
        <div className="flex items-center gap-4 text-xs text-white/70">
          <span className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            {enrollment.enrollment.xpEarned} XP earned
          </span>
          <span>
            Lesson {enrollment.enrollment.currentLessonIndex + 1} of{" "}
            {enrollment.lessons.length + enrollment.enrollment.currentLessonIndex + 1}
          </span>
        </div>
      </div>

      <Button asChild variant="outline" className="font-semibold bg-white/10 border-white/20 text-white hover:bg-white/20">
        <Link href="/dashboard/assistant">Ask AI about this course</Link>
      </Button>
    </div>
  );
}



