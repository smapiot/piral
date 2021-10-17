import * as React from 'react';

const state = {
  search: {
    input: 'abc',
  },
  components: {
    searchProviders: {},
  },
};

const availableActions = {
  setSearchInput: jest.fn(),
  triggerSearch: jest.fn(),
};

const useGlobalState = jest.fn((select: any) => select(state));
const useActions = jest.fn(() => availableActions);
const useDebounce = jest.fn((value) => value);

jest.mock('piral-core', () => ({
  ...jest.requireActual('piral-core'),
  useGlobalState,
  useActions,
}));

jest.mock('./useDebounce.ts', () => ({
  useDebounce,
}));

describe('Search Hook Module', () => {
  it('just returns current input value', () => {
    const { useSearch } = require('./useSearch');
    const usedEffect = jest.fn();
    (React as any).useEffect = usedEffect;
    (React as any).useRef = (current) => ({ current });
    const [value] = useSearch();
    expect(value).toBe('abc');
  });

  it('sets the value using the action', () => {
    const { useSearch } = require('./useSearch');
    const usedEffect = jest.fn();
    (React as any).useEffect = usedEffect;
    (React as any).useRef = (current) => ({ current });
    (React as any).useState = (initial) => [initial, jest.fn()];
    const [_, setValue] = useSearch();
    setValue('foo');
    expect(availableActions.setSearchInput).toHaveBeenCalledWith('foo');
  });

  it('triggers the search without immediate mode', () => {
    const { useSearch } = require('./useSearch');
    const usedEffect = jest.fn((fn) => fn());
    (React as any).useEffect = usedEffect;
    (React as any).useRef = (current) => ({ current });
    (React as any).useState = (initial) => [initial, jest.fn()];
    useSearch();
    expect(availableActions.triggerSearch).toHaveBeenCalledWith('abc', false);
  });

  it('cancels the current search', () => {
    const { useSearch } = require('./useSearch');
    const usedEffect = jest.fn((fn) => fn());
    const cancel = jest.fn();
    (React as any).useEffect = usedEffect;
    (React as any).useRef = (_) => ({ current: cancel });
    (React as any).useState = (initial) => [initial, jest.fn()];
    useSearch();
    expect(cancel).toHaveBeenCalledTimes(1);
  });
});
