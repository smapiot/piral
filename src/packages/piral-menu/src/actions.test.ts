import { Atom, deref } from '@dbeining/react-atom';
import { registerMenuItem, unregisterMenuItem } from './actions';

describe('Menu Actions Module', () => {
  it('registerMenuItem and unregisterMenuItem', () => {
    const state = Atom.of({
      foo: 5,
      registry: {
        foo: 5,
        menuItems: {},
      },
    });
    registerMenuItem(state, 'foo', 10);
    expect(deref(state)).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        menuItems: {
          foo: 10,
        },
      },
    });
    unregisterMenuItem(state, 'foo');
    expect(deref(state)).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        menuItems: {},
      },
    });
  });
});
