import Link from "next/link";
import { ArrowLeft, DollarSign, Clock, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RefundsPage() {
  return (
    <div className="bg-background min-h-screen">
      <section className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-16">
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
            <DollarSign className="h-12 w-12" />
            <div>
              <Badge variant="secondary" className="mb-2">Fundamental Right</Badge>
              <h1 className="text-4xl font-bold">Right to Timely Refunds</h1>
            </div>
          </div>
          <p className="text-xl max-w-3xl">
            Overpaid your taxes? You're entitled to a refund within a reasonable timeframe.
            Delays in processing refunds are not acceptable and violate your rights.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">When You're Entitled to a Refund</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Overpayments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>• Paid more tax than owed</p>
                <p>• Double payments</p>
                <p>• Incorrect assessments corrected</p>
                <p>• Successful appeals reducing liability</p>
                <p>• Changes in tax laws benefiting you</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Common Refund Scenarios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>• Annual tax clearance after filing</p>
                <p>• PAYE over-deductions</p>
                <p>• VAT input credits exceeding output</p>
                <p>• Withholding tax overpayments</p>
                <p>• Capital gains tax adjustments</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Refund Processing Timeline</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <Clock className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold">Individual Tax Returns: 90 days</p>
                <p className="text-sm text-muted-foreground">From date of filing complete return</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <Clock className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold">PAYE Refunds: 60 days</p>
                <p className="text-sm text-muted-foreground">From end of tax year or final payment</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <Clock className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold">VAT Refunds: 30-60 days</p>
                <p className="text-sm text-muted-foreground">Depending on claim complexity</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <Calculator className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold">Appeal Refunds: 30 days</p>
                <p className="text-sm text-muted-foreground">After successful appeal decision</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">What to Do If Refund is Delayed</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">1. Check Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Use the tax authority's online portal to check your refund status and processing timeline.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">2. Submit Reminder</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Send a written reminder after the statutory deadline has passed, requesting immediate processing.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3. File Complaint</CardTitle>
              </CardHeader>
              <CardContent>
                <p>If still not processed, file a formal complaint with the Tax Ombuds citing unreasonable delay.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Interest on Delayed Refunds</h2>
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <DollarSign className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">You May Be Entitled to Interest</h3>
                  <p className="text-green-800 mb-3">
                    If your refund is delayed beyond the statutory timeline, you may be entitled to interest payments
                    on the overdue amount. This is compensation for the time value of money and the inconvenience caused.
                  </p>
                  <ul className="text-green-800 space-y-1">
                    <li>• Interest rate is typically the prevailing commercial lending rate</li>
                    <li>• Calculated from the due date until actual payment</li>
                    <li>• Must be claimed - not automatically applied</li>
                    <li>• Can be substantial for large or long-delayed refunds</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">Get Help With Your Refund</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Refund Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Calculate potential refunds and interest due.</p>
              </CardContent>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/dashboard/calculator">Use Calculator</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Checker</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Check the status of your refund application.</p>
              </CardContent>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <Link href="/dashboard">Check Status</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Professional Help</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Get assistance with delayed or disputed refunds.</p>
              </CardContent>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <Link href="/directory">Find Experts</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}