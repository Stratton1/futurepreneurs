import { describe, it, expect } from 'vitest';
import {
  canEdit,
  canSubmitForVerification,
  canVerify,
  canConsent,
  isPubliclyVisible,
  canFund,
  canRequestDrawdown,
  getStatusAfterVerification,
  getStatusAfterConsent,
  getStatusOnChangesRequested,
} from '@/lib/project-status';
import type { ProjectStatus } from '@/types/database';

const ALL_STATUSES: ProjectStatus[] = [
  'draft',
  'pending_verification',
  'pending_consent',
  'live',
  'funded',
  'completed',
];

describe('canEdit', () => {
  it('allows editing only in draft status', () => {
    expect(canEdit('draft')).toBe(true);
    expect(canEdit('pending_verification')).toBe(false);
    expect(canEdit('pending_consent')).toBe(false);
    expect(canEdit('live')).toBe(false);
    expect(canEdit('funded')).toBe(false);
    expect(canEdit('completed')).toBe(false);
  });
});

describe('canSubmitForVerification', () => {
  it('allows submission only in draft status', () => {
    expect(canSubmitForVerification('draft')).toBe(true);
    for (const status of ALL_STATUSES.filter((s) => s !== 'draft')) {
      expect(canSubmitForVerification(status)).toBe(false);
    }
  });
});

describe('canVerify', () => {
  it('allows verification only in pending_verification status', () => {
    expect(canVerify('pending_verification')).toBe(true);
    for (const status of ALL_STATUSES.filter((s) => s !== 'pending_verification')) {
      expect(canVerify(status)).toBe(false);
    }
  });
});

describe('canConsent', () => {
  it('allows consent only in pending_consent status', () => {
    expect(canConsent('pending_consent')).toBe(true);
    for (const status of ALL_STATUSES.filter((s) => s !== 'pending_consent')) {
      expect(canConsent(status)).toBe(false);
    }
  });
});

describe('isPubliclyVisible', () => {
  it('shows live, funded, and completed projects publicly', () => {
    expect(isPubliclyVisible('live')).toBe(true);
    expect(isPubliclyVisible('funded')).toBe(true);
    expect(isPubliclyVisible('completed')).toBe(true);
  });

  it('hides draft and pending projects from public', () => {
    expect(isPubliclyVisible('draft')).toBe(false);
    expect(isPubliclyVisible('pending_verification')).toBe(false);
    expect(isPubliclyVisible('pending_consent')).toBe(false);
  });
});

describe('canFund', () => {
  it('allows funding only for live projects', () => {
    expect(canFund('live')).toBe(true);
    for (const status of ALL_STATUSES.filter((s) => s !== 'live')) {
      expect(canFund(status)).toBe(false);
    }
  });
});

describe('canRequestDrawdown', () => {
  it('allows drawdown requests only for funded projects', () => {
    expect(canRequestDrawdown('funded')).toBe(true);
    for (const status of ALL_STATUSES.filter((s) => s !== 'funded')) {
      expect(canRequestDrawdown(status)).toBe(false);
    }
  });
});

describe('status transitions', () => {
  it('moves to pending_consent after verification', () => {
    expect(getStatusAfterVerification()).toBe('pending_consent');
  });

  it('moves to live after consent', () => {
    expect(getStatusAfterConsent()).toBe('live');
  });

  it('moves back to draft on changes requested', () => {
    expect(getStatusOnChangesRequested()).toBe('draft');
  });

  it('follows the complete happy path state machine', () => {
    // draft → submit → pending_verification → verify → pending_consent → consent → live
    let status: ProjectStatus = 'draft';
    expect(canSubmitForVerification(status)).toBe(true);

    status = 'pending_verification';
    expect(canVerify(status)).toBe(true);

    status = getStatusAfterVerification();
    expect(status).toBe('pending_consent');
    expect(canConsent(status)).toBe(true);

    status = getStatusAfterConsent();
    expect(status).toBe('live');
    expect(canFund(status)).toBe(true);
    expect(isPubliclyVisible(status)).toBe(true);
  });
});
