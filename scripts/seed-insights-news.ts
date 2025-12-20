/**
 * Seed script to migrate old hardcoded insights and news to database
 * Run with: npx tsx scripts/seed-insights-news.ts
 * 
 * Make sure your .env.local file has DATABASE_URL set
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

import { getPrismaClient } from '../src/lib/community-helpers';

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
    slug: 'dispute-prevention-checklist-smes',
    category: 'Dispute Prevention & Resolution',
    publishedAt: '2025-12-18',
    summary:
      'Practical steps that reduce dispute risk and make your position stronger if disagreements arise.',
    tags: ['SME', 'disputes', 'documentation'],
    body: [
      'Most disputes become expensive because facts are unclear and records are incomplete. Good documentation is preventive medicine.',
      'This page will be expanded into a step-by-step checklist with templates and sample record sets.',
    ].join('\n\n'),
    isPublished: true,
    isFeatured: true,
  },
];

const oldNews = [
  {
    slug: 'public-statement-template',
    type: 'Public statement',
    title: 'Public statement: approach to major tax developments (template)',
    publishedAt: '2025-12-18',
    summary:
      'A template for Tax Code statements: neutral tone, process clarity, rights-conscious framing, and practical implications.',
    body: [
      'Tax Code is a public-interest platform focused on tax understanding beyond rates and revenue.',
      'Our public statements emphasize lawful process, clarity, fairness, and institutional credibility—supporting reforms through trust and accountability.',
      'This page will be replaced with CMS-backed statements, with clear dates, categories, and citations where appropriate.',
    ].join('\n\n'),
    isPublished: true,
  },
  {
    slug: 'press-mention-template',
    type: 'Press mention',
    title: 'Press mention: Tax Code featured in policy dialogue (template)',
    publishedAt: '2025-12-18',
    summary:
      'A template for press mentions: link, excerpt, and institutional context—kept clean and verifiable.',
    body: [
      'Press mentions will be listed here with a link to the original source and a short excerpt for context.',
      'We keep this section factual and time-bound, separate from the Insights hub.',
    ].join('\n\n'),
    externalUrl: 'https://example.com',
    isPublished: true,
  },
];

async function seedInsightsAndNews() {
  try {
    const prisma = getPrismaClient() as any;

    console.log('🌱 Seeding insights and news...\n');

    // Seed Insights
    console.log('📝 Seeding Insights...');
    let insightsCreated = 0;
    let insightsSkipped = 0;

    for (const insight of oldInsights) {
      try {
        // Check if already exists
        const existing = await prisma.insight.findUnique({
          where: { slug: insight.slug },
        });

        if (existing) {
          console.log(`  ⏭️  Skipped: ${insight.title} (already exists)`);
          insightsSkipped++;
          continue;
        }

        await prisma.insight.create({
          data: {
            title: insight.title,
            slug: insight.slug,
            category: insight.category,
            summary: insight.summary,
            body: insight.body,
            tags: insight.tags,
            isPublished: insight.isPublished,
            isFeatured: insight.isFeatured,
            publishedAt: new Date(insight.publishedAt),
            downloads: insight.downloads || null,
          },
        });

        console.log(`  ✅ Created: ${insight.title}`);
        insightsCreated++;
      } catch (error: any) {
        console.error(`  ❌ Error creating "${insight.title}":`, error.message);
      }
    }

    console.log(`\n📰 Seeding News...`);
    let newsCreated = 0;
    let newsSkipped = 0;

    for (const newsItem of oldNews) {
      try {
        // Check if already exists
        const existing = await prisma.news.findUnique({
          where: { slug: newsItem.slug },
        });

        if (existing) {
          console.log(`  ⏭️  Skipped: ${newsItem.title} (already exists)`);
          newsSkipped++;
          continue;
        }

        await prisma.news.create({
          data: {
            title: newsItem.title,
            slug: newsItem.slug,
            type: newsItem.type,
            summary: newsItem.summary,
            body: newsItem.body,
            externalUrl: newsItem.externalUrl || null,
            isPublished: newsItem.isPublished,
            publishedAt: new Date(newsItem.publishedAt),
          },
        });

        console.log(`  ✅ Created: ${newsItem.title}`);
        newsCreated++;
      } catch (error: any) {
        console.error(`  ❌ Error creating "${newsItem.title}":`, error.message);
      }
    }

    console.log('\n✨ Seeding complete!');
    console.log(`\n📊 Summary:`);
    console.log(`   Insights: ${insightsCreated} created, ${insightsSkipped} skipped`);
    console.log(`   News: ${newsCreated} created, ${newsSkipped} skipped`);
    console.log(`\n🎉 Total: ${insightsCreated + newsCreated} new items added to database`);
  } catch (error: any) {
    console.error('❌ Seeding failed:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  } finally {
    const prisma = getPrismaClient() as any;
    await prisma.$disconnect();
  }
}

// Run the seed
seedInsightsAndNews();

