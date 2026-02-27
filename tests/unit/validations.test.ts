import { describe, it, expect } from 'vitest';
import { isSchoolEmailDomain, isValidEmail, isStrongPassword, isValidFullName } from '@/lib/validations';

describe('isSchoolEmailDomain', () => {
  it('accepts valid UK school email domains', () => {
    expect(isSchoolEmailDomain('student@greenfield.sch.uk')).toBe(true);
    expect(isSchoolEmailDomain('student@university.ac.uk')).toBe(true);
    expect(isSchoolEmailDomain('student@primary.school')).toBe(true);
    expect(isSchoolEmailDomain('student@college.edu')).toBe(true);
    expect(isSchoolEmailDomain('student@school.education')).toBe(true);
  });

  it('rejects non-school email domains', () => {
    expect(isSchoolEmailDomain('user@gmail.com')).toBe(false);
    expect(isSchoolEmailDomain('user@outlook.com')).toBe(false);
    expect(isSchoolEmailDomain('user@yahoo.co.uk')).toBe(false);
    expect(isSchoolEmailDomain('user@company.co.uk')).toBe(false);
  });

  it('handles invalid email formats', () => {
    expect(isSchoolEmailDomain('')).toBe(false);
    expect(isSchoolEmailDomain('notanemail')).toBe(false);
    expect(isSchoolEmailDomain('@')).toBe(false);
    expect(isSchoolEmailDomain('user@')).toBe(false);
  });

  it('is case-insensitive for domain', () => {
    expect(isSchoolEmailDomain('student@GREENFIELD.SCH.UK')).toBe(true);
    expect(isSchoolEmailDomain('student@School.Education')).toBe(true);
  });
});

describe('isValidEmail', () => {
  it('accepts valid email formats', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('first.last@school.sch.uk')).toBe(true);
    expect(isValidEmail('user+tag@gmail.com')).toBe(true);
    expect(isValidEmail('a@b.co')).toBe(true);
  });

  it('rejects invalid email formats', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('notanemail')).toBe(false);
    expect(isValidEmail('@missing-local.com')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('user@.com')).toBe(false);
    expect(isValidEmail('user @example.com')).toBe(false);
  });
});

describe('isStrongPassword', () => {
  it('accepts strong passwords', () => {
    expect(isStrongPassword('TestPass123!')).toEqual({ valid: true, message: '' });
    expect(isStrongPassword('Abcdefg1')).toEqual({ valid: true, message: '' });
    expect(isStrongPassword('MyStr0ngP@ss')).toEqual({ valid: true, message: '' });
  });

  it('rejects passwords shorter than 8 characters', () => {
    const result = isStrongPassword('Ab1');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('8 characters');
  });

  it('rejects passwords without uppercase', () => {
    const result = isStrongPassword('abcdefg1');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('uppercase');
  });

  it('rejects passwords without lowercase', () => {
    const result = isStrongPassword('ABCDEFG1');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('lowercase');
  });

  it('rejects passwords without numbers', () => {
    const result = isStrongPassword('Abcdefgh');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('number');
  });

  it('checks rules in priority order (length first)', () => {
    // Short + missing everything should fail on length
    const result = isStrongPassword('a');
    expect(result.message).toContain('8 characters');
  });
});

describe('isValidFullName', () => {
  it('accepts valid full names', () => {
    expect(isValidFullName('Emma Watson')).toBe(true);
    expect(isValidFullName('David Clarke')).toBe(true);
    expect(isValidFullName('Mary Jane Watson')).toBe(true);
  });

  it('rejects single names', () => {
    expect(isValidFullName('Emma')).toBe(false);
    expect(isValidFullName('X')).toBe(false);
  });

  it('rejects empty strings', () => {
    expect(isValidFullName('')).toBe(false);
    expect(isValidFullName('  ')).toBe(false);
  });

  it('handles names with extra spaces', () => {
    expect(isValidFullName('  Emma Watson  ')).toBe(true);
  });

  it('accepts names with special characters', () => {
    expect(isValidFullName("O'Brien Smith")).toBe(true);
    expect(isValidFullName('Anne-Marie Jones')).toBe(true);
  });
});
