"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Linkedin, Instagram, Youtube, ArrowRight } from "lucide-react";

// Footer sections organized by column
const footerSections = {
  learn: [
    { label: "Start Here", href: "/start-here" },
    { label: "Focus Areas", href: "/focus-areas" },
    { label: "Tax Rights", href: "/tax-rights" },
    { label: "Insights", href: "/insights" },
    { label: "News & Updates", href: "/news" },
  ],
  quickLinks: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Focus Areas", href: "/focus-areas" },
    { label: "Recent Insights", href: "/insights" },
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
    <footer className="bg-slate-900 text-white relative overflow-hidden">
      {/* Background decorative element */}
      <div className="absolute top-0 right-0 w-full h-full opacity-5">
        <Image
          src="/slider.jpg"
          alt=""
          fill
          className="object-cover object-right-top"
        />
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-16 relative">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Company info - Column 1 */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/taxcode logo.png"
                alt="Tax Code Logo"
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
              <div>
                <div className="text-xl font-bold">Tax Code</div>
                <div className="text-sm text-slate-400">Understanding Tax Through Law, Process and Justice</div>
              </div>
            </div>

            <p className="text-slate-300 mb-6 leading-relaxed text-base">
              A non-profit organisation established to advance tax awareness, advocacy and strategic guidance through law, policy and process.
            </p>

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

          {/* Quick Links - Column 2 */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-white mb-4">Learn</h3>
              <ul className="space-y-3">
                {footerSections.learn.map((link, index) => (
                  <li key={`${link.href}-${index}`}>
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
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-3">
                {footerSections.quickLinks.map((link, index) => (
                  <li key={`${link.href}-${index}`}>
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

          {/* Newsletter Signup - Column 3 */}
          <div className="lg:col-span-4 relative">
            {/* Decorative logo */}
            <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
              <Image
                src="/tax code transparent.png"
                alt=""
                fill
                className="object-contain"
              />
            </div>

            <h3 className="text-lg font-semibold text-white mb-4">Stay Informed</h3>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Get tax reform updates, rights alerts, and educational resources delivered to your inbox.
            </p>
            <div className="flex gap-3 max-w-sm">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-slate-500"
              />
              <Button className="bg-slate-700 hover:bg-slate-600 text-white px-6">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <p className="text-sm text-slate-400">
                © 2025 Tax Code. Made with care for Nigeria.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}