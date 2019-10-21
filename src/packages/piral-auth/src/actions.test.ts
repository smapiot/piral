import { Atom, deref } from '@dbeining/react-atom';
import { createListener } from 'piral-core';
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
    const events = createListener(undefined);
    const user = {
      name: 'User',
      features: { a: 'on' },
      permissions: { allow: true },
    };
    setUser.call(events, state, user);
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
    const events = createListener(undefined);
    setUser.call(events, state, undefined, {}, {});
    expect(deref(state)).toEqual({
      foo: 5,
      user: undefined,
    });
  });
});
