import { describe, expect, it } from 'vitest';
import { eulReul, withEulReul } from '../utils/josa.js';

describe('eulReul', () => {
  it('picks 을 when hangul has batchim', () => {
    expect(eulReul('가이드북')).toBe('을');
    expect(withEulReul('가이드북')).toBe('가이드북을');
  });

  it('picks 를 when hangul has no batchim', () => {
    expect(eulReul('세트')).toBe('를');
    expect(withEulReul('세트')).toBe('세트를');
  });

  it('handles latin endings', () => {
    expect(eulReul('PPT')).toBe('를');
    expect(eulReul('Claude')).toBe('를');
    expect(eulReul('HTML')).toBe('을');
  });

  it('handles digit endings', () => {
    expect(eulReul('원칙 5')).toBe('를');
    expect(eulReul('프롬프트 7')).toBe('을');
  });
});
