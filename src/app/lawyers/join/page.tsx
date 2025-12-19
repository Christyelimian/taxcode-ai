"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gavel, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function JoinLawyerDirectoryPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Gavel className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Join the Tax Lawyer Directory</CardTitle>
              <CardDescription>Get listed and start receiving tax-related legal inquiries</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Benefits of joining:</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Get qualified tax-related legal inquiries</li>
              <li>Showcase your tax litigation expertise and case outcomes</li>
              <li>Connect with clients needing FIRS disputes, TAT appeals, tax litigation</li>
              <li>Boost your visibility in tax legal services</li>
              <li>Track inquiries and manage your practice</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-4">
              The Tax Lawyer Directory is currently in development. We're building a specialized platform for tax-related legal services including FIRS disputes, TAT appeals, tax litigation, and more.
            </p>
            <p className="text-sm font-semibold mb-2">Interested in early access?</p>
            <p className="text-sm text-muted-foreground">
              Contact us at <a href="mailto:info@taxcode.com.ng" className="text-primary hover:underline">info@taxcode.com.ng</a> to be notified when we launch. We're looking for experienced tax lawyers to join our verified directory.
            </p>
          </div>

          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href="/lawyers">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Directory
              </Link>
            </Button>
            <Button asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
