export type DirectoryProfessional = {
  id: string;
  name: string;
  firm?: string;
  title: string;
  photoInitials: string;
  locations: string[];
  languages: string[];
  specialties: string[];
  industries: string[];
  yearsExperience: number;
  verified: {
    status: "Verified" | "In review";
    lastCheck: string; // ISO date
    scope: string[];
  };
  pricing: {
    consultationFeeNGN: number;
    hourlyRateNGN?: number;
    fairPricingPledge: boolean;
    proBono: boolean;
    lowCostSlotsPerMonth?: number;
  };
  availability: {
    nextSlotLabel: string;
    responseSlaHours: number;
    bookingModes: ("Call" | "Video" | "In-person")[];
  };
  trust: {
    rating: number; // 0..5
    reviewCount: number;
    verifiedReviewsOnly: boolean;
    complaintResolutionSupported: boolean;
    mediationSupported: boolean;
  };
  badges: ("Community Champion" | "Featured" | "Pro Bono" | "Fast Response")[];
  successStories: { title: string; outcome: string; tags: string[] }[];
  highlights: string[];
};

export const DIRECTORY_PROS: DirectoryProfessional[] = [
  {
    id: "adebayo-okonkwo",
    name: "Adebayo Okonkwo",
    firm: "Okonkwo & Partners",
    title: "Tax Counsel (Disputes & Appeals)",
    photoInitials: "AO",
    locations: ["Lagos", "Remote"],
    languages: ["English", "Yoruba"],
    specialties: ["Tax disputes", "FIRS audits", "TAT appeals", "Withholding tax"],
    industries: ["Fintech", "E-commerce", "Professional services"],
    yearsExperience: 11,
    verified: {
      status: "Verified",
      lastCheck: "2025-11-18",
      scope: ["Identity", "Practice history", "License/affiliation", "Ongoing quality"],
    },
    pricing: {
      consultationFeeNGN: 35000,
      hourlyRateNGN: 90000,
      fairPricingPledge: true,
      proBono: true,
      lowCostSlotsPerMonth: 4,
    },
    availability: {
      nextSlotLabel: "Tomorrow, 2:00 PM",
      responseSlaHours: 6,
      bookingModes: ["Call", "Video"],
    },
    trust: {
      rating: 4.8,
      reviewCount: 132,
      verifiedReviewsOnly: true,
      complaintResolutionSupported: true,
      mediationSupported: true,
    },
    badges: ["Community Champion", "Pro Bono", "Fast Response"],
    successStories: [
      {
        title: "Audit response pack (VAT/WHT)",
        outcome: "Reduced assessment exposure by 38% and agreed a structured payment plan.",
        tags: ["Audit", "VAT", "WHT"],
      },
      {
        title: "TAT appeal readiness", 
        outcome: "Won partial relief at objections stage; avoided litigation.",
        tags: ["Disputes", "Appeals"],
      },
    ],
    highlights: [
      "Plain-language strategy memos (clients keep these as playbooks)",
      "Clear timelines + evidence checklists",
      "NGO mediation support compatible",
    ],
  },
  {
    id: "chika-nwosu",
    name: "Chika Nwosu",
    firm: "Nwosu Tax Studio",
    title: "SME Compliance & Bookkeeping Lead",
    photoInitials: "CN",
    locations: ["Abuja", "Remote"],
    languages: ["English", "Igbo"],
    specialties: ["PAYE", "VAT", "SME compliance", "Tax registration"],
    industries: ["Retail", "Logistics", "Hospitality"],
    yearsExperience: 7,
    verified: {
      status: "Verified",
      lastCheck: "2025-12-05",
      scope: ["Identity", "Practice history", "Client protection program"],
    },
    pricing: {
      consultationFeeNGN: 15000,
      hourlyRateNGN: 45000,
      fairPricingPledge: true,
      proBono: false,
    },
    availability: {
      nextSlotLabel: "Today, 5:30 PM",
      responseSlaHours: 12,
      bookingModes: ["Call", "Video"],
    },
    trust: {
      rating: 4.6,
      reviewCount: 89,
      verifiedReviewsOnly: true,
      complaintResolutionSupported: true,
      mediationSupported: true,
    },
    badges: ["Fast Response"],
    successStories: [
      {
        title: "SME VAT clean-up", 
        outcome: "Closed historical filing gaps and implemented monthly compliance cadence.",
        tags: ["VAT", "SME"],
      },
    ],
    highlights: [
      "Great for first-time compliance setups",
      "Simple monthly retainer options",
      "Strong documentation discipline",
    ],
  },
  {
    id: "musa-bello",
    name: "Musa Bello",
    firm: "Bello Advisory",
    title: "Transfer Pricing & International Tax",
    photoInitials: "MB",
    locations: ["Lagos", "Abuja", "Remote"],
    languages: ["English", "Hausa"],
    specialties: ["Transfer pricing", "PE risk", "Cross-border VAT", "Tax planning"],
    industries: ["Oil & Gas", "Telecoms", "Manufacturing"],
    yearsExperience: 14,
    verified: {
      status: "In review",
      lastCheck: "2025-10-22",
      scope: ["Identity", "Ongoing quality"],
    },
    pricing: {
      consultationFeeNGN: 60000,
      hourlyRateNGN: 150000,
      fairPricingPledge: true,
      proBono: false,
    },
    availability: {
      nextSlotLabel: "Mon, 10:00 AM",
      responseSlaHours: 24,
      bookingModes: ["Video"],
    },
    trust: {
      rating: 4.4,
      reviewCount: 41,
      verifiedReviewsOnly: true,
      complaintResolutionSupported: true,
      mediationSupported: false,
    },
    badges: ["Featured"],
    successStories: [
      {
        title: "TP documentation overhaul",
        outcome: "Implemented defensible local file + master file structure.",
        tags: ["Transfer pricing"],
      },
    ],
    highlights: [
      "Best for cross-border + complex structures",
      "Clear risk heatmaps and mitigation plans",
    ],
  },
  {
    id: "zainab-sani",
    name: "Zainab Sani",
    firm: "Community Tax Clinic",
    title: "Tax Educator (Individuals & Microbusiness)",
    photoInitials: "ZS",
    locations: ["Kano", "Remote"],
    languages: ["English", "Hausa"],
    specialties: ["Individual tax", "PAYE issues", "Taxpayer rights", "Dispute prevention"],
    industries: ["Creators", "Microbusiness", "Gig workers"],
    yearsExperience: 6,
    verified: {
      status: "Verified",
      lastCheck: "2025-12-01",
      scope: ["Identity", "Client protection program", "Ongoing quality"],
    },
    pricing: {
      consultationFeeNGN: 0,
      fairPricingPledge: true,
      proBono: true,
      lowCostSlotsPerMonth: 12,
    },
    availability: {
      nextSlotLabel: "Sat, 11:00 AM",
      responseSlaHours: 18,
      bookingModes: ["Call", "Video"],
    },
    trust: {
      rating: 4.9,
      reviewCount: 57,
      verifiedReviewsOnly: true,
      complaintResolutionSupported: true,
      mediationSupported: true,
    },
    badges: ["Community Champion", "Pro Bono"],
    successStories: [
      {
        title: "Rights-first dispute prevention",
        outcome: "Helped client fix filings and avoid penalties with a documented correction path.",
        tags: ["Rights", "Prevention"],
      },
    ],
    highlights: [
      "Excellent for low-income / pro bono pathways",
      "Strong educational approach + templates",
    ],
  },
];


