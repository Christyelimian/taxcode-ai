"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Heart,
} from "lucide-react";

const footerLinks = {
  learn: [
    { label: "Start Here", href: "/start-here" },
    { label: "Focus Areas", href: "/focus-areas" },
    { label: "Tax Rights", href: "/tax-rights" },
    { label: "Insights", href: "/insights" },
    { label: "News & Updates", href: "/news" },
  ],
  tools: [
    { label: "AI Tax Assistant", href: "/assistant" },
    { label: "Tax Calculator", href: "/dashboard/calculator" },
    { label: "Directory", href: "/directory" },
    { label: "Resources", href: "/resources" },
  ],
  academy: [
    { label: "Browse Courses", href: "/academy" },
    { label: "Training Modules", href: "/dashboard/modules" },
    { label: "Certifications", href: "/dashboard/modules" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Accessibility", href: "/accessibility" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Company info */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/taxcode logo.png"
                alt="TaxCode AI Logo"
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
              <div>
                <div className="text-xl font-bold">TaxCode</div>
                <div className="text-sm text-slate-400">Nigeria's Tax Technology Ecosystem</div>
              </div>
            </div>

            <p className="text-slate-300 mb-6 leading-relaxed">
              Tax Code is a non-profit tax awareness, advocacy and advisory organisation focused on advancing tax understanding beyond rates and revenue. The website will serve as the organisation's primary public interface, knowledge hub and institutional voice, supporting its mandate to promote sound tax understanding, voluntary compliance, fairness, transparency and accountability within Nigeria's tax system.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm text-slate-300">
                  <div>315 Agura Hotel Area 10 Abuja</div>
                  <div>Moshood Abiola Rd, Garki</div>
                  <div>Abuja 900103, Federal Capital Territory</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <a href="tel:+2341234567890" className="text-sm text-slate-300 hover:text-white transition-colors">
                  +234 (0) 123 456 7890
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <a href="mailto:hello@taxcode.ng" className="text-sm text-slate-300 hover:text-white transition-colors">
                  hello@taxcode.ng
                </a>
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <div className="lg:col-span-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="font-semibold text-white mb-4">Learn</h3>
              <ul className="space-y-2">
                {footerLinks.learn.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Tools</h3>
              <ul className="space-y-2">
                {footerLinks.tools.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Academy</h3>
              <ul className="space-y-2">
                {footerLinks.academy.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter signup */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <div className="max-w-md mx-auto text-center lg:mx-0 lg:text-left lg:max-w-none lg:flex lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0 lg:mr-8">
              <h3 className="text-lg font-semibold text-white mb-2">Stay Informed</h3>
              <p className="text-slate-300 text-sm">
                Get tax reform updates, rights alerts, and educational resources delivered to your inbox.
              </p>
            </div>
            <div className="flex gap-2 max-w-sm mx-auto lg:mx-0">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-primary"
              />
              <Button className="bg-primary hover:bg-primary/90">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <p className="text-sm text-slate-400">
                © 2025 TaxCode. Made with <Heart className="inline h-4 w-4 text-red-500 mx-1" /> for Nigeria.
              </p>
              <div className="flex items-center gap-4">
                {footerLinks.legal.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400 mr-2">Follow us:</span>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-slate-400 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}