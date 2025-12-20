/**
 * Builder.io Component Registration (Client-side)
 * 
 * This file ensures components are registered when the app loads on the client.
 * Import this file in a client component or use it in a useEffect.
 */

'use client';

import { Builder } from '@builder.io/react';
import { HeroSection } from '@/components/builder/HeroSection';
import { PathwayGrid } from '@/components/builder/PathwayGrid';
import { PathwayCard } from '@/components/builder/PathwayCard';
import { RichTextSection } from '@/components/builder/RichTextSection';

// Register components with Builder.io
if (typeof window !== 'undefined') {
  // Hero Section
  Builder.registerComponent(HeroSection, {
    name: 'HeroSection',
    inputs: [
      { name: 'badge', type: 'string', defaultValue: 'Start Here' },
      { name: 'heading', type: 'string', required: true },
      { name: 'description', type: 'richText' },
      {
        name: 'buttons',
        type: 'list',
        defaultValue: [],
        subFields: [
          { name: 'label', type: 'string', required: true },
          { name: 'href', type: 'string', required: true },
          { name: 'variant', type: 'string', enum: ['default', 'outline', 'ghost'], defaultValue: 'default' },
        ],
      },
      { name: 'className', type: 'string' },
    ],
  });

  // Pathway Grid
  Builder.registerComponent(PathwayGrid, {
    name: 'PathwayGrid',
    inputs: [
      {
        name: 'pathways',
        type: 'list',
        defaultValue: [],
        subFields: [
          { name: 'title', type: 'string', required: true },
          { name: 'description', type: 'richText', required: true },
          {
            name: 'links',
            type: 'list',
            defaultValue: [],
            subFields: [
              { name: 'label', type: 'string', required: true },
              { name: 'href', type: 'string', required: true },
            ],
          },
        ],
      },
      { name: 'columns', type: 'number', defaultValue: 2, enum: [2, 3, 4] },
      { name: 'className', type: 'string' },
    ],
  });

  // Pathway Card
  Builder.registerComponent(PathwayCard, {
    name: 'PathwayCard',
    inputs: [
      { name: 'title', type: 'string', required: true },
      { name: 'description', type: 'richText' },
      {
        name: 'links',
        type: 'list',
        defaultValue: [],
        subFields: [
          { name: 'label', type: 'string', required: true },
          { name: 'href', type: 'string', required: true },
        ],
      },
    ],
  });

  // Rich Text Section
  Builder.registerComponent(RichTextSection, {
    name: 'RichTextSection',
    inputs: [
      { name: 'title', type: 'string' },
      { name: 'content', type: 'richText', required: true },
      { name: 'className', type: 'string' },
    ],
  });
}

