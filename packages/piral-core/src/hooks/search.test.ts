import * as React from 'react';
import * as globalState from './globalState';
import * as debounce from './debounce';
import * as actions from './actions';
import { useSearch } from './search';

jest.mock('react');

const state = {
  search: {
    input: 'abc',
  },
  components: {
    searchProviders: {},
  },
};

(globalState as any).useGlobalState = (select: any) => select(state);

(debounce as any).useDebounce = value => value;

const availableActions = {
  setSearchInput: jest.fn(),
  resetSearchResults: jest.fn(),
  appendSearchResults: jest.fn(),
};

(actions as any).useActions = () => availableActions;

describe('Search Module', () => {
  it('just returns current input value', () => {
    const usedEffect = jest.fn();
    (React as any).useEffect = usedEffect;
    const [value] = useSearch();
    expect(value).toBe('abc');
  });

  it('sets the value using the action', () => {
    const usedEffect = jest.fn();
    (React as any).useEffect = usedEffect;
    const [_, setValue] = useSearch();
    setValue('foo');
    expect(availableActions.setSearchInput).toHaveBeenCalledWith('foo');
  });

  it('immediately resets with loading true if some value is given', () => {
    state.search.input = 'foo';
    const usedEffect = jest.fn(fn => fn());
    (React as any).useEffect = usedEffect;
    useSearch();
    expect(availableActions.resetSearchResults).toHaveBeenCalledWith(true);
  });

  it('immediately resets with loading false if no value is given', () => {
    state.search.input = '';
    const usedEffect = jest.fn(fn => fn());
    (React as any).useEffect = usedEffect;
    useSearch();
    expect(availableActions.resetSearchResults).toHaveBeenCalledWith(false);
  });

  it('walks over all search providers', () => {
    const search = jest.fn(() => Promise.resolve([]));
    state.search.input = 'test';
    state.components.searchProviders = {
      foo: { search },
      bar: { search },
    };
    const usedEffect = jest.fn(fn => fn());
    (React as any).useEffect = usedEffect;
    useSearch();
    expect(search).toHaveBeenCalledTimes(2);
  });

  it('wraps results', async () => {
    state.search.input = 'test';
    state.components.searchProviders = {
      foo: {
        search() {
          return Promise.resolve(['Hello', 'World']);
        },
      },
    };
    const usedEffect = jest.fn(fn => fn());
    (React as any).useEffect = usedEffect;
    useSearch();
    await (state.components.searchProviders as any).foo.search().catch(m => m);
  });

  it('catches any emitted exceptions', async () => {
    console.warn = jest.fn();
    state.search.input = 'test';
    state.components.searchProviders = {
      foo: {
        search() {
          return Promise.reject('ouch!');
        },
      },
    };
    const usedEffect = jest.fn(fn => fn());
    (React as any).useEffect = usedEffect;
    useSearch();
    await (state.components.searchProviders as any).foo.search().catch(m => m);
    expect(console.warn).toHaveBeenCalled();
  });
});
