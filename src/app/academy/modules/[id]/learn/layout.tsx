import type { ReactNode } from 'react';
import LearnerProtectedLayout from '@/components/learner-protected-layout';

export default async function LearnPageLayout({ children }: { children: ReactNode }) {
  return <LearnerProtectedLayout>{children}</LearnerProtectedLayout>;
}



