
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BookOpen,
  Bot,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileText,
  Gamepad2,
  Globe,
  Goal,
  Handshake,
  HeartHandshake,
  Mail,
  MapPin,
  Phone,
  Landmark,
  Target,
  Users,
  TrendingUp,
  Calculator,
  CalendarCheck,
  Briefcase,
  MessageCircleQuestion,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HomepageChatbot from "@/components/homepage-chatbot";
import { useState, useEffect } from "react";
import { getTeamMembers, type TeamMember } from "@/app/actions";
import { Skeleton } from "@/components/ui/skeleton";

const partners = [
  { name: "LAPIN Reform", description: "A global policy think tank with over a decade of impact, including its instrumental and pivotal role in the passage of the Petroleum Industry Act, 2021." },
  { name: "Tax Code Trust", description: "A newly established tax awareness and advocacy platform." },
];

const platformFeatures = [
    {
        icon: <MessageCircleQuestion className="h-10 w-10 text-primary" />,
        title: "Tax Assistant",
        description: "Get instant answers to complex tax questions from our expert system trained on the new Tax Reform Act.",
        link: "/dashboard/assistant"
    },
    {
        icon: <Briefcase className="h-10 w-10 text-primary" />,
        title: "Smart Tools",
        description: "Real-time calculators, compliance checkers, and automated document generators.",
        link: "/dashboard/tools"
    },
    {
        icon: <GraduationCap className="h-10 w-10 text-primary" />,
        title: "Gamified Learning",
        description: "Master tax concepts with interactive modules, badges, leaderboards, and progress tracking.",
        link: "/dashboard/modules"
    },
    {
        icon: <ShieldCheck className="h-10 w-10 text-primary" />,
        title: "Real-Time Compliance Monitoring",
        description: "Live tracking of tax obligations with automated alerts and a risk assessment dashboard.",
        link: "/dashboard"
    },
];

const interactiveTools = [
    {
        icon: <Calculator className="h-8 w-8 text-primary" />,
        title: "Tax Calculator",
        description: "Estimate your liability under the new reform."
    },
    {
        icon: <CheckCircle2 className="h-8 w-8 text-primary" />,
        title: "Compliance Checker",
        description: "Verify your compliance status instantly."
    },
    {
        icon: <FileText className="h-8 w-8 text-primary" />,
        title: "Document Generator",
        description: "Automate the creation of tax forms."
    },
    {
        icon: <CalendarCheck className="h-8 w-8 text-primary" />,
        title: "Deadline Tracker",
        description: "Never miss an important filing date again."
    }
];


const whoShouldAttend = [
  "Public Officials & MDA Staff",
  "Business Owners & Entrepreneurs",
  "Finance & Legal Professionals",
  "Tax Consultants & Compliance Officers",
  "NGOs, Trade Associations & Educational Institutions",
  "Professional Bodies and Regulatory Authorities",
];

