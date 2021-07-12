import { Atom, deref } from '@dbeining/react-atom';
import { createListener } from 'piral-base';
import { createActions } from 'piral-core';
import { setUser } from './actions';

describe('Auth Actions Module', () => {
  it('Sets the new user successfully', () => {
    const state = Atom.of({
      foo: 5,
      user: {
        current: undefined,
        features: {},
        permissions: {},
      },
    });
    const ctx = createActions(state, createListener({}));
    const user = {
      name: 'User',
      features: { a: 'on' },
      permissions: { allow: true },
    };
    setUser(ctx, user);
    expect(deref(state)).toEqual({
      foo: 5,
      user,
    });
  });

  it('Resets the user successfully', () => {
    const state = Atom.of({
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
    });
    const ctx = createActions(state, createListener({}));
    setUser(ctx, undefined, {}, {});
    expect(deref(state)).toEqual({
      foo: 5,
      user: undefined,
    });
  });
});
