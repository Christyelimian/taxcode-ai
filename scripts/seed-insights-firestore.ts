/**
 * Seed script to create insights directly in Firestore
 * Run with: npx tsx scripts/seed-insights-firestore.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

import { getFirebaseAdmin } from '../src/lib/firebase-server';

const oldInsights = [
  {
    title: 'How tax assessments work in practice: notices, timelines, and responses',
    slug: 'how-tax-assessments-work',
    category: 'Tax Process & Administration',
    publishedAt: '2025-12-18',
    summary:
      'A process-first guide to how assessments are raised, what validity looks like, and how to respond clearly and lawfully.',
    tags: ['assessment', 'process', 'notices'],
    body: [
      'Tax assessments are not just numbers—they are decisions made through defined processes. Understanding the steps helps taxpayers respond calmly and lawfully.',
      'This page will be expanded into a structured explainer with headings, timelines, sample notice anatomy, and a practical response checklist.',
    ].join('\n\n'),
    downloads: [{ label: 'Download: Response checklist (PDF) — coming soon', href: '/insights' }],
    isPublished: true,
    isFeatured: true,
  },
  {
    title: 'Taxpayer rights and administrative discretion: what the law allows (and limits)',
    slug: 'taxpayer-rights-and-discretion',
    category: 'Taxpayer Rights & State Authority',
    publishedAt: '2025-12-18',
    summary:
      'Understanding due process, fairness, and the lawful limits of power—without turning tax into a confrontation.',
    tags: ['rights', 'authority', 'due process'],
    body: [
      'Tax powers are statutory. That means authority exists within limits—and procedure matters.',
      'This page will be expanded with "rights & safeguards" summaries, examples of invalid actions, and practical steps for engagement.',
    ].join('\n\n'),
    isPublished: true,
    isFeatured: true,
  },
  {
    title: 'Dispute prevention checklist for SMEs: evidence, records, and early engagement',
    slug: 'dispute-prevention-checklist',
    category: 'Dispute Prevention & Resolution',
    publishedAt: '2025-12-18',
    summary:
      'Practical steps SMEs can take to minimize disputes through better record-keeping and proactive communication.',
    tags: ['dispute', 'prevention', 'sme'],
    body: [
      'Most tax disputes can be prevented through good record-keeping and early engagement with tax authorities.',
      'This checklist covers essential documentation, communication protocols, and preventive measures.',
    ].join('\n\n'),
    isPublished: true,
    isFeatured: false,
  },
];

async function seedInsights() {
  try {
    console.log('🌱 Seeding insights to Firestore...\n');

    const { db } = getFirebaseAdmin();
    if (!db) {
      console.error('❌ Failed to initialize Firestore');
      return;
    }

    console.log('✅ Connected to Firestore');

    let insightsCreated = 0;
    let insightsSkipped = 0;

    for (const insight of oldInsights) {
      try {
        // Check if already exists
        const existingQuery = db.collection('insights').where('slug', '==', insight.slug);
        const existingSnapshot = await existingQuery.get();

        if (!existingSnapshot.empty) {
          console.log(`  ⏭️  Skipped: ${insight.title} (already exists)`);
          insightsSkipped++;
          continue;
        }

        // Create the insight
        const docRef = await db.collection('insights').add({
          title: insight.title,
          slug: insight.slug,
          category: insight.category,
          summary: insight.summary,
          body: insight.body,
          tags: insight.tags,
          image: null,
          publishedAt: new Date(insight.publishedAt),
          isPublished: insight.isPublished,
          isFeatured: insight.isFeatured,
          downloads: insight.downloads || null,
          viewCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        console.log(`  ✅ Created: ${insight.title} (ID: ${docRef.id})`);
        insightsCreated++;
      } catch (error: any) {
        console.error(`  ❌ Error creating "${insight.title}":`, error.message);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Insights: ${insightsCreated} created, ${insightsSkipped} skipped`);
    console.log(`\n🎉 Total: ${insightsCreated} new insights added to Firestore`);

  } catch (error: any) {
    console.error('❌ Seeding failed:', error);
  }
}

seedInsights();