const trainingModules = [
  {
    title: "MODULE 1: Understanding the New Tax Reform Act – Scope, Structure and Key Changes",
    dates: "(1st – 4th September 2025) and (20th 23rd October, 2025)",
    content: [
      "Overview of the New Tax Act: Timeline and Legislative Intent",
      "Structural breakdown: key parts and tax instruments covered",
      "Comparative highlights: old vs. new legal framework",
      "Effective date, transitional provisions, and compliance triggers",
      "Key departures from previous tax laws",
    ],
  },
  {
    title: "MODULE 2: Strategic Policy Shifts in the New Tax Regime",
    dates: "(15th - 18th September) and (27th 30th October, 2025)",
    content: [
      "Policy rationale behind the reforms",
      "Fiscal federalism, tax equity and efficiency principles",
      "Incentives, reliefs and exclusions under the new Act",
      "Impact on national revenue targets and economic growth",
      "Role of international best practices and global tax reforms (e.g., BEPS, OECD guidelines)",
    ],
  },
  {
    title: "MODULE 3: Tax Administration and Institutional Realignment",
    dates: "(22nd – 25th September) and (10th – 13th November, 2025)",
    content: [
      "Role and powers of the present FIRS and State Tax Authorities under the new Act",
      "Changes in assessment, collection, enforcement and taxpayer registration",
      "Introduction of technology-driven compliance systems",
      "Integration of MDAs and parastatals into tax collection and reporting",
      "Audit, investigation and compliance monitoring enhancements",
    ],
  },
  {
    title: "MODULE 4: Taxpayer Classification and Obligations in the New System",
    dates: "(6th – 9th October, 2025) and (17th – 20th November, 2025)",
    content: [
      "Who is a taxable person under the new Act?",
      "Classification of taxpayers: individuals, MSMEs, large corporations, MDAs",
      "Obligations: Filing, returns, withholding, record-keeping",
      "New penalties, offences, and enforcement powers",
      "Compliance timelines and sector-specific obligations",
    ],
  },
  {
    title: "MODULE 5: Transition Strategy for Businesses and MDAs",
    dates: "(13th – 16th October, 2025) and (24th – 27th November, 2025)",
    content: [
      "Business audit and compliance assessment tools",
      "Re-aligning accounting, HR and finance systems",
      "Managing legacy liabilities and reconciling transitional tax years",
      "Tailored roadmap for MDAs and government-linked entities",
      "Risk mitigation and internal control measures",
    ],
  },
  {
    title: "MODULE 6: Tax Planning, Strategy and Risk Management",
    dates: "(1st – 4th September 2025) and (20th 23rd October, 2025)",
    content: [
      "Strategic tax planning within the legal framework",
      "Tax avoidance vs. tax evasion: boundaries and safeguards",
      "Risk assessment and tax exposure management",
      "Role of financial advisors and consultants",
      "Long-term implications for investment and pricing models",
    ],
  },
];

const feeStructure = [
  { modules: 1, totalBefore: "185,000", discountApplied: "0%", discountAmount: "0", finalPayable: "185,000" },
  { modules: 2, totalBefore: "370,000", discountApplied: "0%", discountAmount: "0", finalPayable: "370,000" },
  { modules: 3, totalBefore: "555,000", discountApplied: "10%", discountAmount: "55,500", finalPayable: "499,500" },
  { modules: 4, totalBefore: "740,000", discountApplied: "~12.8%", discountAmount: "~94,500", finalPayable: "645,500" },
  { modules: 5, totalBefore: "925,000", discountApplied: "~14.9%", discountAmount: "~137,750", finalPayable: "787,250" },
  { modules: 6, totalBefore: "1,110,000", discountApplied: "~16.9%", discountAmount: "~187,250", finalPayable: "922,750" },
  { modules: 7, totalBefore: "1,295,000", discountApplied: "~18.6%", discountAmount: "~241,250", finalPayable: "1,053,750" },
  { modules: 8, totalBefore: "1,480,000", discountApplied: "~20.0%", discountAmount: "~296,000", finalPayable: "1,184,000" },
  { modules: 9, totalBefore: "1,665,000", discountApplied: "~21.2%", discountAmount: "~352,150", finalPayable: "1,312,850" },
  { modules: 10, totalBefore: "1,850,000", discountApplied: ">50%", discountAmount: "—", finalPayable: "890,000" },
];

