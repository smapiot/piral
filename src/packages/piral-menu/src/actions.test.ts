import { Atom, deref } from '@dbeining/react-atom';
import { registerMenuItem, unregisterMenuItem } from './actions';
import { createActions, createListener } from 'piral-core';

describe('Menu Actions Module', () => {
  it('registerMenuItem and unregisterMenuItem', () => {
    const state = Atom.of({
      foo: 5,
      registry: {
        foo: 5,
        menuItems: {},
      },
    });
    const ctx = createActions(state, createListener({}));
    registerMenuItem(ctx, 'foo', 10);
    expect(deref(state)).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        menuItems: {
          foo: 10,
        },
      },
    });
    unregisterMenuItem(ctx, 'foo');
    expect(deref(state)).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        menuItems: {},
      },
    });
  });
});
