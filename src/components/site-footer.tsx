"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Facebook, Twitter, Linkedin, Instagram, Youtube, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
    { label: "Our Team", href: "/team" },
    { label: "Contact", href: "/contact" },
    { label: "Focus Areas", href: "/focus-areas" },
    { label: "Recent Insights", href: "/insights" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/share/1FgjXAU1tV/?mibextid=wwXIfr", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com/taxcodeng", label: "Twitter" },
  { icon: Instagram, href: "https://www.instagram.com/taxcodeng/?igsh=MWx1dGc0Y2xzaGxw", label: "Instagram" },
];

export default function SiteFooter() {
  const [email, setEmail] = useState("");
  const [frequency, setFrequency] = useState("weekly");
  const [interests, setInterests] = useState<string[]>([]);
  const [consentGiven, setConsentGiven] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const interestOptions = [
    { id: "tax_reforms", label: "Tax Reforms" },
    { id: "insights", label: "Weekly Insights" },
    { id: "news", label: "News Roundup" },
  ];

  const handleInterestChange = (interestId: string, checked: boolean) => {
    if (checked) {
      setInterests(prev => [...prev, interestId]);
    } else {
      setInterests(prev => prev.filter(id => id !== interestId));
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !consentGiven) {
      toast({
        title: "Validation Error",
        description: "Please enter your email and agree to the privacy policy.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          frequency,
          interests,
          source: 'footer',
          consentGiven,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Successfully subscribed!",
          description: data.syncWarning 
            ? "You're subscribed! Mailchimp sync may take a few minutes."
            : "Check your email for confirmation.",
        });
        
        // Reset form
        setEmail("");
        setInterests([]);
        setConsentGiven(false);
      } else {
        throw new Error(data.error || 'Subscription failed');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            
            <form onSubmit={handleSubscribe} className="space-y-4 max-w-sm">
              {/* Email Input */}
              <div>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-slate-500 w-full"
                />
              </div>

              {/* Frequency Selector */}
              <div>
                <Select value={frequency} onValueChange={setFrequency} disabled={isLoading}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue placeholder="Choose frequency" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="daily" className="text-white">Daily Updates</SelectItem>
                    <SelectItem value="weekly" className="text-white">Weekly Digest</SelectItem>
                    <SelectItem value="monthly" className="text-white">Monthly Summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Interest Checkboxes */}
              <div className="space-y-2">
                <p className="text-xs text-slate-400 mb-2">Content preferences:</p>
                <div className="space-y-2">
                  {interestOptions.map((interest) => (
                    <div key={interest.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest.id}
                        checked={interests.includes(interest.id)}
                        onCheckedChange={(checked) => 
                          handleInterestChange(interest.id, checked as boolean)
                        }
                        disabled={isLoading}
                        className="border-slate-600 data-[state=checked]:bg-slate-600"
                      />
                      <label 
                        htmlFor={interest.id} 
                        className="text-sm text-slate-300 cursor-pointer"
                      >
                        {interest.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="consent"
                  checked={consentGiven}
                  onCheckedChange={(checked) => setConsentGiven(checked as boolean)}
                  disabled={isLoading}
                  className="border-slate-600 data-[state=checked]:bg-slate-600 mt-0.5"
                />
                <label htmlFor="consent" className="text-xs text-slate-400 leading-relaxed">
                  I agree to receive emails and accept the privacy policy.
                </label>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isLoading || !email || !consentGiven}
                className="bg-slate-700 hover:bg-slate-600 text-white w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

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