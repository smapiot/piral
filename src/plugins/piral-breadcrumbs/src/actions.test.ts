import { Atom, deref } from '@dbeining/react-atom';
import { registerBreadcrumb, unregisterBreadcrumb } from './actions';
import { createActions, createListener } from 'piral-core';

describe('Breadcrumbs Actions Module', () => {
  it('registerBreadcrumb and unregisterBreadcrumb', () => {
    const state = Atom.of({
      foo: 5,
      registry: {
        foo: 5,
        breadcrumbs: {},
      },
    });
    const ctx = createActions(state, createListener({}));
    registerBreadcrumb(ctx, 'foo', 10);
    expect(deref(state)).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        breadcrumbs: {
          foo: 10,
        },
      },
    });
    unregisterBreadcrumb(ctx, 'foo');
    expect(deref(state)).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        breadcrumbs: {},
      },
    });
  });
});
