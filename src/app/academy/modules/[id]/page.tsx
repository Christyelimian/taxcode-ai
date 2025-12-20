import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BookOpen, Calendar, ChevronLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getTrainingModuleById } from "@/app/actions";
import { EnrollmentButton } from "./enrollment-button";
import { TaxChampionsCard } from "./tax-champions-card";
import { BookmarkButtonWrapper } from "./bookmark-button-wrapper";

const COURSE_HEADER_IMAGES = [
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=2400&q=80",
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=2400&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2400&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=2400&q=80",
];

function stableIndex(input: string, modulo: number) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h % modulo;
}

function headerImageFor(title: string) {
  return COURSE_HEADER_IMAGES[stableIndex(title, COURSE_HEADER_IMAGES.length)];
}

export default async function AcademyModuleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getTrainingModuleById(id);
  if (!res.success || !res.data) notFound();

  const module = res.data;
  const isPublished = (module.status ?? "").toLowerCase() === "published";
  if (!isPublished) notFound();

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0">
          <Image
            src={headerImageFor(module.title)}
            alt={module.title}
            fill
            priority
            unoptimized
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-background" />
        </div>

        <div className="relative container mx-auto px-4 py-14">
          <div className="flex items-center justify-between gap-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/academy">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Academy
              </Link>
            </Button>
            <Badge variant="secondary">Course</Badge>
          </div>

          <h1 className="mt-6 text-3xl md:text-6xl font-headline font-bold tracking-tight text-white">
            {module.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/80">
            <span className="inline-flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {module.content?.length ?? 0} lessons
            </span>
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {module.dates}
            </span>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <EnrollmentButton moduleId={id} />
            <BookmarkButtonWrapper moduleId={id} moduleTitle={module.title} />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="text-2xl font-headline font-bold">Course outline</h2>
            <p className="mt-2 text-muted-foreground">
              Clear, practical lessons — designed for citizens, SMEs, and community educators.
            </p>
            <Separator className="my-8" />
            <div className="grid gap-3">
              {(module.content ?? []).map((topic, idx) => (
                <Card key={`${idx}-${topic}`}>
                  <CardHeader className="py-4">
                    <CardTitle className="text-base">
                      Lesson {idx + 1}: {topic}
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Earn XP</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div>✅ Complete lessons → +XP</div>
                <div>🧠 Quick quizzes → +XP</div>
                <div>🔥 Streak bonus → +XP</div>
                <div>🤝 Help others → +XP</div>
              </CardContent>
            </Card>

            <TaxChampionsCard moduleId={id} />
          </aside>
        </div>
      </section>
    </div>
  );
}



