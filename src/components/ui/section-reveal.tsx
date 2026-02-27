'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  staggerChildren?: number;
  as?: 'div' | 'section' | 'article' | 'ul';
}

export function SectionReveal({
  children,
  className = '',
  staggerChildren = 100,
  as: Tag = 'div',
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={className}
      style={
        {
          '--stagger-delay': `${staggerChildren}ms`,
        } as React.CSSProperties
      }
    >
      {isVisible ? children : (
        <div className="opacity-0">{children}</div>
      )}
    </Tag>
  );
}
