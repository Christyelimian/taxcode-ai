import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, Target, Users, Shield, Brain, Globe, Award, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About TaxCode',
  description: 'Learn about TaxCode\'s mission to advance tax awareness, advocacy, and strategic guidance through innovative technology.',
};

const timeline = [
  { year: '2024', event: 'TaxCode founded as a non-profit organization' },
  { year: '2025', event: 'Technology platform development and AI integration' },
  { year: '2026', event: 'Full ecosystem launch for the Tax Reform Act' },
];

const objectives = [
  'Advance tax awareness and education across Nigeria',
  'Provide practical, user-friendly tools that translate legal understanding into compliant action',
  'Build a sustainable model where free education and premium tools work together to serve all Nigerians',
  'Leverage technology to democratize access to expert tax guidance',
  'Foster advocacy and taxpayer rights protection',
  'Promote policy dialogue and institutional engagement',
];

const approach = [
  'Technology-Enhanced Accessibility: Our tools translate complex regulations into simple, actionable guidance',
  'Institutional Credibility: Non-profit status enables government and NGO collaborations',
  'Dual-Track Strategy: Free education builds trust, premium tools provide practical solutions',
  'Comprehensive Coverage: From taxpayer rights to dispute resolution and policy analysis',
];

const promoters = [
  {
    name: 'Jeremiah Akpe',
    title: 'Founder & Executive Director',
    role: 'Tax Policy Expert & Legal Practitioner',
    description: 'Former FIRS official with 15+ years in tax administration and policy development.',
  },
  {
    name: 'Dr. Adebayo Adeniran',
    title: 'Chief Technology Officer',
    role: 'Digital Transformation Specialist',
    description: 'PhD in Computer Science with expertise in AI and financial technology solutions.',
  },
];

const technologyFeatures = [
  {
    icon: <Brain className="h-8 w-8 text-primary" />,
    title: 'Intelligent Processing',
    description: 'Advanced algorithms analyze complex tax scenarios and provide accurate guidance.',
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: 'Data Security',
    description: 'Enterprise-grade encryption and privacy protection for all user data.',
  },
  {
    icon: <Globe className="h-8 w-8 text-primary" />,
    title: 'Multi-language Support',
    description: 'Access tax information in English, Hausa, Yoruba, and Igbo languages.',
  },
  {
    icon: <Award className="h-8 w-8 text-primary" />,
    title: 'Accuracy Verification',
    description: 'All responses validated against current Nigerian tax law and regulations.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">About TaxCode</Badge>
            <h1 className="text-4xl font-headline font-bold text-foreground mb-6">
              Advancing Tax Awareness Through Innovation
            </h1>
            <p className="text-lg text-muted-foreground">
              TaxCode is Nigeria's premier platform for tax education, advocacy, and compliance solutions.
              We combine institutional credibility with cutting-edge technology to make tax management
              accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-headline font-bold text-primary mb-4">Who We Are</h2>
              <p className="text-lg text-muted-foreground">
                Founded in 2024, TaxCode emerged from the urgent need to prepare Nigerians for the
                comprehensive tax reforms taking effect in 2026. What began as an awareness initiative
                has evolved into Nigeria's most comprehensive tax intelligence platform.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-muted-foreground mb-6">
                  In 2025, we enhanced our mission by developing Nigeria's first comprehensive
                  tax compliance ecosystem. By combining institutional authority with innovative
                  technology, we provide both the knowledge and the tools Nigerians need to navigate
                  the 2026 Tax Reform with confidence.
                </p>
                <p className="text-muted-foreground">
                  Our platform operates on two complementary tracks: free educational content that
                  builds awareness and trust, and premium tools that provide practical compliance solutions.
                  This virtuous cycle ensures sustainable impact while serving all segments of Nigerian society.
                </p>
              </div>
              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 text-sm font-semibold text-primary">{item.year}</div>
                    <div className="flex-1 h-px bg-border"></div>
                    <div className="text-sm text-muted-foreground">{item.event}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Philosophy */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-headline font-bold text-primary mb-8">Our Philosophy</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Landmark className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle>Understanding Through Law</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We believe tax compliance begins with understanding. Our approach grounds
                    all guidance in Nigerian tax law, ensuring accuracy and reliability.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle>Process & Justice</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Tax administration must balance revenue collection with taxpayer rights.
                    We advocate for fair processes and due process in all tax matters.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle>Strategic Guidance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Beyond compliance, we provide strategic insights to help individuals
                    and businesses optimize their tax positions within legal boundaries.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Objectives */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-headline font-bold text-primary mb-4">Our Objectives</h2>
              <p className="text-lg text-muted-foreground">
                TaxCode's mission is guided by clear objectives that drive our work and measure our impact.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {objectives.map((objective, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-bold text-primary-foreground">{index + 1}</span>
                  </div>
                  <p className="text-muted-foreground">{objective}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-headline font-bold text-primary mb-4">Our Approach</h2>
              <p className="text-lg text-muted-foreground">
                We combine traditional legal expertise with modern technology to create
                accessible, practical solutions for tax compliance.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {approach.map((item, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">{item}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Promoters & Governance */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-headline font-bold text-primary mb-4">Leadership & Governance</h2>
              <p className="text-lg text-muted-foreground">
                TaxCode is governed by experienced professionals with deep expertise in tax law,
                policy, and technology.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {promoters.map((person, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-xl">{person.name}</CardTitle>
                    <CardDescription>{person.title}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium text-primary mb-2">{person.role}</p>
                    <p className="text-muted-foreground text-sm">{person.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technology & Innovation */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-headline font-bold text-primary mb-4">Technology & Innovation</h2>
              <p className="text-lg text-muted-foreground">
                Our platform leverages advanced technology to make complex tax information
                accessible and actionable for everyone.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {technologyFeatures.map((feature, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      {feature.icon}
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-headline font-bold text-primary mb-4">
              Join Our Mission
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Whether you're an individual taxpayer, business owner, or tax professional,
              TaxCode provides the knowledge and tools you need to navigate Nigeria's tax landscape with confidence.
            </p>
            <div className="flex gap-4 justify-center">
              <a href="/dashboard" className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <Heart className="mr-2 h-5 w-5" />
                Get Started
              </a>
              <a href="/contact" className="inline-flex items-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}