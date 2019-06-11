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

describe('Search Hook Module', () => {
  it('just returns current input value', () => {
    const usedEffect = jest.fn();
    (React as any).useEffect = usedEffect;
    (React as any).useRef = current => ({ current });
    const [value] = useSearch();
    expect(value).toBe('abc');
  });

  it('sets the value using the action', () => {
    const usedEffect = jest.fn();
    (React as any).useEffect = usedEffect;
    (React as any).useRef = current => ({ current });
    const [_, setValue] = useSearch();
    setValue('foo');
    expect(availableActions.setSearchInput).toHaveBeenCalledWith('foo');
  });

  it('immediately resets with loading false if some value is given but no provider found', () => {
    state.search.input = 'foo';
    const usedEffect = jest.fn(fn => fn());
    (React as any).useEffect = usedEffect;
    (React as any).useRef = current => ({ current });
    useSearch();
    expect(availableActions.resetSearchResults).toHaveBeenCalledWith(false);
  });

  it('immediately resets with loading true if some value is given and a provider is found', () => {
    state.search.input = 'foo';
    state.components.searchProviders['example'] = {
      search(q: string) {
        return Promise.resolve([]);
      },
    };
    const usedEffect = jest.fn(fn => fn());
    (React as any).useEffect = usedEffect;
    (React as any).useRef = current => ({ current });
    useSearch();
    expect(availableActions.resetSearchResults).toHaveBeenCalledWith(true);
  });

  it('immediately resets with loading false if no value is given', () => {
    state.search.input = '';
    const usedEffect = jest.fn(fn => fn());
    (React as any).useEffect = usedEffect;
    (React as any).useRef = current => ({ current });
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
    (React as any).useRef = current => ({ current });
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
    (React as any).useRef = current => ({ current });
    useSearch();
    await (state.components.searchProviders as any).foo.search().catch(m => m);
  });

  it('stops existing search', async () => {
    state.search.input = 'test';
    state.components.searchProviders = {
      foo: {
        search() {
          return Promise.resolve(['Hello', 'World']);
        },
      },
    };
    const usedEffect = jest.fn(fn => fn());
    const usedRef = jest.fn(current => ({ current }));
    (React as any).useEffect = usedEffect;
    (React as any).useRef = usedRef;
    useSearch();
    usedRef.mock.results[0].value.current();
    await (state.components.searchProviders as any).foo.search().catch(m => m);
  });

  it('cancels existing search', async () => {
    state.search.input = 'test';
    state.components.searchProviders = {
      foo: {
        search() {
          return Promise.resolve(['Hello', 'World']);
        },
      },
    };
    const usedEffect = jest.fn(fn => {
      fn();
      return fn;
    });
    const usedRef = jest.fn(current => ({ current }));
    (React as any).useEffect = usedEffect;
    (React as any).useRef = usedRef;
    useSearch();
    usedEffect.mock.results[0].value();
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
    (React as any).useRef = current => ({ current });
    useSearch();
    await (state.components.searchProviders as any).foo.search().catch(m => m);
    expect(console.warn).toHaveBeenCalled();
  });
});