export default function HomePage() {
  const [faculty, setFaculty] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllFaculty, setShowAllFaculty] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8); 

  useEffect(() => {
    async function fetchFaculty() {
      setIsLoading(true);
      const result = await getTeamMembers();
      if (result.success && result.data) {
        setFaculty(result.data);
      }
      setIsLoading(false);
    }
    fetchFaculty();
  }, []);

  useEffect(() => {
    const getVisibleCount = () => {
      if (window.innerWidth < 768) return 4;
      if (window.innerWidth < 1024) return 6;
      return 8;
    };

    setVisibleCount(getVisibleCount());

    const handleResize = () => setVisibleCount(getVisibleCount());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const facultyToShow = showAllFaculty ? faculty : faculty.slice(0, visibleCount);

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 md:pt-32 md:pb-40 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/hero.jpg')" }}>
           <div className="absolute inset-0 -z-10 bg-black/50"></div>
            <div className="container mx-auto px-4">
                <div className="max-w-2xl">
                    <Badge variant="secondary" className="mb-4 text-sm font-semibold">Embracing the New Tax Order</Badge>
                    <h1 className="text-4xl font-headline font-extrabold tracking-tight text-white md:text-6xl">
                        The Future of Tax is Here.
                    </h1>
                    <p className="mt-6 text-lg text-white/90 md:text-xl">
                        Nigeria's Premier Tax Reform Platform, empowering citizens, businesses, and institutions for the 2026 Tax Revolution.
                    </p>
                    <div className="mt-10 flex gap-4">
                        <Button size="lg" asChild className="text-base font-bold">
                            <a href="#modules">Register for Training</a>
                        </Button>
                        <Button size="lg" variant="outline" asChild className="text-base font-bold bg-white/10 border-white/20 text-white hover:bg-white/20">
                            <Link href="/dashboard/tools">Explore the Tools</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>

        {/* Partners */}
        <section id="partners" className="py-12 bg-primary/5">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4 items-center">
                   <div className="flex justify-center items-center gap-2">
                     <Handshake className="h-6 w-6 text-muted-foreground" />
                     <span className="text-lg font-bold text-muted-foreground">LAPIN Reform</span>
                   </div>
                   <div className="flex justify-center items-center gap-2">
                     <HeartHandshake className="h-6 w-6 text-muted-foreground" />
                     <span className="text-lg font-bold text-muted-foreground">Tax Code Trust</span>
                   </div>
                   <div className="text-lg font-bold text-muted-foreground">The New York Times</div>
                   <div className="text-lg font-bold text-muted-foreground">Forbes</div>
                </div>
            </div>
        </section>


        {/* Overview */}
        <section id="overview" className="py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="grid gap-16 md:grid-cols-2 items-start">
              <div className="relative">
                <Image
                    src="https://images.unsplash.com/photo-1629487687207-e0f3980c201a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxUYXh8ZW58MHx8fHwxNzUyMzU5MzYxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                    width={600}
                    height={400}
                    alt="Tax professionals collaborating"
                    className="rounded-xl shadow-2xl w-full h-auto max-h-[450px] object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-3xl font-headline font-bold text-primary">About TaxCode</h2>
                <p className="mt-4 text-lg text-foreground/80">
                  With the recent signing of the Tax Reform Bill into law, a transformative shift in Nigeria’s tax landscape is underway. TaxCode is a platform born from this reform, designed to ensure a strategic and inclusive transition for individuals, businesses, and public institutions.
                </p>
                <p className="mt-4 font-semibold text-foreground">Our platform provides the tools, training, and community needed to navigate the new normal in tax compliance and administration.</p>
                 <Button asChild variant="link" className="p-0 mt-4 text-lg self-start">
                    <a href="#features">Learn More <ChevronRight className="ml-1"/></a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Features Section */}
        <section id="features" className="bg-primary/5 py-24 md:py-32">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-3xl font-headline font-bold text-primary">A Complete Tax Ecosystem</h2>
                    <p className="mx-auto mt-4 max-w-3xl text-lg text-foreground/80">
                        TaxCode is more than just information. It's a complete ecosystem of tools and resources designed to simplify your tax life.
                    </p>
                </div>
                 <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {platformFeatures.map((feature, index) => (
                        <Link href={feature.link} key={index} className="flex">
                            <Card className="text-center bg-card hover:shadow-xl transition-shadow hover:-translate-y-2 h-full w-full flex flex-col">
                                <CardHeader>
                                    <div className="mx-auto">{feature.icon}</div>
                                    <CardTitle className="mt-4 text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="link" className="w-full">
                                        Go to {feature.title} <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>

        {/* Training Modules */}
        <section id="modules" className="py-24 md:py-32">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-3xl font-headline font-bold text-primary">Transition Training</h2>
                     <p className="mx-auto mt-4 max-w-3xl text-lg text-foreground/80">
                        Our curriculum is divided into comprehensive modules, providing deep insights and practical strategies for the new tax era.
                    </p>
                </div>
                <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {trainingModules.slice(0, 6).map((module, index) => (
                        <Card key={index} className="group relative flex flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                            <CardHeader>
                                <CardTitle className="font-headline text-lg text-primary">{module.title}</CardTitle>
                                <p className="text-sm font-semibold text-muted-foreground pt-2">{module.dates}</p>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <ul className="space-y-2">
                                    {module.content.slice(0, 2).map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm">
                                            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary/80" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <div className="absolute inset-0 bg-primary/95 p-6 text-primary-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col">
                                <h3 className="font-headline text-lg font-bold">{module.title}</h3>
                                <p className="text-sm font-semibold text-primary-foreground/80 mb-4">{module.dates}</p>
                                <ul className="space-y-2 flex-grow overflow-y-auto text-sm">
                                    {module.content.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button variant="secondary" className="mt-auto w-full">Learn More</Button>
                            </div>
                        </Card>
                    ))}
                </div>
                <div className="mt-16 text-center">
                    <Button asChild size="lg" variant="outline">
                        <Link href="#">
                            Explore All Modules & Marketplace
                            <ChevronRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
        
        {/* Pricing */}
        <section id="pricing" className="bg-primary/5 py-24 md:py-32">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-3xl font-headline font-bold text-primary">Fee Structure</h2>
                     <p className="mx-auto mt-4 max-w-3xl text-lg text-foreground/80">
                       We offer a flexible fee structure with progressive discounts to encourage comprehensive learning.
                    </p>
                    <Badge variant="secondary" className="mt-4 text-base font-semibold">Base cost per module: ₦185,000</Badge>
                </div>
                <Card className="mt-12 overflow-hidden border-2 border-primary/20 shadow-xl">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-primary/10">
                        <TableHead className="w-[150px] font-bold text-primary">No. of Modules</TableHead>
                        <TableHead className="font-bold text-primary">Total Before Discount</TableHead>
                        <TableHead className="font-bold text-primary">Discount</TableHead>
                        <TableHead className="font-bold text-primary">You Save</TableHead>
                        <TableHead className="text-right font-bold text-primary">What You Pay</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feeStructure.map((row) => (
                        <TableRow key={row.modules} className="hover:bg-primary/5">
                          <TableCell className="font-bold">{row.modules}</TableCell>
                          <TableCell className="text-muted-foreground line-through">{row.totalBefore}</TableCell>
                          <TableCell>
                             <Badge variant={row.discountApplied === "0%" ? "outline" : "default"} className={row.discountApplied === ">50%" ? "bg-green-600 text-white" : ""}>
                                {row.discountApplied}
                             </Badge>
                          </TableCell>
                          <TableCell className="text-green-600 font-medium">{row.discountAmount === "—" ? "—" : `₦${row.discountAmount}`}</TableCell>
                          <TableCell className="text-right font-bold text-xl text-primary">₦{row.finalPayable}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
                 <div className="mt-8 max-w-4xl mx-auto">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="font-bold text-lg">Key Notes & Conditions</AccordionTrigger>
                        <AccordionContent>
                           <ul className="mt-2 list-disc space-y-2 pl-5 text-muted-foreground">
                              <li>The progressive discount structure encourages broader participation by reducing the cost per module as more modules are taken, with a flat rate of ₦890,000 for full programme enrolment—reflecting over 50% in total savings.</li>
                              <li>Fees cover training materials, certification, refreshments, a post-training tax reform toolkit, and one-month advisory support.</li>
                              <li>Discounts are strictly cumulative and apply progressively; no refunds will be issued for partial attendance under the flat fee plan.</li>
                              <li>Group and institutional discounts are available upon request for teams of five or more, including special early bird or partner-based offers.</li>
                            </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </section>

        {/* Faculty Section */}
        <section id="faculty" className="py-24 md:py-32">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <Badge variant="secondary" className="mb-4 text-sm font-semibold">We're Hiring!</Badge>
                    <h2 className="text-3xl font-headline font-bold text-primary">Meet The Experts</h2>
                    <p className="mx-auto mt-4 max-w-3xl text-lg text-foreground/80">
                        Learn from a team of distinguished experts and seasoned professionals at the forefront of tax reform and policy in Nigeria.
                    </p>
                </div>
                <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
                    {isLoading ? (
                        [...Array(8)].map((_, index) => (
                           <Card key={index} className="text-center p-4">
                                <Skeleton className="h-24 w-24 mx-auto rounded-full" />
                                <Skeleton className="mt-4 h-5 w-3/4 mx-auto" />
                                <Skeleton className="mt-2 h-4 w-1/2 mx-auto" />
                                <Skeleton className="mt-2 h-3 w-full mx-auto" />
                           </Card>
                        ))
                    ) : (
                        facultyToShow.map((member) => (
                            <Card key={member.id} className="text-center p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <Avatar className="h-24 w-24 mx-auto border-4 border-primary/10">
                                    <AvatarImage src={member.image} data-ai-hint="professional headshot" alt={member.name} />
                                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <h3 className="mt-4 text-base font-bold">{member.name}</h3>
                                <p className="text-sm text-primary font-medium">{member.title}</p>
                                <p className="mt-2 text-xs text-muted-foreground flex-grow">{member.role}</p>
                            </Card>
                        ))
                    )}
                </div>
                {!isLoading && faculty.length > visibleCount && !showAllFaculty && (
                    <div className="mt-12 text-center">
                        <Button onClick={() => setShowAllFaculty(true)} variant="outline">
                            Show All Experts
                        </Button>
                    </div>
                )}
                 <Card className="mt-20 bg-primary/5 border-2 border-dashed border-primary/20">
                    <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                        <div>
                            <h3 className="text-2xl font-headline font-bold text-primary">Join Our Team Now</h3>
                            <p className="mt-2 text-muted-foreground max-w-2xl">
                                We are always looking for passionate and talented individuals to join our mission. If you are an expert in tax, law, finance, or technology, we want to hear from you.
                            </p>
                        </div>
                        <Button size="lg" asChild className="shrink-0">
                            <Link href="#" className="text-green-600">
                                Learn More <ArrowRight className="ml-2" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </section>
        
        {/* Contact */}
        <section id="contact" className="bg-primary/5 py-24 md:py-32">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-headline font-bold text-primary">Stay Ahead. Stay Compliant.</h2>
                <p className="mx-auto mt-4 max-w-3xl text-lg text-foreground/80">Join the LAPIN–Tax Code Transition Training Series Today. Empowering Nigeria’s tax ecosystem for a smarter, simpler future.</p>
                <Card className="mx-auto mt-12 max-w-lg text-left shadow-lg">
                  <CardHeader>
                      <CardTitle>Registration & Enquiries</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="flex items-center gap-4">
                          <Mail className="h-5 w-5 text-muted-foreground"/>
                          <a href="mailto:info@taxcode.com.ng" className="hover:underline text-green-600">info@taxcode.com.ng</a>
                      </div>
                       <div className="flex items-center gap-4">
                          <Phone className="h-5 w-5 text-muted-foreground"/>
                          <a href="tel:+2348065417972" className="hover:underline text-green-600">+234 806 541 7972</a>
                      </div>
                       <div className="flex items-center gap-4">
                          <Globe className="h-5 w-5 text-muted-foreground"/>
                           <a href="http://www.taxcode.com.ng/taxreform/training2025" target="_blank" rel="noopener noreferrer" className="hover:underline text-green-600">www.taxcode.com.ng/taxreform/training2025</a>
                      </div>
                  </CardContent>
                </Card>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <Image src="/taxcode logo.png" alt="TaxCode AI Logo" width={96} height={96} />
          </div>
          <div className="flex justify-center gap-6 mb-8">
             <a href="/" className="hover:text-primary transition-colors">Home</a>
            <a href="/about" className="hover:text-primary transition-colors">About</a>
            <a href="/focus-areas" className="hover:text-primary transition-colors">Focus Areas</a>
            <a href="/insights" className="hover:text-primary transition-colors">Insights</a>
            <a href="/tools" className="hover:text-primary transition-colors">Tools</a>
            <a href="/training" className="hover:text-primary transition-colors">Training</a>
            <a href="/news" className="hover:text-primary transition-colors">News</a>
            <a href="/contact" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <p className="text-background/60">&copy; {new Date().getFullYear()} LAPIN Reform & Tax Code Trustees. All Rights Reserved.</p>
          <p className="mt-2 text-background/60">For further information, please call Dr. Jeremiah Akpe, 0806 541 7972</p>
        </div>
      </footer>
      <HomepageChatbot />
    </div>
  );
}
