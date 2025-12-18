import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/session';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const decoded = await verifySessionCookie(sessionCookie);
    if (!decoded) {
      redirect('/login');
    }
  } catch (e) {
    redirect('/login');
  }

  return <>{children}</>;
}
