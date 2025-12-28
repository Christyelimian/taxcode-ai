"use client";

import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth-provider";

interface BookmarkButtonProps {
  moduleId: string;
  moduleTitle?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function BookmarkButton({ 
  moduleId, 
  moduleTitle,
  variant = "outline",
  size = "default"
}: BookmarkButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (user) {
      checkBookmark();
    } else {
      setLoading(false);
    }
  }, [user, moduleId]);

  async function checkBookmark() {
    try {
      const res = await fetch(`/api/learning/bookmark?moduleId=${moduleId}`);
      if (res.ok) {
        const data = await res.json();
        setBookmarked(data.bookmarked);
      }
    } catch (error) {
      console.error("Error checking bookmark:", error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleBookmark() {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to bookmark courses",
      });
      return;
    }

    try {
      setToggling(true);
      
      if (bookmarked) {
        // Remove bookmark
        const res = await fetch(`/api/learning/bookmark?moduleId=${moduleId}`, {
          method: "DELETE",
        });
        
        if (res.ok) {
          setBookmarked(false);
          toast({
            title: "Bookmark removed",
            description: "Course removed from your bookmarks",
          });
        }
      } else {
        // Add bookmark
        const res = await fetch("/api/learning/bookmark", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ moduleId, moduleTitle }),
        });
        
        if (res.ok) {
          setBookmarked(true);
          toast({
            title: "Bookmarked!",
            description: "Course saved to your bookmarks",
          });
        } else {
          const data = await res.json();
          if (res.status === 403) {
            toast({
              variant: "destructive",
              title: "Learner role required",
              description: "Please upgrade to learner to bookmark courses",
            });
          }
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update bookmark",
      });
    } finally {
      setToggling(false);
    }
  }

  if (!user || loading) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleBookmark}
      disabled={toggling}
      className="gap-2"
    >
      {bookmarked ? (
        <>
          <BookmarkCheck className="h-4 w-4" />
          <span>Bookmarked</span>
        </>
      ) : (
        <>
          <Bookmark className="h-4 w-4" />
          <span>Bookmark</span>
        </>
      )}
    </Button>
  );
}



