/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import { describe, it, expect, vitest } from 'vitest';
import { useLockBodyScroll } from './lockBodyScroll';

vitest.mock('react');

describe('LockBodyScroll Hook Module', () => {
  it('sets the body overflow to hidden on being initiated', () => {
    const usedEffect = vitest.fn();
    (React as any).useLayoutEffect = usedEffect;
    useLockBodyScroll();
    expect(usedEffect).toHaveBeenCalled();
    usedEffect.mock.calls[0][0]();
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('sets the body overflow to visible on cleanup', () => {
    const usedEffect = vitest.fn();
    (React as any).useLayoutEffect = usedEffect;
    useLockBodyScroll();
    const cleanup = usedEffect.mock.calls[0][0]();
    cleanup();
    expect(document.body.style.overflow).toBe('visible');
  });
});
