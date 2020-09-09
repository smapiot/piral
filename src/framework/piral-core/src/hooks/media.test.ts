import * as React from 'react';
import { useMedia } from './media';

jest.mock('react');

(React as any).useState = (v) => [v(), jest.fn()];

describe('Media Hook Module', () => {
  it('picks default mode if nothing else if given', () => {
    const usedEffect = jest.fn();
    (React as any).useEffect = usedEffect;
    window.matchMedia = jest.fn((q) => ({ matches: false })) as any;
    const layout = useMedia(['a', 'b', 'c'], ['mobile', 'tablet', 'desktop'], 'desktop');
    const cleanup = usedEffect.mock.calls[0][0]();
    expect(layout).toBe('desktop');
    cleanup();
  });

  it('picks first role if already matches', () => {
    const usedEffect = jest.fn();
    (React as any).useEffect = usedEffect;
    window.matchMedia = jest.fn((q) => ({ matches: true })) as any;
    const layout = useMedia(['a', 'b', 'c'], ['mobile', 'tablet', 'desktop'], 'desktop');
    const cleanup = usedEffect.mock.calls[0][0]();
    expect(layout).toBe('mobile');
    cleanup();
  });

  it('adds up a resize event handler on init', () => {
    const usedEffect = jest.fn();
    const originalAdd = window.addEventListener;
    const originalRemove = window.addEventListener;
    (React as any).useEffect = usedEffect;
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();
    window.matchMedia = jest.fn((q) => ({ matches: true })) as any;
    useMedia(['a', 'b', 'c'], ['mobile', 'tablet', 'desktop'], 'desktop');
    expect(window.addEventListener).toHaveBeenCalledTimes(0);
    const cleanup = usedEffect.mock.calls[0][0]();
    expect(window.addEventListener).toHaveBeenCalledTimes(1);
    cleanup();
    window.addEventListener = originalAdd;
    window.removeEventListener = originalRemove;
  });

  it('cleans up a resize event handler on done', () => {
    const usedEffect = jest.fn();
    const originalAdd = window.addEventListener;
    const originalRemove = window.addEventListener;
    (React as any).useEffect = usedEffect;
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();
    window.matchMedia = jest.fn((q) => ({ matches: true })) as any;
    useMedia(['a', 'b', 'c'], ['mobile', 'tablet', 'desktop'], 'desktop');
    const cleanup = usedEffect.mock.calls[0][0]();
    expect(window.removeEventListener).toHaveBeenCalledTimes(0);
    cleanup();
    expect(window.removeEventListener).toHaveBeenCalledTimes(1);
    window.addEventListener = originalAdd;
    window.removeEventListener = originalRemove;
  });

  it('resize fires the handler', () => {
    const usedEffect = jest.fn();
    const update = jest.fn();
    (React as any).useState = (v) => [v(), (k) => update(k())];
    (React as any).useEffect = usedEffect;
    let matcher = (q) => ({ matches: true });
    window.matchMedia = jest.fn((q) => matcher(q)) as any;
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
