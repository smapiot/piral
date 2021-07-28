import { Atom, deref } from '@dbeining/react-atom';
import { createListener } from 'piral-base';
import { createActions } from 'piral-core';
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
