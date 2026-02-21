'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
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
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      // Never hide when mobile menu is open or near top of page
      if (isOpen || currentY < 100) {
        setHidden(false);
      } else if (currentY > lastScrollY.current + 10) {
        // Scrolling down — hide
        setHidden(true);
      } else if (currentY < lastScrollY.current - 10) {
        // Scrolling up — show
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  return (
    <nav className={`bg-white border-b border-gray-100 sticky top-0 z-50 transition-transform duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
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
            <Link href={user ? '/dashboard/learning' : '/learn'} className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Learn
            </Link>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">{user.fullName}</span>
                <Link href="/dashboard">
                  <Button variant="primary" size="sm" asChild>
                    Dashboard
                  </Button>
                </Link>
                <LogoutButton variant="icon" />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm" asChild>
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm" asChild>
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
              <Link
                href={user ? '/dashboard/learning' : '/learn'}
                className="px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Learn
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
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      Log in
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full" asChild>
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
