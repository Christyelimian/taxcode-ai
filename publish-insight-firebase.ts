/**
 * Script to publish the New Tax Act insight about bank account funds using Firebase
 * Run with: npx tsx publish-insight-firebase.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

// Debug: Check if Firebase env vars are loaded
console.log('🔧 Environment check:');
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Not set');
console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? '✅ Set' : '❌ Not set');
console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? '✅ Set' : '❌ Not set');

import { firestoreContent } from './src/lib/firestore-content';

async function publishTaxActInsight() {
  try {
    console.log('🔥 Initializing Firebase through firestore-content service...');

    const insightData = {
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
      publishedAt: new Date(),
    };

    console.log('🔍 Checking if insight already exists...');

    // Check if insight with this slug already exists
    const existing = await firestoreContent.getInsightBySlug(insightData.slug);

    if (existing) {
      console.log('⏭️  Insight already exists with slug:', insightData.slug);
      console.log('📄 Existing title:', existing.title);
      console.log('🔗 Existing slug:', existing.slug);
      console.log('🆔 Existing ID:', existing.id);
      return;
    }

    console.log('📝 Creating new insight...');
    console.log('Title:', insightData.title);
    console.log('Slug:', insightData.slug);
    console.log('Category:', insightData.category);

    const createdInsight = await firestoreContent.createInsight(insightData);

    console.log('✅ Insight published successfully!');
    console.log('🆔 ID:', createdInsight.id);
    console.log('📄 Title:', createdInsight.title);
    console.log('🔗 Slug:', createdInsight.slug);
    console.log('📅 Published at:', createdInsight.publishedAt?.toISOString());
    console.log('🏷️  Tags:', createdInsight.tags.join(', '));
    console.log('⭐ Featured:', createdInsight.isFeatured ? 'Yes' : 'No');
    console.log('📖 Published:', createdInsight.isPublished ? 'Yes' : 'No');

  } catch (error: any) {
    console.error('❌ Failed to publish insight:', error);
    console.error('Error details:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Run the script
publishTaxActInsight();
