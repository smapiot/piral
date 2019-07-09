import { Atom, deref } from '@dbeining/react-atom';
import { setUser } from './user';

describe('User Actions Module', () => {
  it('Sets the new user successfully', () => {
    const state = Atom.of({
      foo: 5,
      user: {
        current: undefined,
        features: {},
        permissions: {},
      },
    });
    setUser(state, 'User', { a: 'on' }, { allow: true });
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
    setUser(state, undefined, {}, {});
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
