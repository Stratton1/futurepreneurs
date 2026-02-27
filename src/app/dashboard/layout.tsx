import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { DashboardWalkthroughWrapper } from './walkthrough-wrapper';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userRole: string | undefined;
  try {
    const user = await getCurrentUser();
    userRole = user?.role;
  } catch {
    // If auth fails, skip walkthrough
  }

  return (
    <DashboardWalkthroughWrapper userRole={userRole}>
      {children}
    </DashboardWalkthroughWrapper>
  );
}
