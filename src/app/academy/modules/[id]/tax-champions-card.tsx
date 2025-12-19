"use client";

import Link from "next/link";
import { Users, GraduationCap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";

export function TaxChampionsCard() {
  const { user } = useAuth();

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
          <Button asChild variant="outline" className="w-full">
            <Link href={user ? "/dashboard/learning" : "/academy/onboard"}>
              {user ? (
                <>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Start Learning
                </>
              ) : (
                <>
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Join as a learner
                </>
              )}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
