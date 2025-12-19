import Link from "next/link";
import { ArrowLeft, Lock, Eye, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PrivacyPage() {
  return (
    <div className="bg-background min-h-screen">
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Button asChild variant="ghost" className="text-white hover:bg-white/10">
              <Link href="/tax-rights">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tax Rights
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <Lock className="h-12 w-12" />
            <div>
              <Badge variant="secondary" className="mb-2">Fundamental Right</Badge>
              <h1 className="text-4xl font-bold">Right to Privacy</h1>
            </div>
          </div>
          <p className="text-xl max-w-3xl">
            Your tax information is confidential. Tax authorities cannot share it without legal authorization.
            Your data is protected by law and must be handled responsibly.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">What Information is Protected</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>• Income amounts and sources</p>
                <p>• Tax payments and refunds</p>
                <p>• Bank account details</p>
                <p>• Investment information</p>
                <p>• Business financial records</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>• Full name and address</p>
                <p>• Identification numbers</p>
                <p>• Contact information</p>
                <p>• Family details</p>
                <p>• Employment information</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">When Can Information Be Shared</h2>
          <div className="space-y-4">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-2">✅ Lawful Sharing</h3>
                    <ul className="text-green-800 space-y-1">
                      <li>• With your written consent</li>
                      <li>• By court order with proper legal process</li>
                      <li>• For criminal investigations (with warrants)</li>
                      <li>• With other government agencies for lawful purposes</li>
                      <li>• In aggregated, anonymized statistical reports</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Eye className="h-6 w-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-2">❌ Unlawful Sharing</h3>
                    <ul className="text-red-800 space-y-1">
                      <li>• With your employer without authorization</li>
                      <li>• With business competitors</li>
                      <li>• With family members or associates</li>
                      <li>• Public disclosure without cause</li>
                      <li>• For political or personal gain</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Privacy Violations & Remedies</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Report Breach</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Contact the tax authority's privacy officer immediately when you suspect unauthorized disclosure.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">File Complaint</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Use the Tax Ombuds complaint process for privacy violations by tax authorities.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Legal Action</CardTitle>
              </CardHeader>
              <CardContent>
                <p>In severe cases, you may seek judicial review or compensation for privacy breaches.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">Protect Your Privacy</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Best Practices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>• Verify caller/officer identity before sharing information</p>
                <p>• Use secure communication channels for tax matters</p>
                <p>• Keep records of all communications</p>
                <p>• Report suspicious requests immediately</p>
                <p>• Use official tax authority portals only</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full mb-3">
                  <Link href="/resources/privacy-guide">Privacy Protection Guide</Link>
                </Button>
                <Button asChild variant="outline" className="w-full mb-3">
                  <Link href="/contact">Report Privacy Concern</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/assistant">Ask TaxPal About Privacy</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}