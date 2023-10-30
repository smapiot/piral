/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import { describe, it, expect, vitest, beforeEach } from 'vitest';

const useGlobalState = vitest.fn();
const loadAction = vitest.fn();
const useAction = vitest.fn(() => loadAction);

vitest.mock('piral-core', async () => ({
  ...((await vitest.importActual('piral-core')) as any),
  useGlobalState,
  useAction,
}));

vitest.mock('react');

const testOptions = {
  timeout: 30000,
};

describe('Feed Hook Module', () => {
  beforeEach(() => {
    loadAction.mockReset();
  });

  it(
    'Does not load if its already loaded',
    async () => {
      const { useFeed } = await import('./useFeed');
      const pseudoState = {
        feeds: {
          foo: {
            loaded: true,
            loading: false,
            error: undefined,
            data: [1, 2, 3],
          },
        },
      };
      const usedEffect = vitest.fn();
      useGlobalState.mockImplementation((select: any) => select(pseudoState));

      (React as any).useEffect = usedEffect;
      const [loaded, data, error] = useFeed({
        id: 'foo',
      } as any);
      usedEffect.mock.calls[0][0]();
      expect(loaded).toBeTruthy();
      expect(data).toEqual([1, 2, 3]);
      expect(error).toBeUndefined();
      expect(loadAction).not.toBeCalled();
    },
    testOptions,
  );

  it(
    'Does not load if its already loading',
    async () => {
      const { useFeed } = await import('./useFeed');
      const pseudoState = {
        feeds: {
          foo: {
            loaded: false,
            loading: true,
            error: undefined,
            data: undefined,
          },
        },
      };
      const usedEffect = vitest.fn();
      useGlobalState.mockImplementation((select: any) => select(pseudoState));

      (React as any).useEffect = usedEffect;
      const [loaded, data, error] = useFeed({
        id: 'foo',
      } as any);
      usedEffect.mock.calls[0][0]();
      expect(loaded).toBeFalsy();
      expect(data).toBeUndefined();
      expect(error).toBeUndefined();
      expect(loadAction).not.toBeCalled();
    },
    testOptions,
  );

  it(
    'Triggers load if its not loading',
    async () => {
      const { useFeed } = await import('./useFeed');
      const pseudoState = {
        feeds: {
          foo: {
            loaded: false,
            loading: false,
            error: undefined,
            data: undefined,
          },
        },
      };
      const usedEffect = vitest.fn();
      useGlobalState.mockImplementation((select: any) => select(pseudoState));

      (React as any).useEffect = usedEffect;
      const [loaded, data, error] = useFeed({
        id: 'foo',
      } as any);
      usedEffect.mock.calls[0][0]();
      expect(loaded).toBeFalsy();
      expect(data).toBeUndefined();
      expect(error).toBeUndefined();
      expect(loadAction).toBeCalled();
    },
    testOptions,
  );
});
