import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const key = process.env.DOB_ENCRYPTION_KEY;
  if (!key) throw new Error('DOB_ENCRYPTION_KEY is not configured');
  return Buffer.from(key, 'hex');
}

/** Encrypt a date of birth string. Returns base64 encoded: iv:authTag:ciphertext */
export function encryptDOB(dateOfBirth: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(dateOfBirth, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const authTag = cipher.getAuthTag();

  return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
}

/** Decrypt an encrypted date of birth string. */
export function decryptDOB(encrypted: string): string {
  const key = getEncryptionKey();
  const parts = encrypted.split(':');
  if (parts.length !== 3) throw new Error('Invalid encrypted data format');

  const iv = Buffer.from(parts[0], 'base64');
  const authTag = Buffer.from(parts[1], 'base64');
  const ciphertext = parts[2];

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(ciphertext, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/** Calculate age from a date of birth string (YYYY-MM-DD). */
export function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

/** Calculate days until a date of birth reaches a target age. */
export function daysUntilAge(dateOfBirth: string, targetAge: number): number {
  const dob = new Date(dateOfBirth);
  const targetDate = new Date(dob);
  targetDate.setFullYear(dob.getFullYear() + targetAge);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const diff = targetDate.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
