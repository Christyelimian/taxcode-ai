"use client";

import { BookmarkButton } from "@/components/bookmark-button";

interface BookmarkButtonWrapperProps {
  moduleId: string;
  moduleTitle: string;
}

export function BookmarkButtonWrapper({ moduleId, moduleTitle }: BookmarkButtonWrapperProps) {
  return <BookmarkButton moduleId={moduleId} moduleTitle={moduleTitle} />;
}

