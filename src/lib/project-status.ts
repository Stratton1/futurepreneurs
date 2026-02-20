import type { ProjectStatus } from '@/types/database';

/** Can the student edit this project? Only in draft status. */
export function canEdit(status: ProjectStatus): boolean {
  return status === 'draft';
}

/** Can the student submit this project for teacher verification? */
export function canSubmitForVerification(status: ProjectStatus): boolean {
  return status === 'draft';
}

/** Can the teacher verify/approve this project? */
export function canVerify(status: ProjectStatus): boolean {
  return status === 'pending_verification';
}

/** Can the parent give consent for this project? */
export function canConsent(status: ProjectStatus): boolean {
  return status === 'pending_consent';
}

/** Is this project visible to the public? */
export function isPubliclyVisible(status: ProjectStatus): boolean {
  return status === 'live' || status === 'funded' || status === 'completed';
}

/** Can backers fund this project? */
export function canFund(status: ProjectStatus): boolean {
  return status === 'live';
}

/** Can the student request drawdowns? */
export function canRequestDrawdown(status: ProjectStatus): boolean {
  return status === 'funded';
}

/** Get the next status after teacher approval */
export function getStatusAfterVerification(): ProjectStatus {
  return 'pending_consent';
}

/** Get the next status after parental consent */
export function getStatusAfterConsent(): ProjectStatus {
  return 'live';
}

/** Get status when teacher requests changes */
export function getStatusOnChangesRequested(): ProjectStatus {
  return 'draft';
}
