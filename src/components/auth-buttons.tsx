
'use client';

import { clearSession } from '@/app/actions';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

export function SignOutButton({ children }: { children: ReactNode }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await clearSession();
    router.push('/login');
  };

  return <div onClick={handleSignOut} className="cursor-pointer">{children}</div>;
}
