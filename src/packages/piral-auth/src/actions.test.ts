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
    setUser.call(events, state, 'User', { a: 'on' }, { allow: true });
    expect(deref(state)).toEqual({
      foo: 5,
      user: {
        current: 'User',
        features: {
          a: 'on',
        },
        permissions: {
          allow: true,
        },
      },
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
      user: {
        current: undefined,
        features: {},
        permissions: {},
      },
    });
  });
});
