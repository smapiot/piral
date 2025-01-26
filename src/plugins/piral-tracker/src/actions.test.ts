/**
 * @vitest-environment jsdom
 */
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { registerTracker, unregisterTracker } from './actions';

function createListener() {
  return {
    on: vitest.fn(),
    off: vitest.fn(),
    emit: vitest.fn(),
  };
}

function createActions(state, listener) {
  return {
    ...listener,
    state: state.getState(),
    dispatch(change) {
      state.setState(change(state.getState()));
    },
  };
}

describe('Tracker Actions Module', () => {
  it('registerTracker and unregisterTracker', () => {
    const state: any = create(() => ({
      foo: 5,
      registry: {
        foo: 5,
        trackers: {},
      },
    }));
    const ctx = createActions(state, createListener());
    registerTracker(ctx, 'foo', 10 as any);
    expect(state.getState()).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        trackers: {
          foo: 10,
        },
      },
    });
    unregisterTracker(ctx, 'foo');
    expect(state.getState()).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        trackers: {},
      },
    });
  });
});
