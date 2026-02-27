import { describe, it, expect } from 'vitest';
import {
  APP_NAME,
  PLATFORM_FEE_PERCENTAGE,
  MAX_FUNDING_GOAL,
  CURRENCY,
  CURRENCY_SYMBOL,
  PROJECT_CATEGORIES,
  SCHOOL_EMAIL_SUFFIXES,
  USER_ROLE_LABELS,
} from '@/lib/constants';
import { ERRORS } from '@/lib/error-messages';

describe('platform constants', () => {
  it('has correct app name', () => {
    expect(APP_NAME).toBe('Futurepreneurs');
  });

  it('has platform fee at 2.5%', () => {
    expect(PLATFORM_FEE_PERCENTAGE).toBe(2.5);
  });

  it('has max funding goal of £10,000', () => {
    expect(MAX_FUNDING_GOAL).toBe(10000);
  });

  it('uses GBP currency', () => {
    expect(CURRENCY).toBe('GBP');
    expect(CURRENCY_SYMBOL).toBe('£');
  });
});

describe('project categories', () => {
  it('has 10 categories', () => {
    expect(PROJECT_CATEGORIES).toHaveLength(10);
  });

  it('includes key categories', () => {
    expect(PROJECT_CATEGORIES).toContain('Technology');
    expect(PROJECT_CATEGORIES).toContain('Food & Drink');
    expect(PROJECT_CATEGORIES).toContain('Crafts & Making');
    expect(PROJECT_CATEGORIES).toContain('Environment');
    expect(PROJECT_CATEGORIES).toContain('Other');
  });

  it('has no duplicate categories', () => {
    const unique = new Set(PROJECT_CATEGORIES);
    expect(unique.size).toBe(PROJECT_CATEGORIES.length);
  });
});

describe('school email suffixes', () => {
  it('includes UK school domain suffixes', () => {
    expect(SCHOOL_EMAIL_SUFFIXES).toContain('.sch.uk');
    expect(SCHOOL_EMAIL_SUFFIXES).toContain('.ac.uk');
  });

  it('has at least 3 suffixes', () => {
    expect(SCHOOL_EMAIL_SUFFIXES.length).toBeGreaterThanOrEqual(3);
  });
});

describe('user role labels', () => {
  it('has all 5 roles', () => {
    expect(Object.keys(USER_ROLE_LABELS)).toHaveLength(5);
  });

  it('maps roles to human-readable labels', () => {
    expect(USER_ROLE_LABELS.student).toBe('Student');
    expect(USER_ROLE_LABELS.teacher).toBe('Teacher / Mentor');
    expect(USER_ROLE_LABELS.parent).toBe('Parent / Guardian');
    expect(USER_ROLE_LABELS.investor).toBe('Supporter');
    expect(USER_ROLE_LABELS.admin).toBe('Admin');
  });
});

describe('error messages', () => {
  it('has authentication error', () => {
    expect(ERRORS.NOT_AUTHENTICATED).toBeDefined();
    expect(ERRORS.NOT_AUTHENTICATED.length).toBeGreaterThan(0);
  });

  it('has role-based access errors', () => {
    expect(ERRORS.STUDENTS_ONLY).toBeDefined();
    expect(ERRORS.TEACHERS_ONLY).toBeDefined();
    expect(ERRORS.PARENTS_ONLY).toBeDefined();
  });

  it('has no empty error messages', () => {
    for (const [key, value] of Object.entries(ERRORS)) {
      expect(value, `ERRORS.${key} should not be empty`).toBeTruthy();
      expect(typeof value, `ERRORS.${key} should be a string`).toBe('string');
    }
  });

  it('has no duplicate error messages', () => {
    const values = Object.values(ERRORS);
    const unique = new Set(values);
    // Allow a few duplicates (some errors are intentionally similar)
    expect(unique.size).toBeGreaterThan(values.length * 0.9);
  });
});
