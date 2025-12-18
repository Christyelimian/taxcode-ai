import { Metadata } from 'next'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  Landmark,
  Target,
  Users,
  Shield,
  Brain,
  Globe,
  Award,
  Heart,
  BookOpen,
  Sparkles,
  Scale,
  Eye,
  ShieldCheck,
  BarChart3,
  Workflow,
  CircuitBoard,
  Lock,
  Bot,
  Rocket,
  ChevronRight,
  ArrowUp,
  MessageCircle,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About TaxCode',
  description:
    "TaxCode: Nigeria's AI-powered tax education and compliance ecosystem. Law, process, justice—and intelligent technology.",
}

const nav = [
  { id: 'who', label: 'Who We Are' },
  { id: 'philosophy', label: 'Philosophy' },
  { id: 'objectives', label: 'Objectives' },
  { id: 'approach', label: 'Approach' },
  { id: 'governance', label: 'Governance' },
  { id: 'technology', label: 'Technology' },
  { id: 'faq', label: 'FAQ' },
]

const metrics = [
  { label: 'Users', value: '15,000+' },
  { label: 'Questions Answered', value: '50,000+' },
  { label: 'Verified Accuracy', value: '98%' },
  { label: 'States Covered', value: '4' },
]

const timeline = [
  { year: '2024', event: 'Founded as a non-profit initiative' },
  { year: '2025', event: 'AI platform development begins' },
  { year: '2026', event: 'Full ecosystem launch for Tax Reform' },
]

const philosophy = [
  { icon: Eye, title: 'Clarity', desc: 'Plain language, visual explanations, transparent processes.' },
  { icon: Scale, title: 'Fairness', desc: 'Equal treatment, rights-based approach, objective standards.' },
  { icon: ShieldCheck, title: 'Trust', desc: 'Data protection, independence, proven accuracy.' },
  { icon: Target, title: 'Accountability', desc: 'Oversight, dispute guidance, administrative limits.' },
  { icon: Rocket, title: 'Sustainability', desc: 'Voluntary compliance and long-term revenue health.' },
]

const objectives = [
  'Promote tax understanding and demystify processes',
  'Enable voluntary compliance with clear guidance',
  'Protect taxpayer rights and support dispute resolution',
  'Leverage AI to democratize expert guidance across languages',
  'Support evidence-based policy reform and implementation',
  'Build a sustainable revenue culture built on trust',
]

const approach = [
  { title: 'Research', icon: BookOpen, points: ['Legislative analysis', 'Case law study', 'Practice review'] },
  { title: 'Analyze', icon: BarChart3, points: ['Gap identification', 'Process mapping', 'Outcome assessment'] },
  { title: 'Explain', icon: Landmark, points: ['Plain language', 'Visual guides', 'Train AI models'] },
  { title: 'Empower', icon: Workflow, points: ['AI tools', 'Calculators', 'Document generators'] },
  { title: 'Advocate', icon: MegaphoneIcon, points: ['Policy proposals', 'Stakeholder engagement', 'Public interest'] },
]

function MegaphoneIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 8.5l6-3v13l-6-3M15 8.5v7M15 8.5H9a4 4 0 00-4 4 4 4 0 004 4h2" />
    </svg>
  )
}

const tech = [
  { icon: Brain, title: 'AI Reasoning', desc: 'Domain-tuned models trained on Nigerian tax law, FIRS guidance, and case law.' },
  { icon: CircuitBoard, title: 'Infrastructure', desc: 'Firebase auth, scalable storage, and real-time services.' },
  { icon: Lock, title: 'Security', desc: 'Encryption, least-privilege access, and regular audits.' },
  { icon: Globe, title: 'Multi-language', desc: 'English, Hausa, Yoruba, and Igbo support.' },
]

const faqs = [
  {
    q: 'Is TaxCode affiliated with FIRS or any tax authority?',
    a: 'No. TaxCode is independent and operates in the public interest. We are not an agent of any tax authority.',
  },
  {
    q: 'How accurate are AI responses?',
    a: 'Responses are grounded in Nigerian tax law, linked to sources where available, and frequently validated by experts.',
  },
  {
    q: 'Do you store my questions or data?',
    a: 'We prioritize privacy. Data is encrypted and access is limited. See our privacy policy for full details.',
  },
]

