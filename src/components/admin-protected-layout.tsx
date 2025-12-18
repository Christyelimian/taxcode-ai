import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/session';
import { getUserRole, type UserRole } from '@/lib/user-roles';

export interface AdminLayoutProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

export default async function AdminProtectedLayout({ 
  children, 
  requiredRoles = ['admin'] 
}: AdminLayoutProps) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const decoded = await verifySessionCookie(sessionCookie);

    if (!decoded || !decoded.uid) {
      redirect('/login');
    }

    // Fetch user role from Firestore
    const userRole = await getUserRole(decoded.uid);

    // Check if user has required role
    if (!userRole || !requiredRoles.includes(userRole)) {
      redirect('/dashboard'); // Redirect to dashboard if not authorized
    }
  } catch (e) {
    redirect('/login');
  }

  return <>{children}</>;
}
