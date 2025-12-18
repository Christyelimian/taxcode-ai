import { getFirebaseAdmin } from '@/lib/firebase-server';

export async function verifySessionCookie(sessionCookie?: string) {
  if (!sessionCookie) return null;
  try {
    const { auth } = getFirebaseAdmin();
    if (!auth) return null;
    const decoded = await auth.verifySessionCookie(sessionCookie, true);
    return decoded;
  } catch (error) {
    console.warn('Session cookie verification failed:', error);
    return null;
  }
}

export async function getUserFromRequestCookies(cookies: { get: (name: string) => { value: string } | undefined }) {
  const cookie = cookies.get('session');
  const session = cookie?.value;
  return await verifySessionCookie(session);
}
