'use client';

import { BuilderComponent } from '@builder.io/react';
import '@/lib/builder-init'; // Initialize component registration

interface BuilderContentProps {
  content: any;
  model?: string;
}

/**
 * Client component wrapper for BuilderComponent
 * This is needed because BuilderComponent uses @emotion/core which requires React context
 * and cannot be used directly in server components
 */
export function BuilderContent({ content, model = 'page' }: BuilderContentProps) {
  if (!content) {
    return null;
  }

  return <BuilderComponent model={model} content={content} />;
}

