"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gavel, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LawyersSearchContent() {
  const searchParams = useSearchParams();
  const practiceArea = searchParams.get("practiceArea");
  const urgency = searchParams.get("urgency");
  const proBono = searchParams.get("proBono") === "true";

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/lawyers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Directory
            </Link>
          </Button>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <Gavel className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-headline font-bold mb-2">Lawyer Directory Coming Soon</h2>
            <p className="text-muted-foreground mb-6">
              We're building a comprehensive directory of tax lawyers across Nigeria.
            </p>
            
            {practiceArea && (
              <div className="mb-6 p-4 bg-muted rounded-lg max-w-md mx-auto">
                <p className="text-sm font-semibold mb-1">Your Search Criteria:</p>
                <p className="text-sm text-muted-foreground">Practice Area: {practiceArea}</p>
                {urgency && <p className="text-sm text-muted-foreground">Urgency: {urgency}</p>}
                {proBono && <p className="text-sm text-muted-foreground">Pro Bono: Yes</p>}
              </div>
            )}

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Interested in being listed? Contact us at{" "}
                <a href="mailto:info@taxcode.com.ng" className="text-primary hover:underline">
                  info@taxcode.com.ng
                </a>
              </p>
              <Button asChild>
                <Link href="/lawyers/join">Join as Tax Lawyer</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LawyersSearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LawyersSearchContent />
    </Suspense>
  );
}


