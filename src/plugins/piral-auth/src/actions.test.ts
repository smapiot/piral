/**
 * @vitest-environment jsdom
 */
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { setUser } from './actions';

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

describe('Auth Actions Module', () => {
  it('Sets the new user successfully', () => {
    const state: any = create(() => ({
      foo: 5,
      user: {
        current: undefined,
        features: {},
        permissions: {},
      },
    }));
    const ctx = createActions(state, createListener());
    const user = {
      name: 'User',
      features: { a: 'on' },
      permissions: { allow: true },
    };
    setUser(ctx, user);
    expect((state.getState())).toEqual({
      foo: 5,
      user,
    });
  });

  it('Resets the user successfully', () => {
    const state: any = create(() => ({
      foo: 5,
      user: {
        current: 'User',
        features: {
          a: 'off',
        },
        permissions: {
          allow: false,
        },
      },
    }));
    const ctx = createActions(state, createListener());
    setUser(ctx, undefined, {}, {});
    expect((state.getState())).toEqual({
      foo: 5,
      user: undefined,
    });
  });
});
