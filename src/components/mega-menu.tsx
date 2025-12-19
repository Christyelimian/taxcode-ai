"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { BASE_PANELS, isItemLocked, type NavPanel } from "@/lib/nav-config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Lock, Menu, Sparkles } from "lucide-react";
import { usePersonalization } from "@/components/personalization-provider";

type Props = {
  className?: string;
};

function Pill({ text }: { text: string }) {
  const variant =
    text === "Urgent"
      ? "destructive"
      : text === "New"
        ? "secondary"
        : text === "Popular" || text === "Recommended"
          ? "default"
          : "outline";
  return (
    <Badge
      variant={variant as any}
      className={cn(
        "ml-2 inline-flex items-center align-middle text-[11px] leading-none px-2.5 py-1",
        text === "Recommended" && "bg-primary text-primary-foreground hover:bg-primary/90"
      )}
    >
      {text}
    </Badge>
  );
}

function MegaPanel({ panel, tier }: { panel: NavPanel; tier: string | null | undefined }) {
  return (
    <div className="grid gap-6 lg:grid-cols-4">
      <div className="lg:col-span-1 rounded-xl border bg-gradient-to-b from-primary/10 to-transparent p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-md bg-primary/15 p-2">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">{panel.title}</div>
            <div className="mt-1 text-sm text-muted-foreground">{panel.subtitle}</div>
          </div>
        </div>
        {panel.spotlight && (
          <Link
            href={panel.spotlight.href}
            className="mt-4 block rounded-lg border bg-background/70 p-3 transition hover:bg-background"
          >
            <div className="text-sm font-semibold">
              {panel.spotlight.title}
              {panel.spotlight.badge ? <Pill text={panel.spotlight.badge} /> : null}
              {panel.spotlight.isPremium && isItemLocked({ label: "", href: "", trackId: "", isPremium: true }, tier) ? (
                <span className="ml-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" /> Pro
                </span>
              ) : null}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{panel.spotlight.description}</div>
            <div className="mt-3 text-sm font-medium text-primary">Explore →</div>
          </Link>
        )}
      </div>

      <div className="lg:col-span-3 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {panel.columns.map((col) => (
          <div key={col.title} className="min-w-0">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{col.title}</div>
            <div className="space-y-1">
              {col.items.map((item) => {
                const locked = isItemLocked(item, tier);
                return (
                  <Link
                    key={item.trackId}
                    href={item.href}
                    className={cn(
                      "flex items-start justify-between gap-3 rounded-md px-3 py-2 text-sm transition",
                      locked ? "bg-muted/40 text-muted-foreground" : "hover:bg-accent"
                    )}
                    aria-disabled={locked}
                    onClick={(e) => {
                      if (locked) e.preventDefault();
                    }}
                  >
                    <span className="min-w-0">
                      <span className="font-medium text-foreground/90">
                        {item.label}
                        {item.badge ? <Pill text={item.badge} /> : null}
                      </span>
                      {item.description ? (
                        <span className="mt-0.5 block text-xs text-muted-foreground">{item.description}</span>
                      ) : null}
                    </span>
                    {locked ? (
                      <span className="mt-0.5 inline-flex items-center gap-1 text-xs">
                        <Lock className="h-3 w-3" />
                        Pro
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MegaMenu({ className }: Props) {
  const { me, track } = usePersonalization();
  const tier = me?.tier ?? null;
  const persona = me?.persona ?? null;

  // Phase A “intelligence”: choose which panel gets a subtle highlight by persona.
  const recommendedPanelId = useMemo(() => {
    if (persona === "business_owner") return "tools";
    if (persona === "accountant") return "tools";
    if (persona === "student") return "academy";
    return "learn";
  }, [persona]);

  const [open, setOpen] = useState<NavPanel["id"] | null>(null);
  const closeTimer = useRef<number | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    // Small delay prevents flicker when crossing gaps.
    closeTimer.current = window.setTimeout(() => setOpen(null), 140);
  };

  useEffect(() => {
    return () => cancelClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const panels = BASE_PANELS;

  return (
    <div className={cn("flex h-full items-center", className)}>
      {/* Desktop mega menu */}
      <div className="hidden h-full items-center gap-2 md:flex">
        {panels.map((panel) => {
          const isOpen = open === panel.id;
          const isRecommended = panel.id === recommendedPanelId;
          return (
            <div
              key={panel.id}
              className="relative flex h-full items-center"
              onMouseEnter={() => {
                cancelClose();
                setOpen(panel.id);
              }}
              onMouseLeave={() => {
                scheduleClose();
              }}
            >
              <button
                type="button"
                className={cn(
                  "group relative inline-flex h-11 items-center gap-2 rounded-md px-3 text-[15px] font-semibold text-foreground/80 transition-colors hover:text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isOpen && "text-foreground",
                  isRecommended && "text-foreground"
                )}
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                onFocus={() => {
                  cancelClose();
                  setOpen(panel.id);
                }}
              >
                {panel.title}
                {isRecommended ? <Pill text="Recommended" /> : null}
                <span
                  className={cn(
                    "absolute bottom-1 left-3 h-0.5 w-[calc(100%-1.5rem)] origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100",
                    isOpen && "scale-x-100"
                  )}
                />
              </button>

              {isOpen ? (
                <div className="fixed inset-x-0 top-20 z-50 px-4" role="dialog">
                  <div
                    className="mx-auto mt-2 w-full max-w-[960px] rounded-2xl border bg-background/95 p-5 shadow-xl backdrop-blur"
                    onMouseEnter={() => cancelClose()}
                    onMouseLeave={() => scheduleClose()}
                  >
                    <MegaPanel panel={panel} tier={tier} />
                    <div className="mt-5 flex items-center justify-between border-t pt-4">
                      <div className="text-xs text-muted-foreground">
                        {tier === "free" ? "Some tools are Pro 🔒" : `Tier: ${tier}`}
                      </div>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href="/dashboard">Open dashboard</Link>
                        </Button>
                        <Button asChild size="sm">
                          <Link href="/dashboard/assistant">Ask AI</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[92vw] sm:w-[420px]">
            <SheetHeader className="text-left">
              <SheetTitle>Menu</SheetTitle>
              <div className="text-sm text-muted-foreground">
                {tier ? `Tier: ${tier}` : "Sign in to personalize"}
              </div>
            </SheetHeader>

            <div className="mt-6">
              <Accordion type="single" collapsible className="w-full">
                {panels.map((panel) => (
                  <AccordionItem key={panel.id} value={panel.id}>
                    <AccordionTrigger>
                      <span className="flex items-center gap-2">
                        {panel.title}
                      {panel.id === recommendedPanelId ? <Pill text="Recommended" /> : null}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-6 pt-2">
                        {panel.columns.map((col) => (
                          <div key={col.title}>
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              {col.title}
                            </div>
                            <div className="space-y-1">
                              {col.items.map((item) => {
                                const locked = isItemLocked(item, tier);
                                return (
                                  <Link
                                    key={item.trackId}
                                    href={item.href}
                                    className={cn(
                                      "flex items-center justify-between rounded-md px-3 py-2 text-sm",
                                      locked ? "bg-muted/40 text-muted-foreground" : "hover:bg-accent"
                                    )}
                                    aria-disabled={locked}
                                    onClick={(e) => {
                                      if (locked) e.preventDefault();
                                      void track({ type: "nav_click", trackId: item.trackId });
                                    }}
                                  >
                                    <span className="flex items-center gap-2">
                                      {item.label}
                                      {item.badge ? <Pill text={item.badge} /> : null}
                                    </span>
                                    {locked ? (
                                      <span className="inline-flex items-center gap-1 text-xs">
                                        <Lock className="h-3 w-3" />
                                        Pro
                                      </span>
                                    ) : null}
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="mt-6 grid grid-cols-2 gap-2">
                {process.env.NODE_ENV === "development" ? (
                  <Button asChild variant="outline" className="col-span-2">
                    <Link href="/home-new">Preview New Home</Link>
                  </Button>
                ) : null}
                <Button asChild variant="outline">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild variant="outline">
                  <a href="/#pricing">Pricing</a>
                </Button>
                <Button asChild>
                  <Link href="/dashboard">Launch App</Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

