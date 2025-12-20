import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getFirebaseAdmin } from '@/lib/firebase-server';
import { verifySessionCookie } from '@/lib/session';

type EventBody = {
  type?: 'page_view' | 'tool_launch' | 'ai_question' | 'nav_click';
  route?: string;
  toolId?: string;
  trackId?: string;
};

function clampKey(key: string) {
  // Keep keys Firestore-friendly and bounded.
  return String(key).slice(0, 128);
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded?.uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { db } = getFirebaseAdmin();
    if (!db) return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });

    const body = (await request.json().catch(() => ({}))) as EventBody;
    const type = body?.type;
    if (!type) return NextResponse.json({ error: 'Missing event type' }, { status: 400 });

    const userRef = db.collection('users').doc(decoded.uid);

    // Read-modify-write (Phase A). If we want high write throughput later, we’ll use FieldValue.increment.
    const snap = await userRef.get();
    if (!snap.exists) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const data = snap.data() || {};
    const usage = data.usage || {};
    const pages = usage.pages || {};
    const tools = usage.tools || {};

    const update: Record<string, any> = {
      'usage.lastSeenAt': new Date(),
    };

    if (type === 'page_view') {
      const route = clampKey(body.route || 'unknown');
      update['usage.lastPage'] = route;
      update[`usage.pages.${route}`] = (pages[route] || 0) + 1;
    }

    if (type === 'tool_launch') {
      const toolId = clampKey(body.toolId || 'unknown');
      update[`usage.tools.${toolId}`] = (tools[toolId] || 0) + 1;
    }

    if (type === 'ai_question') {
      update['usage.aiQuestions'] = Number(usage.aiQuestions || 0) + 1;
    }

    if (type === 'nav_click') {
      update['usage.navClicks'] = Number(usage.navClicks || 0) + 1;
      // Optional: also count trackId as a pseudo-page
      if (body.trackId) {
        const track = clampKey(body.trackId);
        update[`usage.pages.nav:${track}`] = (pages[`nav:${track}`] || 0) + 1;
      }
    }

    await userRef.set(update, { merge: true });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('POST /api/personalization/event failed:', error);
    return NextResponse.json({ error: error?.message || 'Failed to record event' }, { status: 500 });
  }
}



