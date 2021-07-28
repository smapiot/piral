import { Atom, deref } from '@dbeining/react-atom';
import { createListener } from 'piral-base';
import { createActions } from 'piral-core';
import { registerTile, unregisterTile } from './actions';

describe('Dashboard Actions Module', () => {
  it('registerTile and unregisterTile', () => {
    const state = Atom.of({
      foo: 5,
      registry: {
        foo: 5,
        tiles: {},
      },
    });
    const ctx = createActions(state, createListener({}));
    registerTile(ctx, 'foo', 10);
    expect(deref(state)).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        tiles: {
          foo: 10,
        },
      },
    });
    unregisterTile(ctx, 'foo');
    expect(deref(state)).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        tiles: {},
      },
    });
  });
});
