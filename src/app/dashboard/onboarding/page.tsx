"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { LoaderCircle, CheckCircle2, XCircle, Clock, Mail, Phone, MapPin, User, GraduationCap } from "lucide-react";
import { format } from "date-fns";

interface OnboardingApplication {
  id: string;
  type: "learner" | "educator";
  name: string;
  email: string;
  phone?: string;
  state?: string;
  lga?: string;
  userId?: string;
  status: "pending" | "reviewed" | "approved" | "rejected";
  createdAt: string;
  updatedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  // Learner-specific
  goals?: string;
  interests?: string;
  preferredMode?: string;
  // Educator-specific
  background?: string;
  experience?: string;
  motivation?: string;
  availability?: string;
}

export default function OnboardingApplicationsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<OnboardingApplication[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] = useState<OnboardingApplication | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    loadApplications();
  }, [selectedStatus]);

  async function loadApplications() {
    try {
      setLoading(true);
      const url = selectedStatus === "all" 
        ? "/api/onboarding/applications"
        : `/api/onboarding/applications?status=${selectedStatus}`;
      
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to load applications");
      }

      const data = await res.json();
      setApplications(data.applications || []);
    } catch (error: any) {
      console.error("Error loading applications:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load applications",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(application: OnboardingApplication) {
    try {
      setProcessing(application.id);
      const res = await fetch("/api/onboarding/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: application.id,
          userId: application.userId,
          type: application.type,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to approve application");
      }

      toast({
        title: "Application Approved",
        description: `${application.name}'s application has been approved.`,
      });

      await loadApplications();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to approve application",
      });
    } finally {
      setProcessing(null);
    }
  }

  async function handleReject() {
    if (!selectedApplication) return;

    try {
      setProcessing(selectedApplication.id);
      const res = await fetch("/api/onboarding/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: selectedApplication.id,
          reason: rejectionReason || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to reject application");
      }

      toast({
        title: "Application Rejected",
        description: `${selectedApplication.name}'s application has been rejected.`,
      });

      setRejectDialogOpen(false);
      setRejectionReason("");
      setSelectedApplication(null);
      await loadApplications();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to reject application",
      });
    } finally {
      setProcessing(null);
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500"><CheckCircle2 className="mr-1 h-3 w-3" />Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Rejected</Badge>;
      case "reviewed":
        return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" />Reviewed</Badge>;
      default:
        return <Badge variant="outline"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
    }
  }

  function getTypeBadge(type: string) {
    return type === "learner" ? (
      <Badge variant="outline"><GraduationCap className="mr-1 h-3 w-3" />Learner</Badge>
    ) : (
      <Badge variant="outline"><User className="mr-1 h-3 w-3" />Educator</Badge>
    );
  }

  const pendingCount = applications.filter((a) => a.status === "pending").length;
  const approvedCount = applications.filter((a) => a.status === "approved").length;
  const rejectedCount = applications.filter((a) => a.status === "rejected").length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-headline font-bold mb-2">Onboarding Applications</h1>
        <p className="text-muted-foreground">
          Review and manage learner and educator applications
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Applications</CardTitle>
              <CardDescription>Manage onboarding applications</CardDescription>
            </div>
            <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <LoaderCircle className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No applications found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.name}</TableCell>
                      <TableCell>{getTypeBadge(app.type)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {app.email}
                          </div>
                          {app.phone && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {app.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {app.state && (
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            {app.state}
                            {app.lga && `, ${app.lga}`}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(app.status)}</TableCell>
                      <TableCell>
                        {app.createdAt
                          ? format(new Date(app.createdAt), "MMM d, yyyy")
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {app.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(app)}
                                disabled={processing === app.id}
                              >
                                {processing === app.id ? (
                                  <LoaderCircle className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <CheckCircle2 className="mr-1 h-4 w-4" />
                                    Approve
                                  </>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setSelectedApplication(app);
                                  setRejectDialogOpen(true);
                                }}
                                disabled={processing === app.id}
                              >
                                <XCircle className="mr-1 h-4 w-4" />
                                Reject
                              </Button>
                            </>
                          )}
                          {app.status === "rejected" && app.rejectionReason && (
                            <div className="text-xs text-muted-foreground max-w-xs text-right">
                              {app.rejectionReason}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Full information for {selectedApplication?.name}'s application
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-semibold">Name</Label>
                  <p className="text-sm">{selectedApplication.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Type</Label>
                  <p className="text-sm">{getTypeBadge(selectedApplication.type)}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Email</Label>
                  <p className="text-sm">{selectedApplication.email}</p>
                </div>
                {selectedApplication.phone && (
                  <div>
                    <Label className="text-sm font-semibold">Phone</Label>
                    <p className="text-sm">{selectedApplication.phone}</p>
                  </div>
                )}
                {selectedApplication.state && (
                  <div>
                    <Label className="text-sm font-semibold">Location</Label>
                    <p className="text-sm">
                      {selectedApplication.state}
                      {selectedApplication.lga && `, ${selectedApplication.lga}`}
                    </p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-semibold">Status</Label>
                  <p className="text-sm">{getStatusBadge(selectedApplication.status)}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Submitted</Label>
                  <p className="text-sm">
                    {selectedApplication.createdAt
                      ? format(new Date(selectedApplication.createdAt), "MMM d, yyyy 'at' h:mm a")
                      : "N/A"}
                  </p>
                </div>
                {selectedApplication.userId && (
                  <div>
                    <Label className="text-sm font-semibold">User ID</Label>
                    <p className="text-sm font-mono text-xs">{selectedApplication.userId}</p>
                  </div>
                )}
              </div>

              {selectedApplication.type === "learner" && (
                <>
                  {selectedApplication.goals && (
                    <div>
                      <Label className="text-sm font-semibold">Learning Goals</Label>
                      <p className="text-sm text-muted-foreground">{selectedApplication.goals}</p>
                    </div>
                  )}
                  {selectedApplication.interests && (
                    <div>
                      <Label className="text-sm font-semibold">Interests</Label>
                      <p className="text-sm text-muted-foreground">{selectedApplication.interests}</p>
                    </div>
                  )}
                  {selectedApplication.preferredMode && (
                    <div>
                      <Label className="text-sm font-semibold">Preferred Learning Mode</Label>
                      <p className="text-sm text-muted-foreground">{selectedApplication.preferredMode}</p>
                    </div>
                  )}
                </>
              )}

              {selectedApplication.type === "educator" && (
                <>
                  {selectedApplication.background && (
                    <div>
                      <Label className="text-sm font-semibold">Background</Label>
                      <p className="text-sm text-muted-foreground">{selectedApplication.background}</p>
                    </div>
                  )}
                  {selectedApplication.experience && (
                    <div>
                      <Label className="text-sm font-semibold">Experience</Label>
                      <p className="text-sm text-muted-foreground">{selectedApplication.experience}</p>
                    </div>
                  )}
                  {selectedApplication.motivation && (
                    <div>
                      <Label className="text-sm font-semibold">Motivation</Label>
                      <p className="text-sm text-muted-foreground">{selectedApplication.motivation}</p>
                    </div>
                  )}
                  {selectedApplication.availability && (
                    <div>
                      <Label className="text-sm font-semibold">Availability</Label>
                      <p className="text-sm text-muted-foreground">{selectedApplication.availability}</p>
                    </div>
                  )}
                  {selectedApplication.preferredMode && (
                    <div>
                      <Label className="text-sm font-semibold">Preferred Mode</Label>
                      <p className="text-sm text-muted-foreground">{selectedApplication.preferredMode}</p>
                    </div>
                  )}
                </>
              )}

              {selectedApplication.status === "rejected" && selectedApplication.rejectionReason && (
                <div>
                  <Label className="text-sm font-semibold text-destructive">Rejection Reason</Label>
                  <p className="text-sm text-destructive">{selectedApplication.rejectionReason}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
              Close
            </Button>
            {selectedApplication?.status === "pending" && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setDetailsDialogOpen(false);
                    setRejectDialogOpen(true);
                  }}
                >
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    setDetailsDialogOpen(false);
                    if (selectedApplication) handleApprove(selectedApplication);
                  }}
                  disabled={processing === selectedApplication?.id}
                >
                  {processing === selectedApplication?.id ? (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  )}
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject {selectedApplication?.name}'s application?
              You can provide an optional reason below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason (Optional)</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectionReason("");
                setSelectedApplication(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={processing === selectedApplication?.id}
            >
              {processing === selectedApplication?.id ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}



