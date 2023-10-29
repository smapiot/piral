/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import { describe, it, expect, vitest } from 'vitest';

const state = {
  search: {
    input: 'abc',
  },
  components: {
    searchProviders: {},
  },
};

const availableActions = {
  setSearchInput: vitest.fn(),
  triggerSearch: vitest.fn(),
};

const useGlobalState = vitest.fn((select: any) => select(state));
const useActions = vitest.fn(() => availableActions);
const useDebounce = vitest.fn((value) => value);

vitest.mock('piral-core', async () => ({
  ...(await vitest.importActual('piral-core') as any),
  useGlobalState,
  useActions,
}));

vitest.mock('./useDebounce.ts', () => ({
  useDebounce,
}));

vitest.mock('react');

describe('Search Hook Module', () => {
  it('just returns current input value', async () => {
    const { useSearch } = await import('./useSearch');
    const usedEffect = vitest.fn();
    (React as any).useEffect = usedEffect;
    (React as any).useRef = (current) => ({ current });
    const [value] = useSearch();
    expect(value).toBe('abc');
  });

  it('sets the value using the action', async () => {
    const { useSearch } = await import('./useSearch');
    const usedEffect = vitest.fn();
    (React as any).useEffect = usedEffect;
    (React as any).useRef = (current) => ({ current });
    (React as any).useState = (initial) => [initial, vitest.fn()];
    const [_, setValue] = useSearch();
    setValue('foo');
    expect(availableActions.setSearchInput).toHaveBeenCalledWith('foo');
  });

  it('triggers the search without immediate mode', async () => {
    const { useSearch } = await import('./useSearch');
    const usedEffect = vitest.fn((fn) => fn());
    (React as any).useEffect = usedEffect;
    (React as any).useRef = (current) => ({ current });
    (React as any).useState = (initial) => [initial, vitest.fn()];
    useSearch();
    expect(availableActions.triggerSearch).toHaveBeenCalledWith('abc', false);
  });

  it('cancels the current search', async () => {
    const { useSearch } = await import('./useSearch');
    const usedEffect = vitest.fn((fn) => fn());
    const cancel = vitest.fn();
    (React as any).useEffect = usedEffect;
    (React as any).useRef = (_) => ({ current: cancel });
    (React as any).useState = (initial) => [initial, vitest.fn()];
    useSearch();
    expect(cancel).toHaveBeenCalledTimes(1);
  });
});
