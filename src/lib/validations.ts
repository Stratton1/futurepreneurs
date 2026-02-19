import { SCHOOL_EMAIL_SUFFIXES } from './constants';

/**
 * Check if an email domain matches a known school email pattern.
 * This is the first layer of validation — the second layer checks against
 * registered school domains in the database.
 */
export function isSchoolEmailDomain(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;

  return SCHOOL_EMAIL_SUFFIXES.some((suffix) => domain.endsWith(suffix));
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * At least 8 characters, 1 uppercase, 1 lowercase, 1 number
 */
export function isStrongPassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  return { valid: true, message: '' };
}

/**
 * Validate full name (at least first and last name)
 */
export function isValidFullName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.includes(' ');
}
