import type { ReactNode } from 'react';
import AdminProtectedLayout from '@/components/admin-protected-layout';

export default async function StaticPagesAdminLayout({ children }: { children: ReactNode }) {
  return <AdminProtectedLayout>{children}</AdminProtectedLayout>;
}

