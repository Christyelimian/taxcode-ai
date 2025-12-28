"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { claimConsultantProfile } from "@/app/actions";
import { LoaderCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";

function ClaimConsultantContent() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [consultantId, setConsultantId] = useState(searchParams.get("id") || "");
  const [claimToken, setClaimToken] = useState(searchParams.get("token") || "");
  const [isLoading, setIsLoading] = useState(false);

  // In production, get userId from session
  const [userId] = useState<string | null>(null); // TODO: Get from auth session

  async function handleClaim() {
    if (!consultantId || !claimToken) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide both consultant ID and claim token",
      });
      return;
    }

    if (!userId) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to claim your profile",
      });
      router.push("/login?redirect=/consultant/claim");
      return;
    }

    setIsLoading(true);
    const result = await claimConsultantProfile(consultantId, claimToken, userId);
    
    if (result.success) {
      toast({
        title: "Profile Claimed!",
        description: "You can now manage your consultant profile.",
      });
      router.push("/dashboard/consultant");
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Failed to claim profile",
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Claim Your Consultant Profile</CardTitle>
          <CardDescription>
            Enter your consultant ID and claim token to manage your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="consultantId">Consultant ID</Label>
            <Input
              id="consultantId"
              value={consultantId}
              onChange={(e) => setConsultantId(e.target.value)}
              placeholder="Enter consultant ID"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="token">Claim Token</Label>
            <Input
              id="token"
              value={claimToken}
              onChange={(e) => setClaimToken(e.target.value)}
              placeholder="Enter claim token"
            />
            <p className="text-xs text-muted-foreground">
              Get this token from the admin or from the email sent to you
            </p>
          </div>

          <Button
            onClick={handleClaim}
            disabled={isLoading || !consultantId || !claimToken}
            className="w-full"
          >
            {isLoading ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Claiming...
              </>
            ) : (
              "Claim Profile"
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>Don't have a token?</p>
            <Link href="/contact" className="text-primary hover:underline">
              Contact us to get your claim token
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ClaimConsultantPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ClaimConsultantContent />
    </Suspense>
  );
}




