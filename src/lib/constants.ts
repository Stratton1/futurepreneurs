// App-wide constants

export const APP_NAME = 'Futurepreneurs';
export const APP_DESCRIPTION = 'The crowdfunding platform for young entrepreneurs under 18';

export const PLATFORM_FEE_PERCENTAGE = 2.5;
export const MAX_FUNDING_GOAL = 10000; // £10,000
export const CURRENCY = 'GBP';
export const CURRENCY_SYMBOL = '£';

export const PROJECT_CATEGORIES = [
  'Technology',
  'Food & Drink',
  'Crafts & Making',
  'Services',
  'Fashion',
  'Arts & Entertainment',
  'Sports & Fitness',
  'Education',
  'Environment',
  'Other',
] as const;

export type ProjectCategory = typeof PROJECT_CATEGORIES[number];

// Known UK school email domain suffixes
export const SCHOOL_EMAIL_SUFFIXES = [
  '.sch.uk',
  '.ac.uk',
  '.school',
  '.edu',
  '.education',
] as const;

export const USER_ROLE_LABELS: Record<string, string> = {
  student: 'Student',
  teacher: 'Teacher / Mentor',
  parent: 'Parent / Guardian',
  investor: 'Supporter',
  admin: 'Admin',
};
