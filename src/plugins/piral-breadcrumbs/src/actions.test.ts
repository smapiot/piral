/**
 * @vitest-environment jsdom
 */
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { registerBreadcrumbs, unregisterBreadcrumbs } from './actions';

function createListener() {
  return {
    on: vitest.fn(),
    off: vitest.fn(),
    emit: vitest.fn(),
  };
}

function createActions(state, listener) {
  return {
    ...listener,
    state: state.getState(),
    readState(select) {
      return select(state.getState());
    },
    dispatch(change) {
      state.setState(change(state.getState()));
    },
  };
}

describe('Breadcrumbs Actions Module', () => {
  it('registerBreadcrumb and unregisterBreadcrumb', () => {
    const state: any = create(() => ({
      foo: 5,
      registry: {
        foo: 5,
        breadcrumbs: {},
      },
    }));
    const ctx = createActions(state, createListener());
    registerBreadcrumbs(ctx, {
      foo: 10 as any,
    });
    expect(state.getState()).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        breadcrumbs: {
          foo: 10,
        },
      },
    });
    unregisterBreadcrumbs(ctx, ['foo']);
    expect(state.getState()).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        breadcrumbs: {},
      },
    });
  });
});
