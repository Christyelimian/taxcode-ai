import Link from "next/link";
import { ArrowLeft, Scale, Clock, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AppealPage() {
  return (
    <div className="bg-background min-h-screen">
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
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
            <Scale className="h-12 w-12" />
            <div>
              <Badge variant="secondary" className="mb-2">Fundamental Right</Badge>
              <h1 className="text-4xl font-bold">Right to Appeal</h1>
            </div>
          </div>
          <p className="text-xl max-w-3xl">
            Disagree with a tax assessment? You have the legal right to object and appeal decisions through proper channels.
            No taxpayer should accept an unfair assessment without challenge.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Appeal Process Overview</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">1. Notice of Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p>You receive a tax assessment you disagree with</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">2. File Objection</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Submit written objection within 30 days</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">3. Review Process</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Tax authority reviews your objection</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">4. Appeal to Tribunal</CardTitle>
              </CardHeader>
              <CardContent>
                <p>If unsatisfied, appeal to Tax Appeal Tribunal</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">What You Can Appeal</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Assessment Issues</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>• Incorrect tax calculation</p>
                <p>• Wrong income assessment</p>
                <p>• Improper application of tax laws</p>
                <p>• Errors in tax records</p>
                <p>• Unlawful penalties or interest</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Procedural Issues</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>• Lack of proper notice</p>
                <p>• Unreasonable assessment methods</p>
                <p>• Failure to provide information</p>
                <p>• Violation of due process</p>
                <p>• Unfair treatment during assessment</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Appeal Timeline</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <Clock className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold">Objection Period: 30 days</p>
                <p className="text-sm text-muted-foreground">From date of assessment notice</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <FileCheck className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold">Authority Review: 60 days</p>
                <p className="text-sm text-muted-foreground">Tax authority must respond</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <Scale className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold">Tribunal Appeal: 30 days</p>
                <p className="text-sm text-muted-foreground">After receiving review decision</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">Get Help With Your Appeal</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Free Appeal Template</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Download our pre-written appeal letter template.</p>
              </CardContent>
              <CardContent>
                <Button className="w-full">Download Template</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tax Appeal Tribunal</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Contact information and filing procedures.</p>
              </CardContent>
              <CardContent>
                <Button variant="outline" className="w-full">Get Contacts</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Professional Help</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Find certified tax professionals for appeal assistance.</p>
              </CardContent>
              <CardContent>
                <Button variant="outline" className="w-full">Find Experts</Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}