import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth-helpers';
import { getLessonById } from '@/lib/learning-modules';

interface LessonPageProps {
  params: Promise<{ moduleId: string; lessonId: string }>;
}

export default async function PublicLessonPage({ params }: LessonPageProps) {
  const { moduleId, lessonId } = await params;
  const result = getLessonById(moduleId, lessonId);
  if (!result) redirect('/learn');

  const user = await getCurrentUser();
  if (user) {
    redirect(`/dashboard/learning/${moduleId}/${lessonId}`);
  }

  redirect('/learn');
}
