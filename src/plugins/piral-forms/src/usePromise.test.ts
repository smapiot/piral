/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import { describe, it, expect, vitest } from 'vitest';
import { usePromise } from './usePromise';

vitest.mock('react');

describe('Promise Module', () => {
  it('directly reports loading', () => {
    const usedEffect = vitest.fn();
    const setState = vitest.fn();
    (React as any).useEffect = usedEffect;
    (React as any).useState = (current) => [current, setState];
    const result = usePromise(() => Promise.resolve());
    expect(result).toEqual({
      loading: true,
      data: undefined,
      error: undefined,
    });
  });

  it('reports loading after the effect is done', () => {
    const usedEffect = vitest.fn((fn) => fn());
    const setState = vitest.fn();
    (React as any).useEffect = usedEffect;
    (React as any).useState = (current) => [current, setState];
    const result = usePromise(() => Promise.resolve());
    expect(result).toEqual({
      loading: true,
      data: undefined,
      error: undefined,
    });
  });

  it('reports done when the loading finished', async () => {
    const usedEffect = vitest.fn((fn) => fn());
    const setState = vitest.fn();
    (React as any).useEffect = usedEffect;
    (React as any).useState = (current) => [current, setState];
    usePromise(() => Promise.resolve('123'));
    await Promise.resolve();
    expect(setState.mock.calls.length).toBe(1);
    expect(setState.mock.calls[0]).toEqual([
      {
        loading: false,
        data: '123',
        error: undefined,
      },
    ]);
  });

  it('reports error when the loading finished', async () => {
    const usedEffect = vitest.fn((fn) => fn());
    const setState = vitest.fn();
    (React as any).useEffect = usedEffect;
    (React as any).useState = (current) => [current, setState];
    usePromise(() => Promise.reject('123'));
    await Promise.resolve();
    expect(setState.mock.calls.length).toBe(1);
    expect(setState.mock.calls[0]).toEqual([
      {
        loading: false,
        data: undefined,
        error: '123',
      },
    ]);
  });

  it('does not set the state on cancel', async () => {
    const usedEffect = vitest.fn((fn) => fn()());
    const setState = vitest.fn();
    (React as any).useEffect = usedEffect;
    (React as any).useState = (current) => [current, setState];
    usePromise(() => Promise.reject('123'));
    await Promise.resolve();
    expect(setState.mock.calls.length).toBe(0);
  });
});
