"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, GraduationCap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";

interface TaxChampionsCardProps {
  moduleId?: string; // Optional moduleId for context-aware redirect
}

export function TaxChampionsCard({ moduleId }: TaxChampionsCardProps = {}) {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkUserRole();
    } else {
      setLoading(false);
    }
  }, [user]);

  async function checkUserRole() {
    try {
      const res = await fetch("/api/user/role");
      if (res.ok) {
        const data = await res.json();
        setUserRole(data.role);
      }
    } catch (error) {
      console.error("Error checking user role:", error);
    } finally {
      setLoading(false);
    }
  }

  // Determine button text and link based on user role
  const getButtonConfig = () => {
    if (!user) {
      return {
        text: "Join Academy",
        href: "/academy/onboard",
        icon: GraduationCap,
      };
    }

    const role = userRole || 'user';
    if (role === 'learner' || role === 'admin') {
      // If we're on a course page (moduleId provided), go to that course's learning page
      // Otherwise go to learning dashboard
      if (moduleId) {
        return {
          text: "Start Learning",
          href: `/academy/modules/${moduleId}/learn`,
          icon: BookOpen,
        };
      }
      return {
        text: "Start Learning",
        href: "/dashboard/learning",
        icon: BookOpen,
      };
    }

    // User role - show "Join Academy"
    return {
      text: "Join Academy",
      href: "/academy/onboard",
      icon: GraduationCap,
    };
  };

  const buttonConfig = getButtonConfig();
  const IconComponent = buttonConfig.icon;

  return (
    <Card className="bg-primary/5 border-primary/10">
      <CardHeader>
        <CardTitle className="text-lg">Tax Champions Program</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-3">
        <p>
          Top learners become certified community educators — helping others learn tax rights and obligations.
        </p>
        <div className="space-y-2">
          <Button asChild className="w-full">
            <Link href="/academy/onboard">Join as a community educator</Link>
          </Button>
          <Button 
            asChild 
            variant="outline" 
            className="w-full"
          >
            <Link href={buttonConfig.href}>
              <IconComponent className="mr-2 h-4 w-4" />
              {buttonConfig.text}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}



