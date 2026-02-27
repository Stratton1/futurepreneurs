import type { WalkthroughStep } from './types';

export const teacherSteps: WalkthroughStep[] = [
  {
    target: 'welcome',
    title: 'Welcome, Teacher!',
    description: 'This is your dashboard for mentoring student entrepreneurs. You are the trust anchor — your verification gives supporters confidence in each project.',
    position: 'bottom',
  },
  {
    target: 'verify-projects',
    title: 'Verify Projects',
    description: 'Students at your school will submit projects for your review. Check each one is genuine and appropriate, then approve, request changes, or reject.',
    position: 'bottom',
  },
  {
    target: 'approve-drawdowns',
    title: 'Approve Drawdowns & Spending',
    description: 'When funded students want to spend money, they submit requests against their milestones. Review and approve each request here.',
    position: 'bottom',
  },
  {
    target: 'notifications',
    title: 'Notifications',
    description: 'You will be notified when students submit projects or spending requests. Keep an eye here so nothing falls through the cracks.',
    position: 'bottom',
  },
  {
    target: 'profile',
    title: 'Your Profile',
    description: 'Manage your account and school information here. That is the tour! Your students are counting on you.',
    position: 'bottom',
  },
];
