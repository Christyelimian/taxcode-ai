import AdminProtectedLayout from "@/components/admin-protected-layout";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminProtectedLayout>{children}</AdminProtectedLayout>;
}

