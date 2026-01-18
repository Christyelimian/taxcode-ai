"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, ArrowRight, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface NewsletterSignupProps {
  source?: string;
  title?: string;
  description?: string;
  compact?: boolean;
  showFrequency?: boolean;
  showInterests?: boolean;
  className?: string;
}

const interestOptions = [
  { id: "tax_reforms", label: "Tax Reforms", description: "Latest tax law changes" },
  { id: "insights", label: "Weekly Insights", description: "Analysis and commentary" },
  { id: "news", label: "News Roundup", description: "Tax-related news summary" },
];

export default function NewsletterSignup({
  source = "page",
  title = "Stay Informed",
  description = "Get tax reform updates, insights, and news delivered to your inbox.",
  compact = false,
  showFrequency = true,
  showInterests = true,
  className = "",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [frequency, setFrequency] = useState("weekly");
  const [interests, setInterests] = useState<string[]>([]);
  const [consentGiven, setConsentGiven] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
          source,
          consentGiven,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        toast({
          title: "Successfully subscribed!",
          description: data.syncWarning 
            ? "You're subscribed! Mailchimp sync may take a few minutes."
            : "Check your email for confirmation.",
        });
        
        // Reset form after delay
        setTimeout(() => {
          setEmail("");
          setInterests([]);
          setConsentGiven(false);
          setIsSuccess(false);
        }, 3000);
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

  if (compact) {
    return (
      <form onSubmit={handleSubscribe} className={`flex gap-2 ${className}`}>
        <div className="flex-1">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading || isSuccess}
            className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-slate-500"
          />
        </div>
        <Button 
          type="submit" 
          disabled={isLoading || isSuccess || !email}
          className="bg-slate-700 hover:bg-slate-600 text-white"
        >
          {isSuccess ? (
            <CheckCircle className="h-4 w-4" />
          ) : isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </Button>
      </form>
    );
  }

  return (
    <Card className={`bg-slate-800 border-slate-700 text-white ${className}`}>
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mb-4">
          <Mail className="h-6 w-6 text-slate-300" />
        </div>
        <CardTitle className="text-xl text-white">{title}</CardTitle>
        <CardDescription className="text-slate-300">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isSuccess ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Successfully Subscribed!</h3>
            <p className="text-slate-300">Check your email for confirmation.</p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-4">
            {/* Email Input */}
            <div>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-slate-500 w-full"
              />
            </div>

            {/* Frequency Selector */}
            {showFrequency && (
              <div>
                <Select value={frequency} onValueChange={setFrequency} disabled={isLoading}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Choose frequency" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="daily" className="text-white">Daily Updates</SelectItem>
                    <SelectItem value="weekly" className="text-white">Weekly Digest</SelectItem>
                    <SelectItem value="monthly" className="text-white">Monthly Summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Interest Checkboxes */}
            {showInterests && (
              <div className="space-y-3">
                <p className="text-sm text-slate-300">Content preferences:</p>
                <div className="space-y-2">
                  {interestOptions.map((interest) => (
                    <div key={interest.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={`${interest.id}-${source}`}
                        checked={interests.includes(interest.id)}
                        onCheckedChange={(checked) => 
                          handleInterestChange(interest.id, checked as boolean)
                        }
                        disabled={isLoading}
                        className="border-slate-600 data-[state=checked]:bg-slate-600 mt-0.5"
                      />
                      <div className="flex-1">
                        <label 
                          htmlFor={`${interest.id}-${source}`}
                          className="text-sm text-slate-300 cursor-pointer font-medium"
                        >
                          {interest.label}
                        </label>
                        <p className="text-xs text-slate-400">{interest.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Consent Checkbox */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id={`consent-${source}`}
                checked={consentGiven}
                onCheckedChange={(checked) => setConsentGiven(checked as boolean)}
                disabled={isLoading}
                className="border-slate-600 data-[state=checked]:bg-slate-600 mt-0.5"
              />
              <label htmlFor={`consent-${source}`} className="text-xs text-slate-300 leading-relaxed">
                I agree to receive emails and accept the privacy policy. You can unsubscribe at any time.
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
                  Subscribe to Newsletter
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}