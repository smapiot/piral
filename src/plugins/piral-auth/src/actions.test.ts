import create from 'zustand';
import { createListener } from 'piral-base';
import { createActions } from 'piral-core';
import { setUser } from './actions';

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
    const ctx = createActions(state, createListener({}));
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
    const ctx = createActions(state, createListener({}));
    setUser(ctx, undefined, {}, {});
    expect((state.getState())).toEqual({
      foo: 5,
      user: undefined,
    });
  });
});
