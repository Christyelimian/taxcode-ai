import type { LucideIcon } from "lucide-react";

export type NavTier = "free" | "pro" | "enterprise";
export type NavPersona = "individual" | "business_owner" | "accountant" | "student";

export type NavItem = {
  label: string;
  description?: string;
  href: string;
  icon?: LucideIcon;
  trackId: string;
  isPremium?: boolean;
  minTier?: NavTier; // if set, user must be >= this tier
  badge?: "New" | "Popular" | "Recommended" | "Urgent";
};

export type NavColumn = {
  title: string;
  items: NavItem[];
};

export type NavPanel = {
  id: "learn" | "tools" | "academy";
  title: string;
  subtitle: string;
  columns: NavColumn[];
  spotlight?: {
    title: string;
    description: string;
    href: string;
    trackId: string;
    isPremium?: boolean;
    badge?: "New" | "Popular" | "Recommended";
  };
};

export const BASE_PANELS: NavPanel[] = [
  {
    id: "learn",
    title: "Tax Code",
    subtitle: "Understanding Tax Through Law, Process and Justice",
    spotlight: {
      title: "Insights & Education Hub",
      description: "Structured explainers designed for clarity, with downloadable resources.",
      href: "/insights",
      trackId: "learn:insights",
      badge: "Popular",
    },
    columns: [
      {
        title: "What We Do",
        items: [
          { label: "Focus Areas", href: "/focus-areas", trackId: "learn:focus-areas" },
          { label: "Insights Hub", href: "/insights", trackId: "learn:insights", badge: "Popular" },
          { label: "News & Statements", href: "/news", trackId: "learn:news" },
        ],
      },
      {
        title: "About",
        items: [
          { label: "About Tax Code", href: "/about", trackId: "learn:about" },
          { label: "Our Team", href: "/team", trackId: "learn:team" },
          { label: "Contact", href: "/contact", trackId: "learn:contact" },
        ],
      },
    ],
  },
];

export function tierRank(tier: string | null | undefined): number {
  if (tier === "enterprise") return 3;
  if (tier === "pro") return 2;
  return 1; // free default
}

export function isItemLocked(item: NavItem, tier: string | null | undefined): boolean {
  if (!item.isPremium && !item.minTier) return false;
  const required = item.minTier ?? "pro";
  return tierRank(tier) < tierRank(required);
}






