'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface AnimateInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  animation?: 'fade-up' | 'fade-in' | 'fade-left' | 'fade-right' | 'scale-in' | 'slide-up';
}

export function AnimateIn({ children, delay = 0, className = '', animation = 'fade-up' }: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  const animations: Record<string, { hidden: string; visible: string }> = {
    'fade-up': {
      hidden: 'opacity-0 translate-y-8',
      visible: 'opacity-100 translate-y-0',
    },
    'fade-in': {
      hidden: 'opacity-0',
      visible: 'opacity-100',
    },
    'fade-left': {
      hidden: 'opacity-0 -translate-x-8',
      visible: 'opacity-100 translate-x-0',
    },
    'fade-right': {
      hidden: 'opacity-0 translate-x-8',
      visible: 'opacity-100 translate-x-0',
    },
    'scale-in': {
      hidden: 'opacity-0 scale-95',
      visible: 'opacity-100 scale-100',
    },
    'slide-up': {
      hidden: 'opacity-0 translate-y-12',
      visible: 'opacity-100 translate-y-0',
    },
  };

  const anim = animations[animation];

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${isVisible ? anim.visible : anim.hidden} ${className}`}
    >
      {children}
    </div>
  );
}
