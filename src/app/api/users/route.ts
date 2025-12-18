import { getFirebaseAdmin } from '@/lib/firebase-server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserRole } from '@/lib/user-roles';

export async function GET() {
  try {
    const { auth, db } = getFirebaseAdmin();
    if (!auth || !db) {
      return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });
    }

    // Verify session cookie (optional, but good for extra security)
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await auth.verifySessionCookie(sessionCookie, true);
    
    // Fetch all users from the 'users' collection
    const usersSnapshot = await db.collection('users').get();
    const users = usersSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        uid: doc.id,
        email: data.email || '',
        displayName: data.displayName || '',
        role: data.role || 'user',
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      };
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
