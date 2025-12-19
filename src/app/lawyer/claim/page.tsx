"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { claimConsultantProfile } from "@/app/actions";
import { LoaderCircle, ShieldCheck, Gavel } from "lucide-react";
import Link from "next/link";

function ClaimLawyerContent() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lawyerId, setLawyerId] = useState(searchParams.get("id") || "");
  const [claimToken, setClaimToken] = useState(searchParams.get("token") || "");
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Get userId from session
  const [userId] = useState<string | null>(null);

  async function handleClaim() {
    if (!lawyerId || !claimToken) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide both lawyer ID and claim token",
      });
      return;
    }

    if (!userId) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to claim your profile",
      });
      router.push("/login?redirect=/lawyer/claim");
      return;
    }

    setIsLoading(true);
    const result = await claimConsultantProfile(lawyerId, claimToken, userId);
    
    if (result.success) {
      toast({
        title: "Profile Claimed!",
        description: "You can now manage your lawyer profile.",
      });
      router.push("/dashboard/lawyer");
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
            <Gavel className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Claim Your Lawyer Profile</CardTitle>
          <CardDescription>
            Enter your lawyer ID and claim token to manage your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="lawyerId">Lawyer ID</Label>
            <Input
              id="lawyerId"
              value={lawyerId}
              onChange={(e) => setLawyerId(e.target.value)}
              placeholder="Enter lawyer ID"
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
            disabled={isLoading || !lawyerId || !claimToken}
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

export default function ClaimLawyerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ClaimLawyerContent />
    </Suspense>
  );
}

