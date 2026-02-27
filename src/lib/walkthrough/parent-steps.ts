import type { WalkthroughStep } from './types';

export const parentSteps: WalkthroughStep[] = [
  {
    target: 'welcome',
    title: 'Welcome, Parent!',
    description: 'This is your hub for overseeing your child\u0027s entrepreneurial journey. You can track their projects, approve spending, and stay informed every step of the way.',
    position: 'bottom',
  },
  {
    target: 'parent-hub',
    title: 'Parent Hub',
    description: 'Your central overview — see your child\u0027s projects, funding progress, recent activity, and any actions that need your attention.',
    position: 'bottom',
  },
  {
    target: 'consent-requests',
    title: 'Consent Requests',
    description: 'Before your child\u0027s project can go live, you will need to review and give consent here. You can see project details before approving.',
    position: 'bottom',
  },
  {
    target: 'wallet-approvals',
    title: 'Wallet & Spending',
    description: 'When your child wants to spend project funds, you will review and approve spending requests here. All spending has dual approval (you and their teacher).',
    position: 'bottom',
  },
  {
    target: 'notifications',
    title: 'Notifications',
    description: 'Stay informed about consent requests, spending activity, funding milestones, and project updates. We keep you in the loop.',
    position: 'bottom',
  },
  {
    target: 'profile',
    title: 'Your Profile',
    description: 'Manage your account and notification preferences here. That is the tour! You are all set to support your young entrepreneur.',
    position: 'bottom',
  },
];
