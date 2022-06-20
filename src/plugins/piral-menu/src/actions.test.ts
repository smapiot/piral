import create from 'zustand';
import { createListener } from 'piral-base';
import { createActions } from 'piral-core';
import { registerMenuItem, unregisterMenuItem } from './actions';

describe('Menu Actions Module', () => {
  it('registerMenuItem and unregisterMenuItem', () => {
    const state: any = create(() => ({
      foo: 5,
      registry: {
        foo: 5,
        menuItems: {},
      },
    }));
    const ctx = createActions(state, createListener({}));
    registerMenuItem(ctx, 'foo', 10);
    expect(state.getState()).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        menuItems: {
          foo: 10,
        },
      },
    });
    unregisterMenuItem(ctx, 'foo');
    expect(state.getState()).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        menuItems: {},
      },
    });
  });
});
