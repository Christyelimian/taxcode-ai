"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle,
  GraduationCap,
  Search,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PLACEHOLDER_TEXTS = [
  "Ask anything about Nigerian tax…",
  "What tax applies to your business?",
  "How did the 2026 reforms affect you?",
  "Calculate, learn, or comply. Just ask.",
];

const INTENT_LANES = [
  {
    id: "understand",
    title: "🧠 UNDERSTAND",
    icon: <BookOpen className="h-4 w-4" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    items: [
      "What VAT means for small businesses",
      "Who is exempt from VAT?",
      "VAT vs turnover tax explained",
    ],
  },
  {
    id: "calculate",
    title: "🧮 CALCULATE",
    icon: <Calculator className="h-4 w-4" />,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    items: [
      "Estimate VAT payable for my business",
      "Check if I should charge VAT",
      "Input VAT recovery calculator",
    ],
  },
  {
    id: "comply",
    title: "📅 COMPLY",
    icon: <CheckCircle className="h-4 w-4" />,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    items: [
      "VAT filing deadlines",
      "VAT registration requirements",
      "Penalties for late VAT filing",
    ],
  },
  {
    id: "learn",
    title: "🎓 LEARN",
    icon: <GraduationCap className="h-4 w-4" />,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    items: [
      "VAT course in Tax Academy",
      "2026 VAT reform explained",
      "Common VAT mistakes",
    ],
  },
];

export function TaxPalCommandBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Rotate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % PLACEHOLDER_TEXTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setSelectedIntent(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setIsExpanded(value.length > 0);
    setSelectedIntent(null);
  };

  const handleIntentClick = (intentId: string, itemText: string) => {
    setQuery(itemText);
    setSelectedIntent(intentId);
    setIsExpanded(false);
    // Focus back to input
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // For now, redirect to assistant with the query
      router.push(`/assistant?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsExpanded(false);
      setSelectedIntent(null);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 p-2 backdrop-blur-sm">
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={PLACEHOLDER_TEXTS[currentPlaceholder]}
            className="border-0 bg-transparent text-white placeholder:text-white/60 focus-visible:ring-0"
            aria-label="Ask TaxPal anything about tax"
          />
          <Button
            type="submit"
            className="shrink-0"
            disabled={!query.trim()}
          >
            Ask TaxPal <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Helper text */}
        <div className="mt-2 text-center">
          <span className="text-sm text-white/70">
            Understands questions, calculations, and scenarios
          </span>
        </div>
      </form>

      {/* Intent Lanes Dropdown */}
      {isExpanded && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-xl border bg-background p-4 shadow-xl">
          <div className="mb-3 text-sm font-semibold text-muted-foreground">
            Choose what you want to do:
          </div>

          <div className="grid gap-3">
            {INTENT_LANES.map((lane) => (
              <div key={lane.id} className="space-y-2">
                <div className={cn("flex items-center gap-2 text-sm font-semibold", lane.color)}>
                  {lane.icon}
                  {lane.title}
                </div>

                <div className="grid gap-1 pl-6">
                  {lane.items.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleIntentClick(lane.id, item)}
                      className={cn(
                        "w-full rounded-lg border p-3 text-left text-sm transition-colors hover:bg-accent",
                        lane.bgColor,
                        lane.borderColor
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t pt-3">
            <div className="text-xs text-muted-foreground">
              💡 Tip: Ask specific questions like "How much VAT do I charge on ₦100,000 service?"
            </div>
          </div>
        </div>
      )}
    </div>
  );
}