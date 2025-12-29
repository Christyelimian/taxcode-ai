/**
 * Verify the insight was published correctly
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

async function verifyInsight() {
  try {
    console.log('🔍 Verifying published insight...');

    // Initialize Firebase
    if (getApps().length === 0) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID!,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
          privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
        }),
      });
    }

    const db = getFirestore();

    // Check if insight exists
    const insightsRef = db.collection('insights');
    const query = insightsRef.where('slug', '==', 'new-tax-act-bank-accounts-impact');
    const snapshot = await query.get();

    if (snapshot.empty) {
      console.log('❌ Insight not found');
      return;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    console.log('✅ Insight found!');
    console.log('🆔 ID:', doc.id);
    console.log('📄 Title:', data.title);
    console.log('🔗 Slug:', data.slug);
    console.log('📂 Category:', data.category);
    console.log('📖 Published:', data.isPublished ? 'Yes' : 'No');
    console.log('⭐ Featured:', data.isFeatured ? 'Yes' : 'No');
    console.log('🏷️  Tags:', data.tags.join(', '));
    console.log('📅 Published at:', data.publishedAt?.toDate()?.toISOString());
    console.log('👀 View count:', data.viewCount);

    // Check summary and body length
    console.log('📝 Summary length:', data.summary.length, 'characters');
    console.log('📄 Body length:', data.body.length, 'characters');

    console.log('\n🔗 Insight URL: /insights/new-tax-act-bank-accounts-impact');

  } catch (error: any) {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  }
}

verifyInsight();
