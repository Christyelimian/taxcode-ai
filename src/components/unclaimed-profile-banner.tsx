"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function UnclaimedProfileBanner() {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnclaimed, setHasUnclaimed] = useState(false);
  const [consultantId, setConsultantId] = useState<string | null>(null);
  const [claimToken, setClaimToken] = useState<string | null>(null);

  useEffect(() => {
    async function check() {
      try {
        // Check if user has claimed profile
        const res = await fetch("/api/consultant/me");
        const data = await res.json();

        if (!data.success || !data.data) {
          // No claimed profile, check if they have an unclaimed one
          const emailRes = await fetch("/api/directories/check-user-email");
          const emailData = await emailRes.json();

          if (emailData.success && emailData.found && !emailData.claimed) {
            setHasUnclaimed(true);
            setConsultantId(emailData.consultantId);
            setClaimToken(emailData.claimToken);
            setShow(true);
          }
        }
      } catch (error) {
        // Silently fail - don't show banner if check fails
      } finally {
        setIsLoading(false);
      }
    }
    check();
  }, []);

  if (isLoading || !show || !hasUnclaimed) {
    return null;
  }

  return (
    <Card className={cn("mb-6 border-primary/50 bg-primary/5")}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/10 p-2 shrink-0">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold mb-1">You have an unclaimed directory profile</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Claim your profile to receive client bookings and manage your listing.
            </p>
            <div className="flex gap-2">
              <Button asChild size="sm">
                <Link
                  href={`/consultant/claim?id=${consultantId}&token=${claimToken || ""}`}
                >
                  Claim Your Profile
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShow(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

