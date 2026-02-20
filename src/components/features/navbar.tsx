'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LogoutButton } from '@/components/features/logout-button';

interface NavbarProps {
  user?: {
    fullName: string;
    role: string;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-emerald-500 rounded-xl p-1.5 group-hover:bg-emerald-600 transition-colors">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Future<span className="text-emerald-500">preneurs</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/projects" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Browse Projects
            </Link>
            <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              How It Works
            </Link>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">{user.fullName}</span>
                <Link href="/dashboard">
                  <Button variant="primary" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <LogoutButton variant="icon" />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-3">
            <div className="flex flex-col gap-2">
              <Link
                href="/projects"
                className="px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Browse Projects
              </Link>
              <Link
                href="/how-it-works"
                className="px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 font-medium"
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </Link>
              {user ? (
                <>
                  <p className="px-3 py-1 text-sm text-gray-500">{user.fullName}</p>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full">
                      Dashboard
                    </Button>
                  </Link>
                  <LogoutButton variant="text" />
                </>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
