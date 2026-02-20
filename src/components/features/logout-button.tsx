'use client';

import { LogOut } from 'lucide-react';
import { signOut } from '@/app/(auth)/actions';

export function LogoutButton({ variant = 'icon' }: { variant?: 'icon' | 'text' }) {
  if (variant === 'text') {
    return (
      <form action={signOut}>
        <button
          type="submit"
          className="px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 font-medium text-left text-sm w-full"
        >
          Log out
        </button>
      </form>
    );
  }

  return (
    <form action={signOut}>
      <button
        type="submit"
        className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        title="Log out"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </form>
  );
}
