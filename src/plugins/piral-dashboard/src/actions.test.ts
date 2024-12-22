/**
 * @vitest-environment jsdom
 */
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { registerTile, unregisterTile } from './actions';

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

describe('Dashboard Actions Module', () => {
  it('registerTile and unregisterTile', () => {
    const state: any = create(() => ({
      foo: 5,
      registry: {
        foo: 5,
        tiles: {},
      },
    }));
    const ctx = createActions(state, createListener());
    registerTile(ctx, 'foo', 10);
    expect(state.getState()).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        tiles: {
          foo: 10,
        },
      },
    });
    unregisterTile(ctx, 'foo');
    expect(state.getState()).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        tiles: {},
      },
    });
  });
});
