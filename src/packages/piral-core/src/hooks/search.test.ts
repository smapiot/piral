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
  triggerSearch: jest.fn(),
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
    (React as any).useState = initial => [initial, jest.fn()];
    const [_, setValue] = useSearch();
    setValue('foo');
    expect(availableActions.setSearchInput).toHaveBeenCalledWith('foo');
  });

  it('triggers the search without immediate mode', () => {
    const usedEffect = jest.fn(fn => fn());
    (React as any).useEffect = usedEffect;
    (React as any).useRef = current => ({ current });
    (React as any).useState = initial => [initial, jest.fn()];
    useSearch();
    expect(availableActions.triggerSearch).toHaveBeenCalledWith('abc', false);
  });

  it('cancels the current search', () => {
    const usedEffect = jest.fn(fn => fn());
    const cancel = jest.fn();
    (React as any).useEffect = usedEffect;
    (React as any).useRef = _ => ({ current: cancel });
    (React as any).useState = initial => [initial, jest.fn()];
    useSearch();
    expect(cancel).toHaveBeenCalledTimes(1);
  });
});
