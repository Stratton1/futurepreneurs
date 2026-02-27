'use client';

import { type ReactNode } from 'react';
import { WalkthroughProvider } from '@/components/features/walkthrough/walkthrough-provider';
import { studentSteps } from '@/lib/walkthrough/student-steps';
import { teacherSteps } from '@/lib/walkthrough/teacher-steps';
import { parentSteps } from '@/lib/walkthrough/parent-steps';

const allSteps: Record<string, typeof studentSteps> = {
  student: studentSteps,
  teacher: teacherSteps,
  parent: parentSteps,
};

export function DashboardWalkthroughWrapper({
  children,
  userRole,
}: {
  children: ReactNode;
  userRole?: string;
}) {
  return (
    <WalkthroughProvider steps={allSteps} userRole={userRole} autoStart>
      {children}
    </WalkthroughProvider>
  );
}
