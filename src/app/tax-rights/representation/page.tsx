import Link from "next/link";
import { ArrowLeft, Users, UserCheck, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RepresentationPage() {
  return (
    <div className="bg-background min-h-screen">
      <section className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-16">
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
            <Users className="h-12 w-12" />
            <div>
              <Badge variant="secondary" className="mb-2">Fundamental Right</Badge>
              <h1 className="text-4xl font-bold">Right to Representation</h1>
            </div>
          </div>
          <p className="text-xl max-w-3xl">
            You can have a tax professional, lawyer, or representative present during audits, interviews, or any tax matter.
            You never have to face tax authorities alone.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">When You Can Have Representation</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tax Audits</CardTitle>
              </CardHeader>
              <CardContent>
                <p>You can bring a representative to any audit meeting or inspection.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Interviews & Meetings</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Tax authority interviews or discussions about your tax affairs.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Appeals Process</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Representation during objection hearings and tribunal proceedings.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                <p>When discussing or challenging tax assessments and notices.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Investigations</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Formal tax investigations or inquiries into your tax affairs.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dispute Resolution</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Mediation, arbitration, or other dispute resolution processes.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Who Can Represent You</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-primary" />
                  Professional Representatives
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>• Chartered Tax Practitioners</p>
                <p>• Certified Public Accountants (CPA)</p>
                <p>• Lawyers and Legal Practitioners</p>
                <p>• Tax Consultants</p>
                <p>• Authorized representatives from professional bodies</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Other Representatives
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>• Family members (with your authorization)</p>
                <p>• Business partners or directors</p>
                <p>• Employees (for business tax matters)</p>
                <p>• Community tax advocates</p>
                <p>• NGO representatives (in some cases)</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">How to Arrange Representation</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Choose Your Representative</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Select a qualified professional or trusted individual who understands tax matters and can advocate for you.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Provide Written Authorization</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Submit a written power of attorney or letter of authorization to the tax authorities before the meeting.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Notify Tax Authorities</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Inform the tax office in advance that you will be represented and provide the representative's details.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">Find Representation Help</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Directory Search</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Find certified tax professionals in your area.</p>
              </CardContent>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/directory">Search Directory</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Legal Aid Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Free or low-cost legal assistance for tax matters.</p>
              </CardContent>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <Link href="/contact">Find Legal Aid</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Professional Bodies</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Contact chartered institutes for member referrals.</p>
              </CardContent>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <Link href="/contact">Get Referrals</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}