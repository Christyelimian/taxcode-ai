
'use client';

import { clearSession } from '@/app/actions';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { auth, signOutClient } from '@/lib/firebase-client';

export function SignOutButton({ children }: { children: ReactNode }) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // Sign out client-side auth state
      await signOutClient();
    } catch (e) {
      console.warn('Client signOut error', e);
    }

    // Clear server session cookie
    await clearSession();
    router.push('/login');
  };

  return <div onClick={handleSignOut} className="cursor-pointer">{children}</div>;
}
