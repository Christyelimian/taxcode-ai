"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DIRECTORY_PROS } from "@/app/directory/_directory-data";
import { useToast } from "@/hooks/use-toast";

export default function EditDirectoryProfessionalPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // For now, find from mock data. Later we'll fetch from backend
  const professional = DIRECTORY_PROS.find((p) => p.id === params.id);

  if (!professional) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Professional not found.</p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/directory">Back to Directory</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/directory">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Directory
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Professional: {professional.name}</CardTitle>
            <CardDescription>
              Edit professional details. Full form coming soon - for now this is a placeholder.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold">Name</p>
                <p className="text-muted-foreground">{professional.name}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Title</p>
                <p className="text-muted-foreground">{professional.title}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Firm</p>
                <p className="text-muted-foreground">{professional.firm || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Verification Status</p>
                <p className="text-muted-foreground">{professional.verified.status}</p>
              </div>
              <div className="pt-4">
                <p className="text-sm text-muted-foreground">
                  Full edit form will be implemented next. For now, you can view the professional details.
                </p>
                <Button asChild className="mt-4">
                  <Link href={`/dashboard/directory/${professional.id}/edit-full`}>
                    Open Full Edit Form (Coming Soon)
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
