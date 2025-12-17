
import { initializeApp, getApps, getApp, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let app: App | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

try {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // The key is passed directly, assuming it's correctly formatted in the .env file.
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
  };

  if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
    if (getApps().length === 0) {
      app = initializeApp({
        // The cert function expects the private key to have real newlines.
        // The .replace() call ensures this works even if the .env file has literal '\n'.
        credential: cert({
            projectId: serviceAccount.projectId,
            clientEmail: serviceAccount.clientEmail,
            privateKey: serviceAccount.privateKey.replace(/\\n/g, '\n')
        }),
      });
    } else {
      app = getApp();
    }
    
    auth = getAuth(app);
    db = getFirestore(app);
  } else {
    console.warn('Firebase Admin SDK service account credentials are not fully configured in environment variables. Server-side Firebase features will be disabled.');
  }
} catch (error) {
  console.error('Firebase Admin SDK initialization error:', error);
}

export { app, auth, db };
