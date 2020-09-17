import * as React from 'react';
import { useOnScreenVisible } from './onScreenVisible';

jest.mock('react');

(React as any).useState = (result) => [result, jest.fn()];

function mockIntersectionObserver() {
  const instances = [];
  (window as any).IntersectionObserver = class {
    constructor(cb, margin) {
      instances.push(this);
      this.init(cb, margin);
    }
    init = jest.fn();
    observe = jest.fn();
    unobserve = jest.fn();
  };
  return instances;
}

describe('OnScreenVisible Module', () => {
  it('is not intersecting by default', () => {
    const result = useOnScreenVisible({ current: undefined });
    expect(result).toBeFalsy();
  });

  it('creates one intersection observer with effect', () => {
    const usedEffect = jest.fn();
    (React as any).useEffect = usedEffect;
    const instances = mockIntersectionObserver();
    useOnScreenVisible({ current: undefined });
    const cleanup = usedEffect.mock.calls[0][0]();
    expect(instances.length).toBe(1);
    cleanup();
  });

  it('does not observe if no ref given', () => {
    const usedEffect = jest.fn();
    (React as any).useEffect = usedEffect;
    const instances = mockIntersectionObserver();
    useOnScreenVisible({ current: undefined });
    const cleanup = usedEffect.mock.calls[0][0]();
    expect(instances[0].observe).toHaveBeenCalledTimes(0);
    cleanup();
  });

  it('does observe if valid ref given', () => {
    const usedEffect = jest.fn();
    (React as any).useEffect = usedEffect;
    const instances = mockIntersectionObserver();
    useOnScreenVisible({ current: {} as any });
    const cleanup = usedEffect.mock.calls[0][0]();
    expect(instances[0].observe).toHaveBeenCalledTimes(1);
    cleanup();
  });

  it('calls setIntersecting if something changes', () => {
    const usedEffect = jest.fn();
    (React as any).useEffect = usedEffect;
    const instances = mockIntersectionObserver();
    useOnScreenVisible({ current: {} as any });
    const cleanup = usedEffect.mock.calls[0][0]();
    instances[0].init.mock.calls[0][0]([{ isIntersecting: true }]);
    cleanup();
    expect(instances[0].unobserve).toHaveBeenCalledTimes(1);
  });
});
