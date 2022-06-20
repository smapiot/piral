import create from 'zustand';
import { createListener } from 'piral-base';
import { createActions } from 'piral-core';
import { registerTile, unregisterTile } from './actions';

describe('Dashboard Actions Module', () => {
  it('registerTile and unregisterTile', () => {
    const state: any = create(() => ({
      foo: 5,
      registry: {
        foo: 5,
        tiles: {},
      },
    }));
    const ctx = createActions(state, createListener({}));
    registerTile(ctx, 'foo', 10);
    expect((state.getState())).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        tiles: {
          foo: 10,
        },
      },
    });
    unregisterTile(ctx, 'foo');
    expect((state.getState())).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        tiles: {},
      },
    });
  });
});
