import * as React from 'react';
import { useDebounce } from './debounce';

jest.mock('react');

describe('Debounce Hook Module', () => {
  it('just returns initial value if nothing has been changed', () => {
    const usedEffect = jest.fn();
    const usedState = jest.fn((value) => [value]);
    (React as any).useState = usedState;
    (React as any).useEffect = usedEffect;
    const result = useDebounce('foo');
    expect(usedEffect).toHaveBeenCalled();
    expect(usedState).toHaveBeenCalled();
    expect(result).toBe('foo');
  });

  it('invokes useEffect immediately, but does not set value immediately', () => {
    const usedEffect = jest.fn((fn) => fn());
    const setValue = jest.fn();
    const usedState = jest.fn((value) => [value, setValue]);
    (React as any).useState = usedState;
    (React as any).useEffect = usedEffect;
    useDebounce('foo');
    expect(setValue).not.toHaveBeenCalled();
  });

  it('invokes useEffect immediately, but sets value immediately if 0', () => {
    jest.useFakeTimers();
    const usedEffect = jest.fn((fn) => fn());
    const setValue = jest.fn();
    const usedState = jest.fn((value) => [value, setValue]);
    (React as any).useState = usedState;
    (React as any).useEffect = usedEffect;
    useDebounce('foo', 0);
    jest.advanceTimersByTime(0);
    expect(setValue).toHaveBeenCalled();
  });

  it('invokes useEffect immediately, but sets value after wait time', () => {
    jest.useFakeTimers();
    const usedEffect = jest.fn((fn) => fn());
    const setValue = jest.fn();
    const usedState = jest.fn((value) => [value, setValue]);
    (React as any).useState = usedState;
    (React as any).useEffect = usedEffect;
    expect(setValue).not.toHaveBeenCalled();
    useDebounce('foo', 300);
    jest.advanceTimersByTime(300);
    expect(setValue).toHaveBeenCalled();
  });

  it('invokes useEffect immediately and resets timer if needed', () => {
    jest.useFakeTimers();
    const usedEffect = jest.fn((fn) => fn());
    const setValue = jest.fn();
    const usedState = jest.fn((value) => [value, setValue]);
    (React as any).useState = usedState;
    (React as any).useEffect = usedEffect;
    expect(setValue).not.toHaveBeenCalled();
    useDebounce('foo', 300);
    jest.advanceTimersByTime(250);
    usedEffect.mock.results[0].value();
    jest.advanceTimersByTime(50);
    expect(setValue).not.toHaveBeenCalled();
  });
});
