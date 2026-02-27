import { describe, it, expect } from 'vitest';
import { scrubPII, isContentSafe, processContent } from '@/lib/ai/content-moderation';

describe('scrubPII', () => {
  describe('email addresses', () => {
    it('removes email addresses', () => {
      expect(scrubPII('Contact me at emma@greenfield.sch.uk for details')).toBe(
        'Contact me at [email removed] for details'
      );
    });

    it('removes multiple emails', () => {
      const result = scrubPII('Email alice@test.com or bob@school.sch.uk');
      expect(result).not.toContain('@');
      expect(result).toContain('[email removed]');
    });
  });

  describe('UK phone numbers', () => {
    it('removes mobile numbers', () => {
      expect(scrubPII('Call me on 07700 900123')).toContain('[phone removed]');
    });

    it('removes landline numbers', () => {
      expect(scrubPII('Office: 0161 234 5678')).toContain('[phone removed]');
    });

    it('removes +44 format numbers', () => {
      expect(scrubPII('My number is +44 7700 123456')).toContain('[phone removed]');
    });
  });

  describe('UK postcodes', () => {
    it('removes standard postcodes', () => {
      expect(scrubPII('Located in M1 1AA area')).toContain('[postcode removed]');
    });

    it('removes various postcode formats', () => {
      expect(scrubPII('We are at SW1A 1AA')).toContain('[postcode removed]');
      expect(scrubPII('Postcode: EC1A 1BB')).toContain('[postcode removed]');
    });
  });

  describe('street addresses', () => {
    it('removes numbered street addresses', () => {
      expect(scrubPII('Located at 42 Baker Street, London')).toContain('[address removed]');
    });

    it('handles various road types', () => {
      expect(scrubPII('Visit us at 10 High Road')).toContain('[address removed]');
      expect(scrubPII('Our office is at 5 Park Avenue')).toContain('[address removed]');
    });
  });

  describe('NI numbers', () => {
    it('removes National Insurance numbers', () => {
      expect(scrubPII('My NI number is AB 12 34 56 C')).toContain('[NI number removed]');
    });
  });

  describe('clean text', () => {
    it('leaves text without PII unchanged', () => {
      const clean = 'I want to start a candle-making business selling eco-friendly products.';
      expect(scrubPII(clean)).toBe(clean);
    });
  });
});

describe('isContentSafe', () => {
  it('approves clean content', () => {
    expect(isContentSafe('I want to start a business selling handmade candles')).toEqual({
      safe: true,
    });
  });

  it('blocks violent content', () => {
    const result = isContentSafe('This is about weapons and how to attack people');
    expect(result.safe).toBe(false);
    expect(result.reason).toContain('inappropriate');
  });

  it('blocks drug-related content', () => {
    expect(isContentSafe('We sell marijuana products')).toEqual(
      expect.objectContaining({ safe: false })
    );
  });

  it('blocks adult content', () => {
    expect(isContentSafe('Visit my onlyfans page')).toEqual(
      expect.objectContaining({ safe: false })
    );
  });

  it('blocks scam-related content', () => {
    expect(isContentSafe('This is a pyramid scheme opportunity')).toEqual(
      expect.objectContaining({ safe: false })
    );
  });

  it('blocks gambling content', () => {
    expect(isContentSafe('Start your own casino business')).toEqual(
      expect.objectContaining({ safe: false })
    );
  });

  it('is case-insensitive', () => {
    expect(isContentSafe('GAMBLING is my passion')).toEqual(
      expect.objectContaining({ safe: false })
    );
  });

  it('detects blocked words within sentences', () => {
    expect(isContentSafe('I love to gamble at the casino every weekend')).toEqual(
      expect.objectContaining({ safe: false })
    );
  });
});

describe('processContent', () => {
  it('scrubs PII and checks safety in one pass', () => {
    const result = processContent(
      'My business plan by emma@school.sch.uk - making eco candles'
    );
    expect(result.cleaned).toContain('[email removed]');
    expect(result.cleaned).not.toContain('emma@');
    expect(result.safe).toBe(true);
  });

  it('blocks unsafe content even after PII scrubbing', () => {
    const result = processContent(
      'Contact me at test@email.com about my gambling business'
    );
    expect(result.cleaned).toContain('[email removed]');
    expect(result.safe).toBe(false);
  });

  it('passes clean content through unchanged', () => {
    const text = 'I want to sell handmade jewellery at school fairs.';
    const result = processContent(text);
    expect(result.cleaned).toBe(text);
    expect(result.safe).toBe(true);
  });
});
