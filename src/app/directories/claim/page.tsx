"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, LoaderCircle, Mail, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ClaimDirectoryProfilePage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{
    found: boolean;
    consultantId?: string;
    claimToken?: string;
    name?: string;
  } | null>(null);

  async function handleCheck() {
    if (!email || !email.includes("@")) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address",
      });
      return;
    }

    setIsChecking(true);
    try {
      const res = await fetch("/api/directories/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.found) {
          setResult({
            found: true,
            consultantId: data.consultantId,
            claimToken: data.claimToken,
            name: data.name,
          });
        } else {
          setResult({ found: false });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to check email",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to check email. Please try again.",
      });
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Claim Your Directory Profile</CardTitle>
          <CardDescription>
            Check if you're listed in our professional directory
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!result ? (
            <>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                  />
                  <Button onClick={handleCheck} disabled={isChecking}>
                    {isChecking ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter the email address associated with your professional profile
                </p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-2">Not listed yet?</p>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href="/lawyers/join">Join as Lawyer</Link>
                  </Button>
                </div>
              </div>
            </>
          ) : result.found ? (
            <div className="space-y-4">
              <div className="rounded-lg border bg-emerald-500/10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span className="font-semibold text-emerald-800">Profile Found!</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  We found a profile for <strong>{result.name}</strong> ({email})
                </p>
                <Button asChild className="w-full">
                  <Link
                    href={`/consultant/claim?id=${result.consultantId}&token=${result.claimToken || ""}`}
                  >
                    Claim Your Profile
                  </Link>
                </Button>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setResult(null);
                  setEmail("");
                }}
              >
                Check Another Email
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted p-4 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  No profile found for <strong>{email}</strong>
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  You may not be listed yet, or the email address doesn't match our records.
                </p>
              </div>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/contact">Contact Us to Get Listed</Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setResult(null);
                    setEmail("");
                  }}
                >
                  Try Another Email
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
