/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import { describe, it, expect, vitest } from 'vitest';
import { useDebounce } from './useDebounce';

vitest.mock('react');

describe('Debounce Hook Module', () => {
  it('just returns initial value if nothing has been changed', () => {
    const usedEffect = vitest.fn();
    const usedState = vitest.fn((value) => [value]);
    (React as any).useState = usedState;
    (React as any).useEffect = usedEffect;
    const result = useDebounce('foo');
    expect(usedEffect).toHaveBeenCalled();
    expect(usedState).toHaveBeenCalled();
    expect(result).toBe('foo');
  });

  it('invokes useEffect immediately, but does not set value immediately', () => {
    const usedEffect = vitest.fn((fn) => fn());
    const setValue = vitest.fn();
    const usedState = vitest.fn((value) => [value, setValue]);
    (React as any).useState = usedState;
    (React as any).useEffect = usedEffect;
    useDebounce('foo');
    expect(setValue).not.toHaveBeenCalled();
  });

  it('invokes useEffect immediately, but sets value immediately if 0', () => {
    vitest.useFakeTimers();
    const usedEffect = vitest.fn((fn) => fn());
    const setValue = vitest.fn();
    const usedState = vitest.fn((value) => [value, setValue]);
    (React as any).useState = usedState;
    (React as any).useEffect = usedEffect;
    useDebounce('foo', 0);
    vitest.advanceTimersByTime(0);
    expect(setValue).toHaveBeenCalled();
  });

  it('invokes useEffect immediately, but sets value after wait time', () => {
    vitest.useFakeTimers();
    const usedEffect = vitest.fn((fn) => fn());
    const setValue = vitest.fn();
    const usedState = vitest.fn((value) => [value, setValue]);
    (React as any).useState = usedState;
    (React as any).useEffect = usedEffect;
    expect(setValue).not.toHaveBeenCalled();
    useDebounce('foo', 300);
    vitest.advanceTimersByTime(300);
    expect(setValue).toHaveBeenCalled();
  });

  it('invokes useEffect immediately and resets timer if needed', () => {
    vitest.useFakeTimers();
    const usedEffect = vitest.fn((fn) => fn());
    const setValue = vitest.fn();
    const usedState = vitest.fn((value) => [value, setValue]);
    (React as any).useState = usedState;
    (React as any).useEffect = usedEffect;
    expect(setValue).not.toHaveBeenCalled();
    useDebounce('foo', 300);
    vitest.advanceTimersByTime(250);
    usedEffect.mock.results[0].value();
    vitest.advanceTimersByTime(50);
    expect(setValue).not.toHaveBeenCalled();
  });
});
