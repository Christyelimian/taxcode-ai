"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FilePlus,
  Filter,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  ShieldCheck,
  MapPin,
  Star,
  Gavel,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getLawyers, deleteConsultant, type DirectoryLawyer } from "@/app/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function LawyersManagementPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "Verified" | "In review">("all");
  const [lawyers, setLawyers] = useState<DirectoryLawyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLawyers() {
      setIsLoading(true);
      const result = await getLawyers();
      if (result.success && result.data) {
        setLawyers(result.data);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to load lawyers",
        });
      }
      setIsLoading(false);
    }
    loadLawyers();
  }, [toast]);

  async function handleDelete(lawyerId: string) {
    if (!confirm("Delete this lawyer? This action cannot be undone.")) return;
    const result = await deleteConsultant(lawyerId); // Reuse deleteConsultant for now
    if (result.success) {
      toast({ title: "Lawyer deleted", description: "The lawyer has been removed from the directory." });
      const refreshed = await getLawyers();
      if (refreshed.success && refreshed.data) {
        setLawyers(refreshed.data);
      }
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Failed to delete lawyer",
      });
    }
  }

  const filteredLawyers = useMemo(() => {
    return lawyers.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.firmName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        p.practiceAreas.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = filterStatus === "all" || (filterStatus === "Verified" && p.verified) || (filterStatus === "In review" && !p.verified);
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus, lawyers]);

  function formatNGN(n: number): string {
    return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-background flex-1">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-foreground">
            Tax Lawyers Directory
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage verified tax lawyers in the directory.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/lawyers/new">
            <FilePlus className="mr-2" />
            Add Lawyer
          </Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, title, firm, or practice area..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2" />
                  {filterStatus === "all" ? "All Status" : filterStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("Verified")}>Verified</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("In review")}>In review</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLawyers.map((lawyer) => (
            <Card
              key={lawyer.id}
              className="flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="font-headline text-lg text-foreground pr-4">
                    {lawyer.name}
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        <Link href={`/dashboard/lawyers/${lawyer.id}/edit`}>Edit</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(lawyer.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {lawyer.verified ? (
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700">
                      <ShieldCheck className="mr-1 h-3 w-3" /> Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline">In review</Badge>
                  )}
                  {lawyer.badges.slice(0, 2).map((b) => (
                    <Badge key={b} variant="outline">
                      {b}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-2">
                <div className="text-sm text-muted-foreground">{lawyer.title}</div>
                {lawyer.firmName && (
                  <div className="text-sm text-muted-foreground">{lawyer.firmName}</div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{lawyer.locations.join(", ")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="font-semibold">{lawyer.trust.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({lawyer.trust.reviewCount} reviews)</span>
                </div>
                <div className="text-sm font-semibold">
                  Consult: {formatNGN(lawyer.pricing.consultationFeeNGN)}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {lawyer.practiceAreas.slice(0, 3).map((pa) => (
                    <Badge key={pa} variant="secondary" className="text-xs">
                      {pa}
                    </Badge>
                  ))}
                  {lawyer.practiceAreas.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{lawyer.practiceAreas.length - 3}
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/dashboard/lawyers/${lawyer.id}/edit`}>Edit Lawyer</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && filteredLawyers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Gavel className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No lawyers found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filters."
                : "Get started by adding your first lawyer."}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <Button asChild>
                <Link href="/dashboard/lawyers/new">
                  <FilePlus className="mr-2" />
                  Add First Lawyer
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

