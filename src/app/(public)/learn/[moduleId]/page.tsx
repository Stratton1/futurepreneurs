import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getModuleById } from '@/lib/learning-modules';

interface ModulePageProps {
  params: Promise<{ moduleId: string }>;
}

export default async function PublicModulePage({ params }: ModulePageProps) {
  const { moduleId } = await params;
  const mod = getModuleById(moduleId);
  if (!mod) redirect('/learn');

  const user = await getCurrentUser();
  if (user) {
    redirect(`/dashboard/learning/${moduleId}`);
  }

  redirect('/learn');
}
