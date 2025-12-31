import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Scale, Shield, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecentInsights } from "@/app/actions";

export default async function NewHomePage() {
  // Fetch recent insights for the Featured Insights section
  const recentInsightsResult = await getRecentInsights(3);
  const recentInsights = recentInsightsResult.success ? recentInsightsResult.data : [];
  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <main>
        {/* Hero Slider */}
        <section className="relative overflow-hidden">
          <div className="relative h-[70vh] md:h-[80vh]">
            {/* Slides wrapper */}
            <div id="hero-slides" className="whitespace-nowrap transition-transform duration-700" style={{ transform: 'translateX(0%)' }}>
              {/* Slide 1 */}
              <div className="inline-block align-top w-full h-[70vh] md:h-[80vh] bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: "url('/slider.jpg')" }}>
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative container mx-auto px-4 h-full flex items-center">
                  <div className="text-white text-left whitespace-normal break-words w-full md:w-[60%] lg:w-1/2 md:max-w-[62ch] md:bg-black/25 md:backdrop-blur-sm md:border md:border-white/10 md:rounded-2xl md:p-8">
                    <Badge variant="secondary" className="mb-4 text-xs sm:text-sm font-semibold">
                      Beyond Rates and Revenue
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-headline font-extrabold tracking-tight">
                      Understanding Tax Through{' '}
                      <span className="bg-gradient-to-r from-emerald-500 to-primary bg-clip-text text-transparent">
                        Law, Process and Justice
                      </span>
                      .
                    </h1>
                    <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-white/90">
                      Tax Code is a public-interest platform advancing tax awareness, advocacy and strategic guidance by explaining how tax law actually works in practice, from assessment to enforcement and dispute resolution.
                    </p>
                    <div className="mt-7 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                      <Button size="lg" asChild className="text-base font-bold w-full sm:w-auto">
                        <a href="#features">Explore Features</a>
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        asChild
                        className="text-base font-bold w-full sm:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Link href="/about">Learn More</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Slide 2 (existing hero) */}
              <div className="inline-block align-top w-full h-[70vh] md:h-[80vh] bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: "url('/hero.jpg')" }}>
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative container mx-auto px-4 h-full flex items-center">
                  <div className="text-white text-left whitespace-normal break-words w-full md:w-[60%] lg:w-1/2 md:max-w-[62ch] md:bg-black/25 md:backdrop-blur-sm md:border md:border-white/10 md:rounded-2xl md:p-8">
                    <Badge variant="secondary" className="mb-4 text-xs sm:text-sm font-semibold">
                      Embracing the New Tax Order
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl font-headline font-extrabold tracking-tight md:text-6xl">
                      The Future of Tax is Here.
                    </h1>
                    <p className="mt-4 sm:mt-6 text-base sm:text-lg text-white/90 md:text-xl">
                      Nigeria's Premier Tax Reform Platform, empowering citizens, businesses, and institutions for the 2026 Tax Revolution.
                    </p>
                    <div className="mt-7 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                      <Button size="lg" asChild className="text-base font-bold w-full sm:w-auto">
                        <a href="#modules">Register for Training</a>
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        asChild
                        className="text-base font-bold w-full sm:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Link href="/dashboard/tools">Explore the Tools</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute inset-x-0 bottom-6 z-10 flex items-center justify-center gap-3">
              <button
                id="hero-prev"
                className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-white/40 hover:bg-white/70 transition"
                aria-label="Previous slide"
              ></button>
              <button
                id="hero-next"
                className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-white hover:bg-white/90 transition"
                aria-label="Next slide"
              ></button>
            </div>
          </div>

        </section>

        {/* What We Do */}
        <section className="py-24 md:py-32 bg-white border-t border-slate-200 relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <Image
              src="/tax code transparent.png"
              alt=""
              fill
              className="object-cover object-center"
            />
          </div>
          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-12">What We Do</h2>
              <div className="max-w-4xl mx-auto">
                <p className="text-xl text-slate-600 leading-relaxed mb-6">
                  Tax Code explains taxation beyond figures and deadlines. We examine power, process and accountability within the tax system, helping individuals, businesses and institutions understand their rights, obligations and the lawful limits of tax administration.
                </p>
                <p className="text-xl text-slate-600 leading-relaxed">
                  By clarifying how tax laws are interpreted, applied and enforced, we promote fair treatment, voluntary compliance and sustainable revenue outcomes.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-12 mt-20">
              <div className="text-center">
                <div className="w-20 h-20 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-8">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">Tax Awareness</h3>
                <p className="text-slate-600 leading-relaxed text-lg">Demystifying tax law through clear explanations and practical guidance for citizens and businesses.</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-8">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">Strategic Advocacy</h3>
                <p className="text-slate-600 leading-relaxed text-lg">Advocating for fair tax administration and supporting taxpayer rights through evidence-based policy dialogue.</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-8">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">Rights & Process</h3>
                <p className="text-slate-600 leading-relaxed text-lg">Clarifying taxpayer rights and the lawful limits of tax administration through process-focused education.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Start Here Call-out */}
        <section className="py-20 bg-slate-50 border-t border-slate-200 relative overflow-hidden">
          {/* Background accent */}
          <div className="absolute top-0 right-0 w-96 h-96 opacity-5 pointer-events-none">
            <Image
              src="/slider.jpg"
              alt=""
              fill
              className="object-cover"
            />
          </div>

          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <div className="bg-white/80 backdrop-blur-sm border-l-4 border-slate-900 p-10 rounded-r-xl shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div className="flex-1">
                  <Badge variant="secondary" className="mb-6 bg-slate-200 text-slate-800 border-0 text-sm font-medium px-4 py-2">START HERE</Badge>
                  <h3 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
                    Know Your Rights and Obligations
                  </h3>
                  <p className="text-slate-600 text-xl leading-relaxed">
                    Begin your journey to understanding tax law, process, and justice with our comprehensive guides.
                  </p>
                </div>
                <div className="lg:ml-12">
                  <Button asChild size="lg" variant="outline" className="border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white px-8 py-4 text-lg font-medium">
                    <Link href="/focus-areas">Taxpayer Guide</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Insights Section */}
        <section className="py-24 md:py-32 bg-white relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
            <Image
              src="/hero.jpg"
              alt=""
              fill
              className="object-cover"
            />
          </div>
          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
                Featured Insights & Explainers
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Structured explanations designed for clarity and understanding, not news
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentInsights.length > 0 ? (
                recentInsights.map((insight, index) => (
                  <Link key={insight.id} href={`/insights/${insight.slug}`} className="block group">
                    <Card className="bg-white border border-slate-200 hover:shadow-lg transition-shadow duration-300 group-hover:border-slate-300">
                      <CardContent className="p-8">
                        <Badge className="mb-6 bg-slate-900 text-white hover:bg-slate-800 text-sm">
                          {insight.category}
                        </Badge>
                        <h3 className="text-xl font-semibold text-slate-900 mb-4 leading-tight group-hover:text-slate-700 transition-colors">
                          {insight.title}
                        </h3>
                        <p className="text-slate-600 mb-6 leading-relaxed text-lg">
                          {insight.summary}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <span className="text-sm text-slate-500 font-medium">
                            Published: {insight.publishedAt
                              ? new Date(insight.publishedAt).toLocaleDateString()
                              : new Date(insight.createdAt).toLocaleDateString()
                            }
                          </span>
                          <div className="text-slate-900 font-medium hover:text-slate-700 transition-colors flex items-center gap-1 group-hover:text-slate-700">
                            Read more <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center text-muted-foreground py-12">
                  <div className="text-4xl mb-4">📚</div>
                  <p className="text-lg">No recent insights available yet.</p>
                  <p className="text-sm mt-2">Check back soon for new educational content.</p>
                </div>
              )}
            </div>

            <div className="text-center mt-16">
              <Link href="/insights" className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8 text-base font-bold">
                View All Insights
              </Link>
            </div>
          </div>
        </section>


      </main>
    </div>
  );
}






