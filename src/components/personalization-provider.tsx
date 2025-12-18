"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type PersonalizationMe = {
  email: string | null;
  displayName: string | null;
  role: string;
  persona: string;
  tier: string;
  location: { state: string | null; lga: string | null };
  intent: { primary: string | null; updatedAt: string | null };
  capability: { level: string; explanationDepth: string };
  taxProfile: {
    incomeType: string;
    vatStatus: string;
    filingFrequency: string;
    industry: string | null;
  };
  consents: { personalizationLevel: number; sensitiveFinancial: boolean; aiMemory: boolean };
  usage: {
    lastSeenAt: string | null;
    lastPage: string | null;
    pages: Record<string, number>;
    tools: Record<string, number>;
    aiQuestions: number;
    navClicks: number;
  };
};

type TrackEvent =
  | { type: "page_view"; route: string }
  | { type: "tool_launch"; toolId: string }
  | { type: "ai_question" }
  | { type: "nav_click"; trackId: string };

type PersonalizationContextValue = {
  me: PersonalizationMe | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
  update: (patch: Partial<PersonalizationMe>) => Promise<PersonalizationMe | null>;
  track: (event: TrackEvent) => Promise<void>;
};

const PersonalizationContext = createContext<PersonalizationContextValue | null>(null);

export function PersonalizationProvider({ children }: { children: React.ReactNode }) {
  const [me, setMe] = useState<PersonalizationMe | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/personalization/me", { method: "GET" });
      if (!res.ok) {
        setMe(null);
        return;
      }
      const json = await res.json();
      setMe(json?.me ?? null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const update = useCallback(async (patch: Partial<PersonalizationMe>) => {
    const res = await fetch("/api/personalization/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) return me;
    const json = await res.json();
    const next = json?.me ?? null;
    setMe(next);
    return next;
  }, [me]);

  const track = useCallback(async (event: TrackEvent) => {
    try {
      await fetch("/api/personalization/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
        keepalive: true,
      });
    } catch {
      // Intentionally ignore tracking failures in Phase A.
    }
  }, []);

  // Phase A: try to load personalization; if not logged in, endpoint returns 401 and we keep null.
  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      me,
      isLoading,
      refresh,
      update,
      track,
    }),
    [me, isLoading, refresh, update, track]
  );

  return <PersonalizationContext.Provider value={value}>{children}</PersonalizationContext.Provider>;
}

export function usePersonalization() {
  const ctx = useContext(PersonalizationContext);
  if (!ctx) {
    throw new Error("usePersonalization must be used within PersonalizationProvider");
  }
  return ctx;
}

