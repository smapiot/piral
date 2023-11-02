/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest';
import { getCurrentLayout } from './media';

describe('Media Module', () => {
  it('in here window should be undefined', () => {
    expect(typeof window).toBe('undefined');
    const breakpoints = ['min-width: 200px', 'max-width: 199px'];
    const result = getCurrentLayout(breakpoints, ['foo', 'bar'], 'qxz');
    expect(result).toBe('qxz');
  });
});
