import AdminProtectedLayout from '@/components/admin-protected-layout';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminProtectedLayout>{children}</AdminProtectedLayout>;
}

