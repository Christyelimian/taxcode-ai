"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  GraduationCap,
  Users,
  ArrowLeft,
  LoaderCircle,
  CheckCircle2,
  Mail,
  User,
  MapPin,
  Briefcase,
  BookOpen,
  MessageSquare,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type OnboardingType = "educator" | "learner" | null;

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [onboardingType, setOnboardingType] = useState<OnboardingType>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Check URL params for type and message
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const typeParam = params.get("type");
      const messageParam = params.get("message");
      
      if (typeParam === "learner") {
        setOnboardingType("learner");
      }
      
      if (messageParam) {
        toast({
          title: "Learner Role Required",
          description: decodeURIComponent(messageParam),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pre-fill form data when user is logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.displayName || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  // Form state
  const [formData, setFormData] = useState({
    type: "",
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    location: "",
    state: "",
    lga: "",
    background: "",
    experience: "",
    motivation: "",
    availability: "",
    preferredMode: "",
    goals: "",
    interests: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/onboarding/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          type: onboardingType,
          userId: user?.uid || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit onboarding form");
      }

      setSubmitted(true);
      toast({
        title: "Application Submitted!",
        description:
          "Thank you for your interest. We'll review your application and get back to you soon.",
      });

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/academy");
      }, 3000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit form",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for your interest. We'll review your application and contact you soon.
            </p>
            <Button asChild>
              <Link href="/academy">Back to Academy</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/academy">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Academy
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-headline font-bold mb-2">Join TaxCode Academy</h1>
          <p className="text-muted-foreground text-lg">
            Become part of our learning community and help build tax literacy in Nigeria
          </p>
        </div>

        {!onboardingType ? (
          // Selection Screen
          <div className="grid gap-6 md:grid-cols-2">
            <Card
              className="cursor-pointer hover:shadow-lg transition-all hover:border-primary"
              onClick={() => setOnboardingType("educator")}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Community Educator</CardTitle>
                </div>
                <CardDescription>
                  Help others learn by becoming a certified community educator
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Teach tax concepts to learners
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Get certified as a tax educator
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Earn recognition and badges
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Help build tax literacy
                  </li>
                </ul>
                <Button className="w-full mt-6" onClick={() => setOnboardingType("educator")}>
                  Apply as Educator
                </Button>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-all hover:border-primary"
              onClick={() => setOnboardingType("learner")}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Learner</CardTitle>
                </div>
                <CardDescription>
                  Start your learning journey and become tax-literate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Access free courses
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Track your progress
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Earn XP and badges
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Join study groups
                  </li>
                </ul>
                <Button className="w-full mt-6" onClick={() => setOnboardingType("learner")}>
                  {user ? "Upgrade to Learner" : "Join as Learner"}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Form Screen
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {onboardingType === "educator"
                      ? "Community Educator Application"
                      : "Learner Registration"}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {onboardingType === "educator"
                      ? "Tell us about yourself and your teaching experience"
                      : "Help us personalize your learning experience"}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setOnboardingType(null);
                    setFormData({
                      type: "",
                      name: user?.displayName || "",
                      email: user?.email || "",
                      phone: "",
                      location: "",
                      state: "",
                      lga: "",
                      background: "",
                      experience: "",
                      motivation: "",
                      availability: "",
                      preferredMode: "",
                      goals: "",
                      interests: "",
                    });
                  }}
                >
                  Change Type
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Basic Information
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        required
                        disabled={!!user}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your full name"
                        className={user ? "bg-muted cursor-not-allowed" : ""}
                      />
                      {user && (
                        <p className="text-xs text-muted-foreground mt-1">
                          This field is pre-filled from your account
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        disabled={!!user}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your.email@example.com"
                        className={user ? "bg-muted cursor-not-allowed" : ""}
                      />
                      {user && (
                        <p className="text-xs text-muted-foreground mt-1">
                          This field is pre-filled from your account
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+234 800 000 0000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder="Lagos, Abuja, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="lga">LGA (Optional)</Label>
                      <Input
                        id="lga"
                        value={formData.lga}
                        onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
                        placeholder="Local Government Area"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {onboardingType === "educator" ? (
                  // Educator-specific fields
                  <>
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Professional Background
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="background">Professional Background *</Label>
                          <Textarea
                            id="background"
                            required
                            rows={4}
                            value={formData.background}
                            onChange={(e) =>
                              setFormData({ ...formData, background: e.target.value })
                            }
                            placeholder="Tell us about your professional background, qualifications, and expertise in tax matters..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="experience">Teaching/Education Experience *</Label>
                          <Textarea
                            id="experience"
                            required
                            rows={4}
                            value={formData.experience}
                            onChange={(e) =>
                              setFormData({ ...formData, experience: e.target.value })
                            }
                            placeholder="Describe your experience in teaching, training, or educating others..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="motivation">Why do you want to become a community educator? *</Label>
                          <Textarea
                            id="motivation"
                            required
                            rows={4}
                            value={formData.motivation}
                            onChange={(e) =>
                              setFormData({ ...formData, motivation: e.target.value })
                            }
                            placeholder="Share your motivation and goals for becoming a community educator..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="availability">Availability *</Label>
                          <Select
                            value={formData.availability}
                            onValueChange={(value) =>
                              setFormData({ ...formData, availability: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select your availability" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="full-time">Full-time</SelectItem>
                              <SelectItem value="part-time">Part-time</SelectItem>
                              <SelectItem value="weekends">Weekends only</SelectItem>
                              <SelectItem value="evenings">Evenings only</SelectItem>
                              <SelectItem value="flexible">Flexible</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="preferredMode">Preferred Teaching Mode *</Label>
                          <Select
                            value={formData.preferredMode}
                            onValueChange={(value) =>
                              setFormData({ ...formData, preferredMode: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select preferred mode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="online">Online (Virtual)</SelectItem>
                              <SelectItem value="in-person">In-Person</SelectItem>
                              <SelectItem value="hybrid">Hybrid (Both)</SelectItem>
                              <SelectItem value="content-creation">Content Creation</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  // Learner-specific fields
                  <>
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Learning Goals
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="goals">What are your learning goals? *</Label>
                          <Textarea
                            id="goals"
                            required
                            rows={4}
                            value={formData.goals}
                            onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                            placeholder="What do you hope to achieve by learning about taxes? (e.g., personal tax compliance, business tax planning, career development...)"
                          />
                        </div>
                        <div>
                          <Label htmlFor="interests">Areas of Interest *</Label>
                          <Textarea
                            id="interests"
                            required
                            rows={3}
                            value={formData.interests}
                            onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                            placeholder="Which tax topics interest you most? (e.g., Personal Income Tax, VAT, Business Taxes, Tax Rights...)"
                          />
                        </div>
                        <div>
                          <Label htmlFor="preferredMode">Preferred Learning Mode</Label>
                          <Select
                            value={formData.preferredMode}
                            onValueChange={(value) =>
                              setFormData({ ...formData, preferredMode: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select preferred mode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="self-paced">Self-Paced</SelectItem>
                              <SelectItem value="guided">Guided Learning</SelectItem>
                              <SelectItem value="group">Study Groups</SelectItem>
                              <SelectItem value="mixed">Mixed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                {/* Submit */}
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting} className="flex-1">
                    {submitting ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  By submitting this form, you agree to our terms and conditions. We'll review your
                  application and contact you within 2-3 business days.
                </p>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

