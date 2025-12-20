"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getConsultantBookings, updateBookingStatus } from "@/app/actions";
import { Mail, Phone, Clock, User, LoaderCircle, Gavel } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface BookingRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  preferredMode: string;
  summary: string;
  status: "pending" | "accepted" | "declined" | "completed";
  createdAt: string;
}

export default function LawyerBookingsPage() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/lawyer/me");
        const data = await res.json();
        
        if (data.success && data.data?.id) {
          const bookingsResult = await getConsultantBookings(data.data.id);
          if (bookingsResult.success && bookingsResult.data) {
            // Filter for lawyer bookings
            const lawyerBookings = bookingsResult.data.filter((b: any) => b.type === "lawyer") as BookingRequest[];
            setBookings(lawyerBookings);
          }
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load bookings",
        });
      }
      setIsLoading(false);
    }
    load();
  }, [toast]);

  async function handleUpdateStatus(bookingId: string, status: "accepted" | "declined") {
    const result = await updateBookingStatus(bookingId, status);
    if (result.success) {
      toast({
        title: "Status updated",
        description: `Booking request ${status}`,
      });
      // Reload bookings
      const res = await fetch("/api/lawyer/me");
      const data = await res.json();
      if (data.success && data.data?.id) {
        const bookingsResult = await getConsultantBookings(data.data.id);
        if (bookingsResult.success && bookingsResult.data) {
          const lawyerBookings = bookingsResult.data.filter((b: any) => b.type === "lawyer") as BookingRequest[];
          setBookings(lawyerBookings);
        }
      }
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Failed to update status",
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-headline font-bold">Booking Requests</h1>
          <p className="text-muted-foreground mt-1">Manage legal consultation requests from clients</p>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Gavel className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No booking requests yet</h3>
              <p className="text-muted-foreground">
                When clients request consultations, they'll appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {booking.clientName}
                      </CardTitle>
                      <CardDescription>
                        {formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true })}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        booking.status === "accepted"
                          ? "default"
                          : booking.status === "declined"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {booking.clientEmail}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {booking.clientPhone}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      Preferred: {booking.preferredMode}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-1">Legal Issue Summary</p>
                    <p className="text-sm text-muted-foreground">{booking.summary}</p>
                  </div>

                  {booking.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(booking.id, "accepted")}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(booking.id, "declined")}
                      >
                        Decline
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