export default function AboutPage() {
  return (
    <div className="bg-background">
      {/* Top progress bar (visual cue; can be wired to scroll listener later) */}
      <div className="fixed top-0 left-0 right-0 h-1 z-30">
        <div className="h-full bg-gradient-to-r from-primary to-emerald-500 w-2/5" aria-hidden />
      </div>

      
      <section className="relative">
        <div className="container mx-auto px-4 pt-20 pb-10">
          <div className="grid lg:grid-cols-[280px_minmax(0,1fr)] gap-8">
            {/* Sidebar nav */}
            <aside className="hidden lg:block sticky top-20 self-start">
              <nav className="space-y-2">
                {nav.map((n) => (
                  <a key={n.id} href={`#${n.id}`} className="block px-3 py-2 rounded-md text-sm hover:bg-primary/10 hover:text-primary transition-colors">
                    {n.label}
                  </a>
                ))}
              </nav>
            </aside>

            {/* Main content */}
            <div>
              {/* Hero split */}
              <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
                <div>
                  <Badge variant="secondary" className="mb-4">About TaxCode</Badge>
                  <h1 className="text-5xl md:text-6xl font-headline font-bold text-foreground tracking-tight mb-6">
                    Beyond Rates and Revenue
                  </h1>
                  <p className="text-lg text-muted-foreground mb-6">
                    Leading Nigeria's tax transformation through law, process, justice—and intelligent technology.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/signup" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition">
                      <Sparkles className="h-5 w-5" /> Start Free
                    </Link>
                    <Link href="/dashboard/assistant" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition">
                      <Bot className="h-5 w-5" /> Try the AI
                    </Link>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -inset-6 bg-gradient-to-br from-emerald-500/10 to-primary/10 rounded-2xl blur-xl" aria-hidden />
                  <Card className="relative overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-primary">Milestones</CardTitle>
                      <CardDescription>Our journey to a national tax intelligence platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-5">
                        {timeline.map((item, idx) => (
                          <div key={item.year} className="flex items-center gap-4">
                            <div className="w-16 text-sm font-semibold text-primary">{item.year}</div>
                            <div className="flex-1 h-px bg-border" />
                            <div className="text-sm text-muted-foreground">{item.event}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                {metrics.map((m) => (
                  <Card key={m.label}>
                    <CardContent className="py-6 text-center">
                      <div className="text-3xl font-bold text-foreground">{m.value}</div>
                      <div className="text-xs uppercase tracking-wide text-muted-foreground mt-1">{m.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Who we are */}
              <section id="who" className="scroll-mt-24 mb-16">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-6">Who We Are</h2>
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div className="space-y-5 text-muted-foreground">
                    <p>
                      TaxCode is a non-profit initiative advancing tax awareness, advocacy, and strategic guidance for Nigerians. We translate law into plain language, and questions into precise, practical answers.
                    </p>
                    <p>
                      What began as an awareness movement is now Nigeria's first AI-powered tax education and compliance ecosystem—equipping citizens, businesses, and practitioners for the 2026 reforms and beyond.
                    </p>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Our Evolution</CardTitle>
                      <CardDescription>From advocacy to intelligent technology</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-muted/50">
                          <BookOpen className="h-6 w-6 text-primary mb-2" />
                          <div className="font-medium">Advocacy</div>
                          <p className="text-xs text-muted-foreground">Public interest education and rights protection.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                          <Users className="h-6 w-6 text-primary mb-2" />
                          <div className="font-medium">Education</div>
                          <p className="text-xs text-muted-foreground">Training, resources, and practical guides.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                          <Brain className="h-6 w-6 text-primary mb-2" />
                          <div className="font-medium">AI Platform</div>
                          <p className="text-xs text-muted-foreground">Instant guidance, calculators, and tools.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Philosophy */}
              <section id="philosophy" className="scroll-mt-24 mb-16">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-6">Our Philosophy</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {philosophy.map((p) => (
                    <Card key={p.title} className="group hover:shadow-lg transition">
                      <CardContent className="pt-6">
                        <p.icon className="h-8 w-8 text-primary mb-3" />
                        <div className="font-semibold mb-1">{p.title}</div>
                        <p className="text-sm text-muted-foreground">{p.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Objectives */}
              <section id="objectives" className="scroll-mt-24 mb-16">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-6">Our Objectives</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {objectives.map((o, i) => (
                    <Card key={i}>
                      <CardContent className="pt-6 flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                          {i + 1}
                        </div>
                        <p className="text-muted-foreground">{o}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Approach */}
              <section id="approach" className="scroll-mt-24 mb-16">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-6">Our Approach</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {approach.map((a) => (
                    <Card key={a.title} className="relative">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <a.icon className="h-6 w-6 text-primary" />
                          <CardTitle className="text-base">{a.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                          {a.points.map((pt) => (
                            <li key={pt}>{pt}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Governance */}
              <section id="governance" className="scroll-mt-24 mb-16">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-6">Promoters & Governance</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Independence & Ethics</CardTitle>
                      <CardDescription>Our public interest commitments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>Not an agent of any tax authority</li>
                        <li>No commercial compliance services</li>
                        <li>Transparent governance</li>
                        <li>Objective analysis and advocacy</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Leadership Snapshot</CardTitle>
                      <CardDescription>Experienced lawyers, policy strategists, and technologists</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-muted/50">
                          <div className="font-medium">Founder & Executive</div>
                          <p className="text-xs text-muted-foreground">Tax policy expert, legal practitioner</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                          <div className="font-medium">Chief Technology</div>
                          <p className="text-xs text-muted-foreground">AI and platforms engineering</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Technology */}
              <section id="technology" className="scroll-mt-24 mb-16">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-6">Technology & Innovation</h2>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {tech.map((t) => (
                    <Card key={t.title}>
                      <CardContent className="pt-6">
                        <t.icon className="h-7 w-7 text-primary mb-3" />
                        <div className="font-semibold mb-1">{t.title}</div>
                        <p className="text-sm text-muted-foreground">{t.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">See It in Action</CardTitle>
                    <CardDescription>Try the AI with limited queries</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      <Link href="/dashboard/assistant" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition">
                        <Bot className="h-5 w-5" /> Ask a Question
                      </Link>
                      <Link href="/dashboard/calculator" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition">
                        <CalculatorIcon className="h-5 w-5" /> Tax Calculator
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* FAQ */}
              <section id="faq" className="scroll-mt-24 mb-16">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-6">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((f, i) => (
                    <AccordionItem key={i} value={`item-${i}`}>
                      <AccordionTrigger>{f.q}</AccordionTrigger>
                      <AccordionContent>{f.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>

              {/* Final CTA */}
              <section className="mb-8">
                <Card>
                  <CardContent className="py-8 text-center">
                    <h3 className="text-2xl md:text-3xl font-headline font-bold mb-3">Ready to navigate tax with confidence?</h3>
                    <p className="text-muted-foreground mb-6">Join thousands of Nigerians using TaxCode to understand, comply, and thrive.</p>
                    <div className="flex gap-3 justify-center">
                      <Link href="/signup" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition">
                        <Heart className="h-5 w-5" /> Get Started
                      </Link>
                      <Link href="/about#technology" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition">
                        <ChevronRight className="h-5 w-5" /> Explore Features
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>
          </div>
        </div>
      </section>

      {/* Floating actions */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <a href="#top" className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow hover:scale-105 transition">
          <ArrowUp className="h-5 w-5" />
        </a>
        <Link href="/dashboard/assistant" className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-600 text-white shadow hover:scale-105 transition">
          <MessageCircle className="h-5 w-5" />
        </Link>
      </div>
    </div>
  )
}

function CalculatorIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8M8 11h8M8 15h3M13 15h3M8 19h3M13 19h3" />
    </svg>
  )
}