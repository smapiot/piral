import * as React from 'react';
import { useLockBodyScroll } from './lockBodyScroll';

jest.mock('react');

describe('LockBodyScroll Hook Module', () => {
  it('sets the body overflow to hidden on being initiated', () => {
    const usedEffect = jest.fn();
    (React as any).useLayoutEffect = usedEffect;
    useLockBodyScroll();
    expect(usedEffect).toHaveBeenCalled();
    usedEffect.mock.calls[0][0]();
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('sets the body overflow to visible on cleanup', () => {
    const usedEffect = jest.fn();
    (React as any).useLayoutEffect = usedEffect;
    useLockBodyScroll();
    const cleanup = usedEffect.mock.calls[0][0]();
    cleanup();
    expect(document.body.style.overflow).toBe('visible');
  });
});
