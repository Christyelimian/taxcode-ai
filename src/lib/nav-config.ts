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
    title: "Learn",
    subtitle: "Understand Nigerian tax law, quickly and clearly.",
    spotlight: {
      title: "Start Here",
      description: "Role-based pathways to rights, obligations, and next steps.",
      href: "/start-here",
      trackId: "learn:start-here",
      badge: "Recommended",
    },
    columns: [
      {
        title: "Start here",
        items: [
          { label: "Start Here", href: "/start-here", trackId: "learn:start-here" },
          { label: "Focus Areas", href: "/focus-areas", trackId: "learn:focus-areas" },
          { label: "Insights", href: "/insights", trackId: "learn:insights", badge: "Popular" },
          { label: "News & Updates", href: "/news", trackId: "learn:news" },
        ],
      },
      {
        title: "Reforms & guidance",
        items: [
          // We'll create these pages in Phase B; keep placeholders to give a “picture” now.
          { label: "2026 Tax Reforms (Hub)", href: "/reforms-2026", trackId: "learn:reforms-2026", badge: "New" },
          { label: "Tax Types Library", href: "/tax-types", trackId: "learn:tax-types" },
          { label: "Taxpayer Rights", href: "/focus-areas/taxpayer-rights-state-authority", trackId: "learn:rights" },
          { label: "Disputes & Appeals", href: "/focus-areas/dispute-prevention-resolution", trackId: "learn:disputes" },
        ],
      },
      {
        title: "Resources",
        items: [
          { label: "Resources Library", href: "/resources", trackId: "learn:resources" },
          { label: "Contact", href: "/contact", trackId: "learn:contact" },
          { label: "About", href: "/about", trackId: "learn:about" },
        ],
      },
    ],
  },
  {
    id: "tools",
    title: "Tools",
    subtitle: "Automate compliance and decisions with AI.",
    spotlight: {
      title: "AI Tax Assistant",
      description: "Ask questions, get action-oriented answers, and suggested next steps.",
      href: "/dashboard/assistant",
      trackId: "tools:assistant",
      isPremium: true,
      badge: "Popular",
    },
    columns: [
      {
        title: "AI-powered",
        items: [
          { label: "AI Tax Assistant", href: "/dashboard/assistant", trackId: "tools:assistant", isPremium: true, badge: "Popular" },
          { label: "Document Generator", href: "/dashboard/tools", trackId: "tools:doc-generator", isPremium: true },
        ],
      },
      {
        title: "Calculators",
        items: [
          { label: "Tax Calculator", href: "/dashboard/calculator", trackId: "tools:calculator" },
          { label: "VAT Calculator", href: "/dashboard/tools", trackId: "tools:vat", isPremium: true },
          { label: "Withholding Tax Calculator", href: "/dashboard/tools", trackId: "tools:wht", isPremium: true },
        ],
      },
      {
        title: "Compliance",
        items: [
          { label: "Compliance Dashboard", href: "/dashboard", trackId: "tools:compliance", isPremium: true },
          { label: "Deadline Tracker", href: "/dashboard/tools", trackId: "tools:deadlines", isPremium: true },
          { label: "Planning Lab", href: "/dashboard/tools", trackId: "tools:planning", isPremium: true },
        ],
      },
    ],
  },
  {
    id: "academy",
    title: "Academy",
    subtitle: "Learn faster with guided paths, badges, and certifications.",
    spotlight: {
      title: "Training Modules",
      description: "Interactive modules with progress tracking.",
      href: "/dashboard/modules",
      trackId: "academy:modules",
      badge: "Recommended",
    },
    columns: [
      {
        title: "Start learning",
        items: [
          { label: "Browse Modules", href: "/dashboard/modules", trackId: "academy:modules", badge: "Recommended" },
          { label: "My Progress", href: "/dashboard/modules", trackId: "academy:progress", isPremium: true },
        ],
      },
      {
        title: "Achievements",
        items: [
          { label: "Badges", href: "/dashboard/modules", trackId: "academy:badges", isPremium: true },
          { label: "Leaderboard", href: "/dashboard/modules", trackId: "academy:leaderboard", isPremium: true },
          { label: "Certifications", href: "/dashboard/modules", trackId: "academy:certifications", isPremium: true },
        ],
      },
      {
        title: "Community",
        items: [
          { label: "Forum (Coming Soon)", href: "/news", trackId: "academy:forum" },
          { label: "Events & Webinars (Coming Soon)", href: "/news", trackId: "academy:events" },
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

