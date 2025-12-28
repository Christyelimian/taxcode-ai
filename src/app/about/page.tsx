import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Scale, Target, Shield } from "lucide-react"

export const metadata = {
  title: "About Tax Code",
  description:
    "A non-profit organisation advancing tax awareness, advocacy and strategic guidance through law, policy and process.",
}

/* ---------------- DATA ---------------- */

const philosophyPillars = [
  {
    title: "Clarity",
    description:
      "Plain language explanations, transparent processes, and accessible guidance.",
  },
  {
    title: "Fairness",
    description:
      "Equal treatment, rights-based administration, and objective standards.",
  },
  {
    title: "Trust",
    description:
      "Independence, credibility, due process, and institutional accountability.",
  },
]

const approachCards = [
  {
    title: "Tax Decision-Making Process",
    description:
      "How tax decisions are made, when powers may be exercised, and what makes actions lawful.",
    icon: Scale,
  },
  {
    title: "Lawful Use of Powers",
    description:
      "Understanding the scope and limits of tax authority powers and taxpayer protections.",
    icon: Target,
  },
  {
    title: "Valid vs Invalid Actions",
    description:
      "Distinguishing lawful administrative actions from those open to challenge.",
    icon: Shield,
  },
]

/* ---------------- PAGE ---------------- */

export default function AboutPage() {
  return (
    <div className="bg-[#F8F9FB] text-[#1F2933]">

      {/* HERO */}
      <section className="relative h-[80vh] flex items-center">
        <Image
          src="/about.jpg"
          alt="About Tax Code"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-5xl px-8 mx-auto text-white">
          <p className="tracking-widest text-sm mb-4">ABOUT TAX CODE</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Understanding Tax Through <br /> Law, Process and Justice
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-200">
            Advancing tax awareness, advocating for clarity, and strengthening
            lawful compliance.
          </p>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section id="who" className="py-24 px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-8">Who We Are</h2>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                Tax Code is a non-profit organisation established to advance tax
                awareness, advocacy and strategic guidance through law, policy
                and process.
              </p>
              <p>
                We bridge the gap between complex tax legislation and its
                real-world application — from assessment to enforcement and
                dispute resolution.
              </p>
              <p>
                Our work helps taxpayers understand their rights, obligations,
                and the lawful limits of administrative discretion.
              </p>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/who-we-are.jpg"
              alt="Who We Are"
              width={700}
              height={500}
              className="object-cover"
            />
            <div className="absolute bottom-6 left-6 bg-[#9E1B1F] text-white px-4 py-2 rounded-lg text-sm max-w-xs">
              Bridging complex tax law and practical application
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section id="philosophy" className="py-24 px-8 bg-[#F3F4F6]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <Image
            src="/philosophy.jpg"
            alt="Our Philosophy"
            width={700}
            height={500}
            className="rounded-2xl shadow-2xl object-cover"
          />

          <div>
            <h2 className="text-4xl font-bold mb-8">Our Philosophy</h2>
            <p className="text-lg text-gray-700 mb-6">
              Effective taxation depends on clarity, fairness and trust.
              Sustainable revenue mobilisation occurs when taxpayers understand
              the system and can predict its operation.
            </p>
            <p className="text-lg text-gray-700 mb-12">
              We view taxation as part of the social contract between the state
              and the public, grounded in transparency and due process.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {philosophyPillars.map((p) => (
                <div
                  key={p.title}
                  className="bg-white p-6 rounded-xl border-l-4 border-[#9E1B1F]"
                >
                  <h3 className="font-bold text-xl mb-2">{p.title}</h3>
                  <p className="text-gray-600 text-sm">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section id="approach" className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Our Approach</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {approachCards.map((card) => (
              <div
                key={card.title}
                className="bg-white p-8 rounded-xl border shadow-sm"
              >
                <div className="w-12 h-12 bg-[#9E1B1F] rounded-lg flex items-center justify-center mb-6">
                  <card.icon className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-4">{card.title}</h3>
                <p className="text-gray-600">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-8 border-t bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">
            Explore our work and areas of focus
          </h3>
          <p className="text-gray-600 mb-8">
            Learn more about our focus areas and how we help navigate tax law and
            process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-[#9E1B1F] text-white px-8 py-3">
              <Link href="/focus-areas">Explore Focus Areas</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-[#9E1B1F] text-[#9E1B1F]"
            >
              <Link href="/insights">Read Insights</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
