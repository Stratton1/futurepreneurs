'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteStretchGoal } from './actions';
import { Trash2 } from 'lucide-react';

export function DeleteStretchGoalButton({ goalId }: { goalId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm('Delete this stretch goal?')) return;
    setDeleting(true);
    await deleteStretchGoal(goalId);
    setDeleting(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
      title="Delete"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
