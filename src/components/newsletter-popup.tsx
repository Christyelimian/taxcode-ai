"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Mail, ArrowRight } from "lucide-react";
import NewsletterSignup from "@/components/newsletter-signup";

interface NewsletterPopupProps {
  delay?: number; // Delay in milliseconds before showing popup
  showAfterScroll?: number; // Show after scrolling this percentage
  localStorageKey?: string; // Key to track if popup was shown
}

export default function NewsletterPopup({
  delay = 5000, // 5 seconds default
  showAfterScroll = 30, // 30% scroll default
  localStorageKey = "newsletter-popup-shown",
}: NewsletterPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);

  useEffect(() => {
    // Check if popup was already shown
    const wasShown = localStorage.getItem(localStorageKey);
    if (wasShown) {
      setHasBeenShown(true);
      return;
    }

    // Show popup after delay
    const timer = setTimeout(() => {
      if (!hasBeenShown) {
        setIsOpen(true);
        setHasBeenShown(true);
        localStorage.setItem(localStorageKey, "true");
      }
    }, delay);

    // Also show after scroll percentage
    const handleScroll = () => {
      if (hasBeenShown || isOpen) return;

      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const scrollPercentage = (scrollPosition / scrollHeight) * 100;

      if (scrollPercentage >= showAfterScroll) {
        setIsOpen(true);
        setHasBeenShown(true);
        localStorage.setItem(localStorageKey, "true");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [delay, showAfterScroll, localStorageKey, hasBeenShown, isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSuccess = () => {
    setIsOpen(false);
  };

  if (!isOpen || hasBeenShown) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Popup Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          aria-label="Close popup"
        >
          <X className="h-4 w-4 text-slate-600" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-t-2xl text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
            <Mail className="w-full h-full" />
          </div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Stay Ahead of Tax Changes
            </h2>
            <p className="text-slate-300 text-sm">
              Join 5,000+ Nigerians getting expert tax insights
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          <div className="text-center mb-6">
            <p className="text-slate-600 mb-4">
              Get weekly analysis on tax reforms, policy updates, and strategic guidance tailored to your interests.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 mb-6">
              <div className="flex items-center gap-1">
                ✓ Expert Analysis
              </div>
              <div className="flex items-center gap-1">
                ✓ Weekly Updates
              </div>
              <div className="flex items-center gap-1">
                ✓ Unsubscribe Anytime
              </div>
            </div>
          </div>

          <NewsletterSignup
            source="popup"
            title=""
            description=""
            compact={false}
            showFrequency={true}
            showInterests={true}
            className="bg-transparent border-0 p-0"
          />
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4 text-center">
          <p className="text-xs text-slate-500">
            We respect your privacy. Unsubscribe with one click.
          </p>
        </div>
      </div>
    </div>
  );
}