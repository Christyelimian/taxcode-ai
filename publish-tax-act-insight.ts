/**
 * Script to publish the New Tax Act insight about bank account funds
 * Run with: npx tsx publish-tax-act-insight.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

import { getPrismaClient } from './src/lib/community-helpers';

async function publishTaxActInsight() {
  try {
    const prisma = getPrismaClient() as any;

    console.log('📝 Publishing New Tax Act insight about bank account funds...\n');

    const insight = {
      title: "What impact does the New Tax Act have on existing funds in individuals' bank accounts, especially with regards to tax deductions?",
      slug: 'new-tax-act-bank-accounts-impact',
      category: 'Taxpayer Rights & State Authority',
      summary: 'The New Tax Act does not impose automatic taxation on existing bank balances, but has important indirect implications for compliance and transparency that taxpayers should understand.',
      body: `Under the New Tax Act, existing money already sitting in people's bank accounts is not automatically taxed, confiscated or deemed illegal. The Act does not impose a one-off tax on bank balances. However, it has indirect implications that taxpayers should clearly understand.

First, bank balances can now attract scrutiny, not taxation by default. Where funds in an account appear inconsistent with declared income or tax history, tax authorities may raise questions during audits or investigations. The issue is not the money itself but the source of the money and whether it aligns with tax filings.

Second, the Act strengthens information sharing and data matching. Banks, regulators and tax authorities are more aligned, which means unexplained large deposits, frequent inflows or lifestyle mismatches may trigger enquiries. This does not mean guilt, but it shifts the burden to the taxpayer to explain.

Third, enforcement tools are clearer. Where a tax liability has been lawfully established after due process, including assessment, notice and opportunity to object, bank accounts may be used for recovery. This only happens after procedure is followed, not arbitrarily.

Fourth, for compliant taxpayers, there is no negative effect. Properly declared income, legitimate savings and previously taxed earnings remain protected. The Act actually improves certainty by clarifying process and limiting discretion.

In simple terms, the New Tax Act is not about taxing savings, but about closing gaps between income, records and compliance. Those who keep proper records and file correctly have little to fear, while the focus is on transparency, fairness and self-compliance rather than punishment.`,
      tags: ['New Tax Act', 'bank accounts', 'tax compliance', 'savings', 'transparency', 'enforcement'],
      isPublished: true,
      isFeatured: true,
      publishedAt: new Date().toISOString().split('T')[0], // Today's date
    };

    // Check if already exists
    const existing = await prisma.insight.findUnique({
      where: { slug: insight.slug },
    });

    if (existing) {
      console.log(`⏭️  Insight already exists: "${insight.title}"`);
      console.log(`🔗 Slug: ${insight.slug}`);
      return;
    }

    // Create the insight
    const created = await prisma.insight.create({
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
      },
    });

    console.log('✅ Insight published successfully!');
    console.log(`📄 Title: ${created.title}`);
    console.log(`🔗 Slug: ${created.slug}`);
    console.log(`🆔 ID: ${created.id}`);
    console.log(`📅 Published at: ${created.publishedAt}`);
    console.log(`🏷️  Tags: ${created.tags.join(', ')}`);
    console.log(`⭐ Featured: ${created.isFeatured ? 'Yes' : 'No'}`);

  } catch (error: any) {
    console.error('❌ Failed to publish insight:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  } finally {
    const prisma = getPrismaClient() as any;
    await prisma.$disconnect();
  }
}

// Run the script
publishTaxActInsight();
