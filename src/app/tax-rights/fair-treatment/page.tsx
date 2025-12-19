import Link from "next/link";
import { ArrowLeft, HandHeart, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function FairTreatmentPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
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
            <HandHeart className="h-12 w-12" />
            <div>
              <Badge variant="secondary" className="mb-2">Fundamental Right</Badge>
              <h1 className="text-4xl font-bold">Right to Fair Treatment</h1>
            </div>
          </div>
          <p className="text-xl max-w-3xl">
            Tax authorities must treat you with courtesy, respect, and professionalism at all times.
            Harassment or intimidation is illegal and violates your fundamental rights.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* What This Means */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">What This Right Means</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  You Have The Right To
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>• Be treated with courtesy and respect</p>
                <p>• Receive professional service without harassment</p>
                <p>• Have your dignity respected at all times</p>
                <p>• Be free from intimidation or threats</p>
                <p>• Receive service without discrimination</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  What Violates This Right
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>• Aggressive or threatening behavior</p>
                <p>• Use of abusive or insulting language</p>
                <p>• Unreasonable demands or pressure</p>
                <p>• Discrimination based on religion, gender, or ethnicity</p>
                <p>• Public shaming or humiliation</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Real Examples */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Real-Life Examples</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>✅ Acceptable Behavior</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 italic">
                  "A tax officer called me politely, explained the purpose of their visit 48 hours in advance,
                  and conducted the assessment professionally without raising their voice or making threats."
                </p>
                <p className="text-sm text-muted-foreground">
                  This respects your right to fair treatment and creates a positive interaction.
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-900">❌ Unacceptable Behavior</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 italic">
                  "Tax officers arrived unannounced, banged on my door loudly, and shouted demands for immediate payment,
                  threatening to 'make life difficult' if I didn't comply on the spot."
                </p>
                <p className="text-sm text-red-700">
                  This violates your right to fair treatment and may be grounds for a formal complaint.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What To Do */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">What To Do If Your Rights Are Violated</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">1. Stay Calm</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Don't engage in arguments. Politely request the officer's identification and purpose of visit.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">2. Document Everything</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Take notes of what happened, including names, dates, times, and exact words used.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3. File a Complaint</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Report the incident to the Tax Ombuds or file a formal complaint with the relevant authorities.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Related Resources */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Related Resources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Complaint Filing Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Step-by-step guide on how to file a formal complaint about unfair treatment.</p>
              </CardContent>
              <CardContent>
                <Button asChild>
                  <Link href="/resources/complaint-guide">Read Guide</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tax Ombuds Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Get direct contact information for filing complaints about tax authority behavior.</p>
              </CardContent>
              <CardContent>
                <Button asChild variant="outline">
                  <Link href="/contact">Get Contacts</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}