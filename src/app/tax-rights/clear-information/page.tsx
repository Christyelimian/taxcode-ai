import Link from "next/link";
import { ArrowLeft, FileText, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ClearInformationPage() {
  return (
    <div className="bg-background min-h-screen">
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
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
            <FileText className="h-12 w-12" />
            <div>
              <Badge variant="secondary" className="mb-2">Fundamental Right</Badge>
              <h1 className="text-4xl font-bold">Right to Clear Information</h1>
            </div>
          </div>
          <p className="text-xl max-w-3xl">
            You have the right to understand why you're being taxed, how much you owe, and how it was calculated.
            All information must be provided in plain, understandable language.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">What You Can Request</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tax Assessment Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>• Detailed calculation of your tax liability</p>
                <p>• Explanation of applicable tax rates</p>
                <p>• Itemized list of income sources</p>
                <p>• Deductions and exemptions applied</p>
                <p>• Final amount due with payment deadlines</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plain Language Requirement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>• No complex legal jargon without explanation</p>
                <p>• Clear definitions of technical terms</p>
                <p>• Simple step-by-step explanations</p>
                <p>• Visual aids when helpful</p>
                <p>• Multiple language options when available</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Common Problems & Solutions</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-900">❌ "Just Pay - No Questions"</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 italic text-red-700">
                  "The tax office sent me a bill but when I asked how they calculated it, they said 'just pay or face penalties.'"
                </p>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="font-semibold text-green-800 mb-2">✅ Your Right:</p>
                  <p className="text-green-700">You can demand a detailed breakdown. If not provided within 14 days, you can appeal the assessment.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-900">❌ Confusing Legal Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 italic text-red-700">
                  "My assessment letter uses words like 'depreciable assets' and 'capital allowances' but doesn't explain what they mean."
                </p>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="font-semibold text-green-800 mb-2">✅ Your Right:</p>
                  <p className="text-green-700">Request explanations in plain language. Tax authorities must make information accessible to all taxpayers.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">How to Get Clear Information</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">1. Submit Written Request</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Send a formal letter requesting detailed breakdown of your assessment with specific questions.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">2. Use TaxPal Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Ask our AI assistant to explain any tax document or assessment in simple terms.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3. Contact Tax Ombuds</CardTitle>
              </CardHeader>
              <CardContent>
                <p>If your requests are ignored, the Tax Ombuds can help enforce your right to information.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}