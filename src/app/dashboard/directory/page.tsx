"use client";

import React, { useState, useMemo } from "react";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function DirectoryManagementPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "Verified" | "In review">("all");
  const [consultants, setConsultants] = useState<DirectoryConsultant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadConsultants() {
      setIsLoading(true);
      const result = await getConsultants();
      if (result.success && result.data) {
        setConsultants(result.data);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to load consultants",
        });
      }
      setIsLoading(false);
    }
    loadConsultants();
  }, [toast]);

  async function handleDelete(consultantId: string) {
    if (!confirm("Delete this consultant? This action cannot be undone.")) return;
    const result = await deleteConsultant(consultantId);
    if (result.success) {
      toast({ title: "Consultant deleted", description: "The consultant has been removed from the directory." });
      // Reload consultants
      const refreshed = await getConsultants();
      if (refreshed.success && refreshed.data) {
        setConsultants(refreshed.data);
      }
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Failed to delete consultant",
      });
    }
  }

  const filteredProfessionals = useMemo(() => {
    return professionals.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.firm?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        p.specialties.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = filterStatus === "all" || p.verified.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus, professionals]);

  function formatNGN(n: number): string {
    return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-background flex-1">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-foreground">
            Professional Directory
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage verified tax professionals in the directory.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/directory/new">
            <FilePlus className="mr-2" />
            Add Professional
          </Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, title, firm, or specialty..."
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
          {filteredConsultants.map((consultant) => (
          <Card
            key={consultant.id}
            className="flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="font-headline text-lg text-foreground pr-4">
                  {consultant.name}
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
                      <Link href={`/dashboard/directory/${consultant.id}/edit`}>Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      <Link href={`/dashboard/directory/${consultant.id}/claim`}>Manage Claim</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(consultant.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {consultant.verified ? (
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700">
                    <ShieldCheck className="mr-1 h-3 w-3" /> Verified
                  </Badge>
                ) : (
                  <Badge variant="outline">In review</Badge>
                )}
                {consultant.badges.map((b) => (
                  <Badge key={b} variant="outline">
                    {b}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-2">
              <div className="text-sm text-muted-foreground">{consultant.title}</div>
              {consultant.firmName && (
                <div className="text-sm text-muted-foreground">{consultant.firmName}</div>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{consultant.locations.join(", ")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-amber-500" />
                <span className="font-semibold">{consultant.trust.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({consultant.trust.reviewCount} reviews)</span>
              </div>
              <div className="text-sm font-semibold">
                Consult: {formatNGN(consultant.pricing.consultationFeeNGN)}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {consultant.specialties.slice(0, 3).map((s) => (
                  <Badge key={s} variant="secondary" className="text-xs">
                    {s}
                  </Badge>
                ))}
                {consultant.specialties.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{consultant.specialties.length - 3}
                  </Badge>
                )}
              </div>
            </CardContent>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/dashboard/directory/${consultant.id}/edit`}>Edit Professional</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
        </div>
      )}

      {!isLoading && filteredConsultants.length === 0 && (
        <div className="col-span-full text-center py-16 text-muted-foreground">
          <Search className="mx-auto h-12 w-12 mb-4" />
          <h3 className="text-xl font-semibold">No professionals found</h3>
          <p>Try adjusting your search or add a new professional.</p>
        </div>
      )}
    </div>
  );
}
