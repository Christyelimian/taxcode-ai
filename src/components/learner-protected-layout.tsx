import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/session';
import { getUserRole } from '@/lib/user-roles';

export interface LearnerLayoutProps {
  children: React.ReactNode;
}

/**
 * Protected layout for learner-only pages
 * Requires 'learner' or 'admin' role
 */
export default async function LearnerProtectedLayout({ 
  children 
}: LearnerLayoutProps) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const decoded = await verifySessionCookie(sessionCookie);

    if (!decoded || !decoded.uid) {
      redirect('/login?redirect=/academy');
    }

    // Fetch user role from Firestore
    const userRole = await getUserRole(decoded.uid);

    // Check if user has learner or admin role
    if (!userRole || (userRole !== 'learner' && userRole !== 'admin')) {
      redirect('/academy/onboard?type=learner&message=Please apply to become a learner to access courses');
    }
  } catch (e) {
    redirect('/login?redirect=/academy');
  }

  return <>{children}</>;
}
