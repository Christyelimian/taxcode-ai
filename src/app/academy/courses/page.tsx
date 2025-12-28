import AcademyCoursesClient, { type AcademyCourseCard } from "./academy-courses-client";
import { getTrainingModules } from "@/app/actions";

function stableIndex(input: string, modulo: number) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h % modulo;
}

const COURSE_IMAGES = [
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1556761175-129418cb2dfe?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
];

function courseImageFor(title: string) {
  return COURSE_IMAGES[stableIndex(title, COURSE_IMAGES.length)];
}

function guessCategory(title: string): AcademyCourseCard["category"] {
  const t = title.toLowerCase();
  if (t.includes("right")) return "Rights";
  if (t.includes("reform") || t.includes("2026")) return "Reforms";
  if (t.includes("vat")) return "VAT";
  if (t.includes("paye") || t.includes("employment")) return "PAYE";
  if (t.includes("dispute") || t.includes("appeal") || t.includes("audit")) return "Disputes";
  if (t.includes("plan")) return "Planning";
  return "General";
}

const PREVIEW_COURSES: Omit<AcademyCourseCard, "imageUrl" | "href">[] = [
  {
    source: "preview",
    title: "Taxpayer Rights 101",
    subtitle: "Know your rights. Engage confidently and lawfully.",
    lessons: 8,
    minutes: 35,
    level: "Beginner",
    category: "Rights",
    badge: "Popular",
    meta: "8.9K learners",
  },
  {
    source: "preview",
    title: "2026 Tax Reforms (Made Simple)",
    subtitle: "What changed, why it matters, and what to do next.",
    lessons: 10,
    minutes: 45,
    level: "Beginner",
    category: "Reforms",
    badge: "Recommended",
    meta: "12.4K learners",
  },
  {
    source: "preview",
    title: "VAT Mastery for SMEs",
    subtitle: "Invoices, filing, and the rules around VAT in practice.",
    lessons: 12,
    minutes: 55,
    level: "Intermediate",
    category: "VAT",
    badge: "Popular",
    meta: "5.1K learners",
  },
  {
    source: "preview",
    title: "PAYE & Employment Taxes",
    subtitle: "Understand PAYE, deductions, and what employers must do.",
    lessons: 7,
    minutes: 30,
    level: "Beginner",
    category: "PAYE",
    badge: "New",
    meta: "New",
  },
  {
    source: "preview",
    title: "Disputes & Appeals Toolkit",
    subtitle: "Steps, timelines, evidence, and calmer dispute handling.",
    lessons: 9,
    minutes: 40,
    level: "Intermediate",
    category: "Disputes",
    badge: "New",
    meta: "New",
  },
  {
    source: "preview",
    title: "Tax Planning Basics (Ethical)",
    subtitle: "Plan within the law. Avoid risky shortcuts.",
    lessons: 9,
    minutes: 40,
    level: "Intermediate",
    category: "Planning",
    badge: "Recommended",
    meta: "⭐ 4.9 (890)",
  },
];

export default async function AcademyCoursesPage() {
  const modulesRes = await getTrainingModules();
  const all = modulesRes.success && modulesRes.data ? modulesRes.data : [];
  const published = all.filter((m) => (m.status ?? "").toLowerCase() === "published");

  const publishedCards: AcademyCourseCard[] = published.map((m) => ({
    source: "published",
    id: m.id,
    title: m.title,
    subtitle: "A structured learning module designed for Nigerians — practical, clear, and mission-aligned.",
    lessons: m.content?.length ?? 0,
    minutes: Math.max(15, (m.content?.length ?? 0) * 5),
    level: (m.content?.length ?? 0) >= 11 ? "Intermediate" : "Beginner",
    category: guessCategory(m.title),
    badge: "Recommended",
    meta: m.dates,
    imageUrl: courseImageFor(m.title),
    href: m.id ? `/academy/modules/${m.id}` : "/academy",
    createdAtISO: (m as any).createdAt,
  }));

  const previewCards: AcademyCourseCard[] = PREVIEW_COURSES.map((c) => ({
    ...c,
    imageUrl: courseImageFor(c.title),
    href: "#",
    createdAtISO: "2025-12-18T00:00:00.000Z",
  }));

  // Published first, then previews so page always looks full.
  const courses = [...publishedCards, ...previewCards];

  return <AcademyCoursesClient courses={courses} />;
}





