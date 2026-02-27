import type { WalkthroughStep } from './types';

export const studentSteps: WalkthroughStep[] = [
  {
    target: 'welcome',
    title: 'Welcome to Futurepreneurs!',
    description: 'This is your dashboard — your home base for managing projects, tracking funding, and growing your business idea. Let us show you around.',
    position: 'bottom',
  },
  {
    target: 'my-projects',
    title: 'My Projects',
    description: 'Here you can see all your projects, create new ones, track funding progress, and manage updates. This is where it all starts.',
    position: 'bottom',
  },
  {
    target: 'learning-hub',
    title: 'Learning Hub',
    description: 'Learn the skills you need to succeed — from writing a great project pitch to managing your budget. Earn badges as you go.',
    position: 'bottom',
  },
  {
    target: 'trophy-room',
    title: 'Trophy Room',
    description: 'Your achievements live here. Earn badges by completing learning modules, hitting funding milestones, and growing your skills.',
    position: 'bottom',
  },
  {
    target: 'notifications',
    title: 'Notifications',
    description: 'Stay up to date with project approvals, new backers, funding milestones, and more. We will keep you in the loop.',
    position: 'bottom',
  },
  {
    target: 'profile',
    title: 'Your Profile',
    description: 'Manage your account details, school information, and notification preferences here. That is the tour — you are ready to start!',
    position: 'bottom',
  },
];
