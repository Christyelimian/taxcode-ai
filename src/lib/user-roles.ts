import { getFirebaseAdmin } from '@/lib/firebase-server';

export type UserRole = 'admin' | 'user' | 'moderator';
export type UserTier = 'free' | 'pro' | 'enterprise';
export type UserPersona = 'individual' | 'business_owner' | 'accountant' | 'student';

// Fetch user role from Firestore (created on first login)
export async function getUserRole(uid: string): Promise<UserRole | null> {
  try {
    const { db } = getFirebaseAdmin();
    if (!db) return null;

    const docSnap = await db.collection('users').doc(uid).get();
    if (!docSnap.exists) return null;

    const data = docSnap.data();
    return (data?.role as UserRole) || 'user';
  } catch (error) {
    console.warn('Error fetching user role:', error);
    return null;
  }
}

// Initialize user in Firestore if first login
export async function ensureUserExists(uid: string, email: string, displayName?: string) {
  try {
    const { db } = getFirebaseAdmin();
    if (!db) return;

    const userRef = db.collection('users').doc(uid);
    const docSnap = await userRef.get();

    if (!docSnap.exists) {
      await userRef.set({
        email,
        displayName: displayName || email.split('@')[0],
        role: 'user', // Default role
        // --- IPS defaults (Phase A) ---
        persona: 'individual' as UserPersona,
        tier: 'free' as UserTier,
        location: { state: null, lga: null },
        intent: { primary: null, updatedAt: null },
        capability: { level: 'beginner', explanationDepth: 'balanced' },
        taxProfile: {
          incomeType: 'unknown',
          vatStatus: 'unknown',
          filingFrequency: 'unknown',
          industry: null,
        },
        consents: {
          personalizationLevel: 1,
          sensitiveFinancial: false,
          aiMemory: false,
        },
        usage: {
          lastSeenAt: new Date(),
          lastPage: null,
          pages: {},
          tools: {},
          aiQuestions: 0,
          navClicks: 0,
        },
        createdAt: new Date(),
      });
    } else {
      // Ensure IPS defaults exist for older accounts (non-destructive merge).
      // Firestore will only fill missing fields; existing user settings remain unchanged.
      await userRef.set(
        {
          persona: 'individual' as UserPersona,
          tier: 'free' as UserTier,
          location: { state: null, lga: null },
          intent: { primary: null, updatedAt: null },
          capability: { level: 'beginner', explanationDepth: 'balanced' },
          taxProfile: {
            incomeType: 'unknown',
            vatStatus: 'unknown',
            filingFrequency: 'unknown',
            industry: null,
          },
          consents: {
            personalizationLevel: 1,
            sensitiveFinancial: false,
            aiMemory: false,
          },
          usage: {
            lastSeenAt: new Date(),
            lastPage: null,
            pages: {},
            tools: {},
            aiQuestions: 0,
            navClicks: 0,
          },
        },
        { merge: true }
      );
    }
  } catch (error) {
    console.warn('Error ensuring user exists:', error);
  }
}

// Set user role (admin-only operation)
export async function setUserRole(uid: string, role: UserRole) {
  try {
    const { db } = getFirebaseAdmin();
    if (!db) throw new Error('Firestore is not initialized.');
    await db.collection('users').doc(uid).update({ role });
  } catch (error) {
    console.error('Error setting user role:', error);
    throw error;
  }
}
