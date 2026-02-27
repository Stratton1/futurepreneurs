import {
  Rocket, User, FolderKanban, CreditCard, Wallet, ShieldCheck,
  GraduationCap, Users, Heart, Settings,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface HelpCategory {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  order: number;
}

export const helpCategories: HelpCategory[] = [
  {
    id: 'getting-started',
    slug: 'getting-started',
    title: 'Getting Started',
    description: 'New to Futurepreneurs? Learn the basics of creating your account and navigating the platform.',
    icon: Rocket,
    color: 'emerald',
    order: 1,
  },
  {
    id: 'account-profile',
    slug: 'account-profile',
    title: 'Account & Profile',
    description: 'Manage your account settings, update your profile, and understand your dashboard.',
    icon: User,
    color: 'blue',
    order: 2,
  },
  {
    id: 'projects',
    slug: 'projects',
    title: 'Projects',
    description: 'Everything about creating, managing, and publishing your crowdfunding projects.',
    icon: FolderKanban,
    color: 'purple',
    order: 3,
  },
  {
    id: 'funding-payments',
    slug: 'funding-payments',
    title: 'Funding & Payments',
    description: 'How funding works, payment methods, platform fees, and what happens when your project reaches its goal.',
    icon: CreditCard,
    color: 'amber',
    order: 4,
  },
  {
    id: 'drawdowns-spending',
    slug: 'drawdowns-spending',
    title: 'Drawdowns & Spending',
    description: 'Request milestone drawdowns, understand the approval process, and track your spending.',
    icon: Wallet,
    color: 'indigo',
    order: 5,
  },
  {
    id: 'wallet-card',
    slug: 'wallet-card',
    title: 'Wallet & Card',
    description: 'Using the digital wallet, spending card, approval flows, and velocity limits.',
    icon: CreditCard,
    color: 'rose',
    order: 6,
  },
  {
    id: 'safety-trust',
    slug: 'safety-trust',
    title: 'Safety & Trust',
    description: 'How we keep the platform safe, content moderation, reporting, and safeguarding.',
    icon: ShieldCheck,
    color: 'red',
    order: 7,
  },
  {
    id: 'for-teachers',
    slug: 'for-teachers',
    title: 'For Teachers',
    description: 'Teacher-specific guides for verifying projects, approving drawdowns, and mentoring students.',
    icon: GraduationCap,
    color: 'teal',
    order: 8,
  },
  {
    id: 'for-parents',
    slug: 'for-parents',
    title: 'For Parents',
    description: 'Parent guides for giving consent, monitoring projects, managing the wallet, and staying informed.',
    icon: Users,
    color: 'orange',
    order: 9,
  },
  {
    id: 'for-supporters',
    slug: 'for-supporters',
    title: 'For Supporters',
    description: 'How to find and support young entrepreneurs, track your contributions, and get updates.',
    icon: Heart,
    color: 'pink',
    order: 10,
  },
  {
    id: 'troubleshooting',
    slug: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'Common issues and solutions for login problems, payment errors, and general platform questions.',
    icon: Settings,
    color: 'gray',
    order: 11,
  },
];

export function getCategoryBySlug(slug: string): HelpCategory | undefined {
  return helpCategories.find((c) => c.slug === slug);
}
