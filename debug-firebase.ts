/**
 * Debug Firebase initialization
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

import { getFirebaseAdmin } from './src/lib/firebase-server';

async function debugFirebase() {
  console.log('🔧 Checking environment variables:');
  console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Not set');
  console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? '✅ Set' : '❌ Not set');
  console.log('FIREBASE_PRIVATE_KEY length:', process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.length + ' chars' : '❌ Not set');

  if (process.env.FIREBASE_PRIVATE_KEY) {
    console.log('Private key starts with:', process.env.FIREBASE_PRIVATE_KEY.substring(0, 50) + '...');
    console.log('Private key ends with:', process.env.FIREBASE_PRIVATE_KEY.substring(process.env.FIREBASE_PRIVATE_KEY.length - 50));
  }

  console.log('\n🔥 Testing Firebase initialization...');
  const result = getFirebaseAdmin();

  console.log('Firebase admin result:', {
    hasApp: !!result.app,
    hasAuth: !!result.auth,
    hasDb: !!result.db,
    dbType: result.db ? typeof result.db : 'undefined'
  });

  if (result.db) {
    console.log('✅ Firebase initialized successfully!');
  } else {
    console.log('❌ Firebase initialization failed');
  }
}

debugFirebase();
