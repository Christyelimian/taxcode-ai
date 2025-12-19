"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  ChevronRight,
  Download,
  FileText,
  HandHeart,
  Lock,
  Scale,
  ShieldCheck,
  Users,
  Video,
  Phone,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const rights = [
  {
    id: "fair-treatment",
    title: "Right to Fair Treatment",
    icon: <HandHeart className="h-8 w-8 text-primary" />,
    description: "Tax authorities must treat you with courtesy, respect, and professionalism at all times. Harassment or intimidation is illegal.",
    href: "/tax-rights/fair-treatment",
  },
  {
    id: "clear-info",
    title: "Right to Clear Information",
    icon: <FileText className="h-8 w-8 text-primary" />,
    description: "You have the right to understand why you're being taxed, how much you owe, and how it was calculated. All in plain language.",
    href: "/tax-rights/clear-information",
  },
  {
    id: "appeal",
    title: "Right to Appeal",
    icon: <Scale className="h-8 w-8 text-primary" />,
    description: "Disagree with a tax assessment? You have the legal right to object and appeal decisions through proper channels.",
    href: "/tax-rights/appeal",
  },
  {
    id: "privacy",
    title: "Right to Privacy",
    icon: <Lock className="h-8 w-8 text-primary" />,
    description: "Your tax information is confidential. Tax authorities cannot share it without legal authorization. Your data is protected.",
    href: "/tax-rights/privacy",
  },
  {
    id: "representation",
    title: "Right to Representation",
    icon: <Users className="h-8 w-8 text-primary" />,
    description: "You can have a tax professional, lawyer, or representative present during audits, interviews, or any tax matter.",
    href: "/tax-rights/representation",
  },
  {
    id: "refunds",
    title: "Right to Timely Refunds",
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    description: "Overpaid your taxes? You're entitled to a refund within a reasonable timeframe. Delays are not acceptable.",
    href: "/tax-rights/refunds",
  },
];

const scenarios = [
  {
    title: "Scenario 1: Aggressive Audit",
    situation: "A tax officer arrived at my shop unannounced, demanded immediate payment of ₦500,000, and threatened to seal my business if I didn't pay on the spot.",
    action: "Tax officers must give advance notice of audits. On-the-spot demands without proper assessment are illegal. You have the right to request written documentation and time to review.",
  },
  {
    title: "Scenario 2: Confusing Assessment",
    situation: "I received a tax bill for ₦1.2M but the letter has no explanation of how this amount was calculated. When I called, they said 'just pay or face penalties.'",
    action: "You have the right to a clear, itemized breakdown of any tax assessment. Request it in writing. If not provided, file a formal complaint with the Tax Ombuds.",
  },
  {
    title: "Scenario 3: Public Shaming",
    situation: "A tax authority posted my business name on social media as a 'tax defaulter' before I even received an assessment or had a chance to respond.",
    action: "Public shaming without due process violates your rights. You must be properly assessed, notified, and given opportunity to respond before any public action. This is grounds for complaint.",
  },
];

const resources = [
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Rights Reference Card",
    description: "One-page summary of your key tax rights. Print and keep it visible.",
    action: "Download PDF",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Complaint Letter Template",
    description: "Pre-written template for filing formal complaints to authorities.",
    action: "Download Template",
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Audit Checklist",
    description: "What to expect during an audit and how to protect your rights.",
    action: "Download Checklist",
  },
  {
    icon: <Video className="h-6 w-6" />,
    title: "Video: Know Your Rights",
    description: "15-minute video explaining all your taxpayer rights in simple terms.",
    action: "Watch Now",
  },
  {
    icon: <Phone className="h-6 w-6" />,
    title: "Emergency Contacts",
    description: "Phone numbers and emails for immediate rights violation support.",
    action: "Get Contacts",
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Rights Guide (Full)",
    description: "Comprehensive 50-page guide covering every aspect of taxpayer rights.",
    action: "Download Guide",
  },
];

export default function TaxRightsPage() {
  const [selectedRight, setSelectedRight] = useState<typeof rights[0] | null>(null);

  return (
    <div className="bg-background">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-16 md:py-20">
          <div className="text-center">
            <div className="text-6xl mb-4">🇳🇬</div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">⚖️ Know Your Tax Rights</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-95">
              Every Nigerian has the right to fair treatment. Understanding your rights protects you and builds a stronger Nigeria.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Emergency Banner */}
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900">Rights Being Violated Right Now?</h3>
                <p className="text-red-700">Get immediate help. Our advocacy team responds within 24 hours.</p>
              </div>
              <Button className="bg-red-600 hover:bg-red-700">Get Help Now</Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary">2,340</div>
              <div className="text-sm text-muted-foreground">Rights Cases Supported</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">Successful Resolutions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary">156K+</div>
              <div className="text-sm text-muted-foreground">Nigerians Educated</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary">FREE</div>
              <div className="text-sm text-muted-foreground">Always Free Support</div>
            </CardContent>
          </Card>
        </div>

        {/* Rights Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Your Fundamental Tax Rights</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rights.map((right) => (
              <Card key={right.id} className="group hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {right.icon}
                    {right.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{right.description}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                    <Link href={right.href}>
                      Learn More <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Real Scenarios */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">📖 Real-Life Scenarios: What Would You Do?</h2>
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
            {scenarios.map((scenario, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle>{scenario.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="italic text-muted-foreground">"{scenario.situation}"</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <p className="font-semibold text-green-800 mb-2">✅ Your Rights:</p>
                    <p className="text-green-700">{scenario.action}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Action Center */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">💪 Take Action on Your Rights</h2>
                <p className="text-xl opacity-90">Don't wait for problems. Protect yourself proactively.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="secondary" className="h-auto p-6 flex-col gap-3 bg-white/10 hover:bg-white/20">
                  <FileText className="h-8 w-8" />
                  <span>File a Complaint</span>
                </Button>
                <Button variant="secondary" className="h-auto p-6 flex-col gap-3 bg-white/10 hover:bg-white/20">
                  <Scale className="h-8 w-8" />
                  <span>Find Free Legal Aid</span>
                </Button>
                <Button variant="secondary" className="h-auto p-6 flex-col gap-3 bg-white/10 hover:bg-white/20">
                  <ShieldCheck className="h-8 w-8" />
                  <span>Contact Tax Ombuds</span>
                </Button>
                <Button variant="secondary" className="h-auto p-6 flex-col gap-3 bg-white/10 hover:bg-white/20">
                  <Users className="h-8 w-8" />
                  <span>Join Support Group</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Resources */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8">📚 Free Rights Protection Resources</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {resource.icon}
                    {resource.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{resource.description}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    {resource.action}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Modal for detailed rights info */}
      <Dialog open={!!selectedRight} onOpenChange={() => setSelectedRight(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedRight?.icon}
              {selectedRight?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">{selectedRight?.description}</p>
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">What This Means For You:</h4>
              <p className="text-sm">Detailed explanation and practical guidance would go here...</p>
            </div>
            <Button asChild className="w-full">
              <Link href={selectedRight?.href || "#"}>Read Full Guide</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}