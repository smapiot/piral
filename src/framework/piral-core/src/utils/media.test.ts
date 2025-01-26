/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vitest } from 'vitest';

describe('Media Module', () => {
  it('getCurrentLayout correctly takes matched first layout', async () => {
    const breakpoints = ['min-width: 200px', 'max-width: 199px'];
    window.matchMedia = vitest.fn((q) => ({ matches: q === breakpoints[0] })) as any;
    const { getCurrentLayout } = await import('./media');
    const result = getCurrentLayout(breakpoints, ['foo', 'bar'], 'foo');
    expect(window.matchMedia).toHaveBeenCalledTimes(1);
    expect(result).toBe('foo');
  });

  it('getCurrentLayout correctly takes matched second layout', async () => {
    const breakpoints = ['min-width: 200px', 'max-width: 199px'];
    window.matchMedia = vitest.fn((q) => ({ matches: q === breakpoints[1] } as any));
    const { getCurrentLayout } = await import('./media');
    const result = getCurrentLayout(breakpoints, ['foo', 'bar'], 'foo');
    expect(window.matchMedia).toHaveBeenCalledTimes(2);
    expect(result).toBe('bar');
  });

  it('getCurrentLayout uses default layout if nothing matches', async () => {
    const breakpoints = ['min-width: 200px', 'max-width: 199px'];
    window.matchMedia = vitest.fn((q) => ({ matches: false })) as any;
    const { getCurrentLayout } = await import('./media');
    const result = getCurrentLayout(breakpoints, ['foo', 'bar'], 'foo');
    expect(window.matchMedia).toHaveBeenCalledTimes(2);
    expect(result).toBe('foo');
  });

  it('getCurrentLayout uses default layout which not be a given layoput', async () => {
    const breakpoints = ['min-width: 200px', 'max-width: 199px'];
    window.matchMedia = vitest.fn((q) => ({ matches: false })) as any;
    const { getCurrentLayout } = await import('./media');
    const result = getCurrentLayout(breakpoints, ['foo', 'bar'], 'qxz');
    expect(window.matchMedia).toHaveBeenCalledTimes(2);
    expect(result).toBe('qxz');
  });

  it('getCurrentLayout uses default layout if no breakpoint given', async () => {
    window.matchMedia = vitest.fn((q) => ({ matches: true })) as any;
    const { getCurrentLayout } = await import('./media');
    const result = getCurrentLayout([], ['foo', 'bar'], 'qxz');
    expect(window.matchMedia).toHaveBeenCalledTimes(0);
    expect(result).toBe('qxz');
  });
});
