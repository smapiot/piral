import * as React from 'react';
import * as piralCore from 'piral-core';
import { useFeed } from './useFeed';

jest.mock('react');

describe('Feed Hook Module', () => {
  it('Does not load if its already loaded', () => {
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
    const loadAction = jest.fn();
    const usedEffect = jest.fn();
    (piralCore as any).useGlobalState = (select: any) => select(pseudoState);
    (piralCore as any).useAction = () => loadAction;
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
    const loadAction = jest.fn();
    const usedEffect = jest.fn();
    (piralCore as any).useGlobalState = (select: any) => select(pseudoState);
    (piralCore as any).useAction = () => loadAction;
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
    const loadAction = jest.fn();
    const usedEffect = jest.fn();
    (piralCore as any).useGlobalState = (select: any) => select(pseudoState);
    (piralCore as any).useAction = () => loadAction;
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
