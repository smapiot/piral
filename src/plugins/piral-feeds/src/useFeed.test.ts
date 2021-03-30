import * as React from 'react';

const useGlobalState = jest.fn();
const loadAction = jest.fn();
const useAction = jest.fn(() => loadAction);

jest.mock('piral-core', () => ({
  ...jest.requireActual('piral-core'),
  useGlobalState,
  useAction,
}));

describe('Feed Hook Module', () => {
  beforeEach(() => {
    loadAction.mockReset();
  });

  it('Does not load if its already loaded', () => {
    const { useFeed } = require('./useFeed');
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
    const usedEffect = jest.fn();
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
  });

  it('Does not load if its already loading', () => {
    const { useFeed } = require('./useFeed');
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
    const usedEffect = jest.fn();
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
  });

  it('Triggers load if its not loading', () => {
    const { useFeed } = require('./useFeed');
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
    const usedEffect = jest.fn();
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
  });
});
