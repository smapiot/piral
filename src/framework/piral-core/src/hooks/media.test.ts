/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import { describe, it, expect, vitest } from 'vitest';

vitest.mock('react');

(React as any).useState = (v) => [v(), vitest.fn()];

describe('Media Hook Module', () => {
  it('picks default mode if nothing else if given', async () => {
    const usedEffect = vitest.fn();
    (React as any).useEffect = usedEffect;
    window.matchMedia = vitest.fn((q) => ({ matches: false })) as any;
    const { useMedia } = await import('./media');
    const layout = useMedia(['a', 'b', 'c'], ['mobile', 'tablet', 'desktop'], 'desktop');
    const cleanup = usedEffect.mock.calls[0][0]();
    expect(layout).toBe('desktop');
    cleanup();
  });

  it('picks first role if already matches', async () => {
    const usedEffect = vitest.fn();
    (React as any).useEffect = usedEffect;
    window.matchMedia = vitest.fn((q) => ({ matches: true })) as any;
    const { useMedia } = await import('./media');
    const layout = useMedia(['a', 'b', 'c'], ['mobile', 'tablet', 'desktop'], 'desktop');
    const cleanup = usedEffect.mock.calls[0][0]();
    expect(layout).toBe('mobile');
    cleanup();
  });

  it('adds up a resize event handler on init', async () => {
    const usedEffect = vitest.fn();
    const originalAdd = window.addEventListener;
    const originalRemove = window.addEventListener;
    (React as any).useEffect = usedEffect;
    window.addEventListener = vitest.fn();
    window.removeEventListener = vitest.fn();
    window.matchMedia = vitest.fn((q) => ({ matches: true })) as any;
    const { useMedia } = await import('./media');
    useMedia(['a', 'b', 'c'], ['mobile', 'tablet', 'desktop'], 'desktop');
    expect(window.addEventListener).toHaveBeenCalledTimes(0);
    const cleanup = usedEffect.mock.calls[0][0]();
    expect(window.addEventListener).toHaveBeenCalledTimes(1);
    cleanup();
    window.addEventListener = originalAdd;
    window.removeEventListener = originalRemove;
  });

  it('cleans up a resize event handler on done', async () => {
    const usedEffect = vitest.fn();
    const originalAdd = window.addEventListener;
    const originalRemove = window.addEventListener;
    (React as any).useEffect = usedEffect;
    window.addEventListener = vitest.fn();
    window.removeEventListener = vitest.fn();
    window.matchMedia = vitest.fn((q) => ({ matches: true })) as any;
    const { useMedia } = await import('./media');
    useMedia(['a', 'b', 'c'], ['mobile', 'tablet', 'desktop'], 'desktop');
    const cleanup = usedEffect.mock.calls[0][0]();
    expect(window.removeEventListener).toHaveBeenCalledTimes(0);
    cleanup();
    expect(window.removeEventListener).toHaveBeenCalledTimes(1);
    window.addEventListener = originalAdd;
    window.removeEventListener = originalRemove;
  });

  it('resize fires the handler', async () => {
    const usedEffect = vitest.fn();
    const update = vitest.fn();
    (React as any).useState = (v) => [v(), (k) => update(k())];
    (React as any).useEffect = usedEffect;
    let matcher = (q) => ({ matches: true });
    window.matchMedia = vitest.fn((q) => matcher(q)) as any;
    const { useMedia } = await import('./media');
    const layout = useMedia(['a', 'b', 'c'], ['mobile', 'tablet', 'desktop'], 'desktop');
    const cleanup = usedEffect.mock.calls[0][0]();
    const event = new Event('resize', { bubbles: true });
    matcher = (q) => ({ matches: q === 'b' });
    window.dispatchEvent(event);
    expect(layout).toBe('mobile');
    expect(update).toHaveBeenCalledWith('tablet');
    cleanup();
  });
});
