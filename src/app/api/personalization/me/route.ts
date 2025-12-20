import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getFirebaseAdmin } from '@/lib/firebase-server';
import { verifySessionCookie } from '@/lib/session';

function sanitizeUserDoc(data: any) {
  // Only return fields needed by the client for Phase A.
  return {
    email: data?.email ?? null,
    displayName: data?.displayName ?? null,
    role: data?.role ?? 'user',
    persona: data?.persona ?? 'individual',
    tier: data?.tier ?? 'free',
    location: data?.location ?? { state: null, lga: null },
    intent: data?.intent ?? { primary: null, updatedAt: null },
    capability: data?.capability ?? { level: 'beginner', explanationDepth: 'balanced' },
    taxProfile: data?.taxProfile ?? {
      incomeType: 'unknown',
      vatStatus: 'unknown',
      filingFrequency: 'unknown',
      industry: null,
    },
    consents: data?.consents ?? { personalizationLevel: 1, sensitiveFinancial: false, aiMemory: false },
    usage: data?.usage ?? { lastSeenAt: null, lastPage: null, pages: {}, tools: {}, aiQuestions: 0, navClicks: 0 },
  };
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded?.uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { db } = getFirebaseAdmin();
    if (!db) return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });

    const snap = await db.collection('users').doc(decoded.uid).get();
    if (!snap.exists) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ me: sanitizeUserDoc(snap.data()) });
  } catch (error: any) {
    console.error('GET /api/personalization/me failed:', error);
    return NextResponse.json({ error: error?.message || 'Failed to load personalization' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded?.uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { db } = getFirebaseAdmin();
    if (!db) return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });

    const body = await request.json().catch(() => ({}));

    // Phase A: allow safe, progressive fields only.
    const update: Record<string, any> = {};
    if (body?.persona) update.persona = body.persona;
    if (body?.tier) update.tier = body.tier; // will later be billing-controlled; allowed for now
    if (body?.location) update.location = body.location;
    if (body?.intent) update.intent = { ...body.intent, updatedAt: new Date() };
    if (body?.capability) update.capability = body.capability;
    if (body?.consents) update.consents = body.consents;
    if (body?.taxProfile) update.taxProfile = body.taxProfile;

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    await db.collection('users').doc(decoded.uid).set(update, { merge: true });

    const snap = await db.collection('users').doc(decoded.uid).get();
    return NextResponse.json({ me: sanitizeUserDoc(snap.data()) });
  } catch (error: any) {
    console.error('PATCH /api/personalization/me failed:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update personalization' }, { status: 500 });
  }
}



