/**
 * Setup Script: Create Initial Admin User
 * 
 * This script creates the initial admin user (info@taxcode.com.ng) with the specified password.
 * Run this once to bootstrap the admin account.
 * 
 * Usage:
 *   npx tsx scripts/setup-admin.ts
 * 
 * Prerequisites:
 *   - Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env.local
 *   - Firebase Admin SDK will use these to authenticate
 */

import { initializeApp, getApps, getApp, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import crypto from 'crypto';

// Load environment variables
dotenv.config({ path: '.env.local' });

let app: App | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

function initializeFirebaseAdmin() {
  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
    };

    if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
      throw new Error(
        'Missing Firebase credentials. Ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set in .env.local'
      );
    }

    if (getApps().length === 0) {
      app = initializeApp({
        credential: cert({
          projectId: serviceAccount.projectId,
          clientEmail: serviceAccount.clientEmail,
          privateKey: serviceAccount.privateKey.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      app = getApp();
    }

    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    process.exit(1);
  }
}

async function setupAdminUser() {
  initializeFirebaseAdmin();

  if (!auth || !db) {
    console.error('Firebase Admin not properly initialized');
    process.exit(1);
  }

  // Bootstrap admin (created if missing)
  const bootstrapAdmin = {
    email: 'info@taxcode.com.ng',
    password: 'Lapinreform5%',
    displayName: 'TaxCode Admin',
  };

  // Additional admins (role is set to admin if the account already exists)
  const additionalAdminEmails = ['info.lapinreform@gmail.com'];

  const generateTempPassword = () => {
    // 16 chars, URL-safe-ish, strong enough for initial bootstrap then reset.
    return crypto.randomBytes(12).toString('base64url');
  };

  try {
    console.log(`\n🔧 Setting up admin user: ${bootstrapAdmin.email}`);

    // Step 1: Check if user already exists
    let uid: string;
    try {
      const existingUser = await auth.getUserByEmail(bootstrapAdmin.email);
      console.log(`✓ User already exists with UID: ${existingUser.uid}`);
      uid = existingUser.uid;
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        // Step 2: Create user if not exists
        const userRecord = await auth.createUser({
          email: bootstrapAdmin.email,
          password: bootstrapAdmin.password,
          displayName: bootstrapAdmin.displayName,
        });
        console.log(`✓ Created new user with UID: ${userRecord.uid}`);
        uid = userRecord.uid;
      } else {
        throw err;
      }
    }

    // Step 3: Ensure user record exists in Firestore
    const userDocRef = db.collection('users').doc(uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      await userDocRef.set({
        email: bootstrapAdmin.email,
        displayName: bootstrapAdmin.displayName,
        role: 'admin',
        createdAt: new Date(),
      });
      console.log(`✓ Created user record in Firestore`);
    } else {
      // Update role to admin if already exists
      await userDocRef.update({ role: 'admin' });
      console.log(`✓ Updated existing user record to admin role`);
    }

    // Step 4: Ensure additional admins are admin (only if they already exist in Auth)
    for (const email of additionalAdminEmails) {
      try {
        let user;
        try {
          user = await auth.getUserByEmail(email);
        } catch (err: any) {
          if (err?.code === 'auth/user-not-found') {
            const tempPassword = generateTempPassword();
            user = await auth.createUser({
              email,
              password: tempPassword,
              displayName: email.split('@')[0],
            });
            console.log(`✓ Created Auth user for additional admin: ${email}`);
            console.log(`  Temporary password (change immediately): ${tempPassword}`);
          } else {
            throw err;
          }
        }

        const ref = db.collection('users').doc(user.uid);
        const snap = await ref.get();
        if (!snap.exists) {
          await ref.set({ email, displayName: email.split('@')[0], role: 'admin', createdAt: new Date() }, { merge: true });
          console.log(`✓ Added Firestore user record and set admin role: ${email}`);
        } else {
          await ref.set({ role: 'admin' }, { merge: true });
          console.log(`✓ Ensured admin role: ${email}`);
        }
      } catch (err: any) {
        console.warn(`• Could not update ${email}:`, err?.message ?? err);
      }
    }

    console.log(`\n✅ Admin user setup complete!`);
    console.log(`   Email: ${bootstrapAdmin.email}`);
    console.log(`   Password: ${bootstrapAdmin.password}`);
    console.log(`   Role: admin`);
    console.log(`   UID: ${uid}\n`);

    process.exit(0);
  } catch (error: any) {
    console.error(`\n❌ Error setting up admin user:`, error.message);
    process.exit(1);
  }
}

setupAdminUser();
