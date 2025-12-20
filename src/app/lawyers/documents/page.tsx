"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getLawyers } from "@/app/actions";
import { FileText, Upload, Clock, ShieldCheck, LoaderCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const DOCUMENT_TYPES = [
  { id: "contract", label: "Contract Review", price: 15000, duration: "24hrs" },
  { id: "tenancy", label: "Tenancy Agreement", price: 12000, duration: "24hrs" },
  { id: "partnership", label: "Partnership Deed", price: 25000, duration: "48hrs" },
  { id: "sales", label: "Sales Agreement", price: 18000, duration: "24hrs" },
  { id: "nda", label: "NDA/Confidentiality", price: 10000, duration: "12hrs" },
  { id: "will", label: "Will Review/Drafting", price: 20000, duration: "48hrs" },
  { id: "power", label: "Power of Attorney", price: 15000, duration: "24hrs" },
  { id: "trust", label: "Trust Deed", price: 35000, duration: "72hrs" },
  { id: "tax_doc", label: "Tax Document Review", price: 20000, duration: "24hrs" },
];

export default function DocumentReviewMarketplacePage() {
  const { toast } = useToast();
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null);
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function loadLawyers() {
      setIsLoading(true);
      try {
        const result = await getLawyers({
          documentReviewEnabled: true,
          limit: 20,
        });

        if (result.success && result.data) {
          setLawyers(result.data);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load lawyers",
        });
      }
      setIsLoading(false);
    }
    loadLawyers();
  }, [toast]);

  async function handleSubmitRequest(lawyerId: string, docType: string) {
    if (!clientName || !clientEmail || !clientPhone) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    const docTypeInfo = DOCUMENT_TYPES.find((dt) => dt.id === docType);
    if (!docTypeInfo) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/lawyers/document-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lawyerId,
          documentType: docTypeInfo.label,
          price: docTypeInfo.price,
          clientName,
          clientEmail,
          clientPhone,
          notes,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Request submitted!",
          description: "The lawyer will review your document and get back to you.",
        });
        // Reset form
        setClientName("");
        setClientEmail("");
        setClientPhone("");
        setNotes("");
        setSelectedDocType(null);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to submit request",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit request",
      });
    }
    setIsLoading(false);
  }

  const availableLawyers = lawyers.filter((lawyer) => {
    if (!lawyer.documentReviewEnabled) return false;
    if (!selectedDocType) return true;
    const pricing = lawyer.documentReviewPricing || {};
    return pricing[selectedDocType] !== undefined;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/10">
            <FileText className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-headline font-bold mb-2">Document Review Marketplace</h1>
          <p className="text-lg text-muted-foreground">
            Get professional legal document reviews at fixed, transparent prices
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Document Type</CardTitle>
            <CardDescription>Choose the type of document you need reviewed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              {DOCUMENT_TYPES.map((docType) => (
                <Button
                  key={docType.id}
                  variant={selectedDocType === docType.id ? "default" : "outline"}
                  className="h-auto p-4 flex-col items-start"
                  onClick={() => setSelectedDocType(docType.id)}
                >
                  <div className="font-semibold mb-1">{docType.label}</div>
                  <div className="text-sm text-muted-foreground">
                    ₦{docType.price.toLocaleString()} • {docType.duration}
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedDocType && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>We'll use this to contact you about your document review</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Full Name *</Label>
                  <Input
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Phone *</Label>
                <Input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+234..."
                />
              </div>
              <div className="grid gap-2">
                <Label>Additional Notes</Label>
                <Textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any specific concerns or questions about your document..."
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-headline font-bold mb-4">
            Available Lawyers for Document Review
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : availableLawyers.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No lawyers available</h3>
                <p className="text-muted-foreground">
                  {selectedDocType
                    ? "No lawyers are currently offering this document type."
                    : "Select a document type to see available lawyers."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {availableLawyers.map((lawyer) => {
                const docTypeInfo = DOCUMENT_TYPES.find((dt) => dt.id === selectedDocType);
                const customPrice = lawyer.documentReviewPricing?.[docTypeInfo?.label || ""];
                const price = customPrice || docTypeInfo?.price || 0;

                return (
                  <Card key={lawyer.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{lawyer.name}</CardTitle>
                          <CardDescription>{lawyer.title}</CardDescription>
                        </div>
                        {lawyer.verified && (
                          <Badge variant="secondary" className="bg-emerald-500/10">
                            <ShieldCheck className="mr-1 h-3 w-3" /> Verified
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedDocType && docTypeInfo && (
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">{docTypeInfo.label}</span>
                            <span className="text-lg font-bold">₦{price.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Clock className="h-4 w-4" />
                            {docTypeInfo.duration}
                          </div>
                        </div>
                      )}

                      {lawyer.practiceAreas && lawyer.practiceAreas.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold mb-2">Practice Areas</p>
                          <div className="flex flex-wrap gap-2">
                            {lawyer.practiceAreas.slice(0, 3).map((pa: string) => (
                              <Badge key={pa} variant="secondary">
                                {pa}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          asChild
                        >
                          <Link href={`/lawyers?lawyer=${lawyer.id}`}>
                            View Profile
                          </Link>
                        </Button>
                        {selectedDocType && (
                          <Button
                            className="flex-1"
                            onClick={() => handleSubmitRequest(lawyer.id, selectedDocType)}
                            disabled={isLoading || !clientName || !clientEmail || !clientPhone}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Request Review
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <Card className="bg-muted">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2">What's Included</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Detailed review with annotations</li>
                  <li>• Written memo with recommendations</li>
                  <li>• One round of free revisions</li>
                  <li>• Video explanation call (optional)</li>
                  <li>• Money-back guarantee if late</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


