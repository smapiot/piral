/**
 * @vitest-environment jsdom
 */
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { registerMenuItem, unregisterMenuItem } from './actions';

function createListener() {
  return {
    on: vitest.fn(),
    off: vitest.fn(),
    emit: vitest.fn(),
  };
}

function createActions(state, listener) {
  const obj = {
    ...listener,
    state: state.getState(),
    defineActions(actions) {
      Object.entries(actions).forEach(([name, cb]) => {
        obj[name] = (cb as any).bind(obj, obj);
      });
    },
    readState(select) {
      return select(state.getState());
    },
    dispatch(change) {
      state.setState(change(state.getState()));
    },
  };
  return obj;
}

describe('Menu Actions Module', () => {
  it('registerMenuItem and unregisterMenuItem', () => {
    const state: any = create(() => ({
      foo: 5,
      registry: {
        foo: 5,
        menuItems: {},
      },
    }));
    const ctx = createActions(state, createListener());
    registerMenuItem(ctx, 'foo', 10);
    expect(state.getState()).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        menuItems: {
          foo: 10,
        },
      },
    });
    unregisterMenuItem(ctx, 'foo');
    expect(state.getState()).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        menuItems: {},
      },
    });
  });
});
