import type { ReactNode } from "react";
import ProtectedLayout from "@/components/protected-layout";

export default async function ConsultantDashboardLayout({ children }: { children: ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}


