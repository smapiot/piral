import create from 'zustand';
import { createListener } from 'piral-base';
import { createActions } from 'piral-core';
import { registerBreadcrumb, unregisterBreadcrumb } from './actions';

describe('Breadcrumbs Actions Module', () => {
  it('registerBreadcrumb and unregisterBreadcrumb', () => {
    const state: any = create(() => ({
      foo: 5,
      registry: {
        foo: 5,
        breadcrumbs: {},
      },
    }));
    const ctx = createActions(state, createListener({}));
    registerBreadcrumb(ctx, 'foo', 10);
    expect((state.getState())).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        breadcrumbs: {
          foo: 10,
        },
      },
    });
    unregisterBreadcrumb(ctx, 'foo');
    expect((state.getState())).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        breadcrumbs: {},
      },
    });
  });
});
