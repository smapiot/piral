import create from 'zustand';
import { createListener } from 'piral-base';
import { createActions } from 'piral-core';
import { registerTracker, unregisterTracker } from './actions';

describe('Tracker Actions Module', () => {
  it('registerTracker and unregisterTracker', () => {
    const state: any = create(() => ({
      foo: 5,
      registry: {
        foo: 5,
        trackers: {},
      },
    }));
    const ctx = createActions(state, createListener({}));
    registerTracker(ctx, 'foo', 10 as any);
    expect((state.getState())).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        trackers: {
          foo: 10,
        },
      },
    });
    unregisterTracker(ctx, 'foo');
    expect((state.getState())).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        trackers: {},
      },
    });
  });
});
