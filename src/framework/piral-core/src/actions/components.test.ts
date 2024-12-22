/**
 * @vitest-environment jsdom
 */
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { createListener } from 'piral-base';
import { registerExtension, registerPage, unregisterExtension, unregisterPage } from './components';
import { createActions } from '../state';

vitest.mock('../../app.codegen', () => ({
  createNavigation: vitest.fn((publicPath) => ({
    publicPath,
  })),
  publicPath: '/',
}));

describe('Components Actions Module', () => {
  it('registerExtension and unregisterExtension', () => {
    const state: any = create(() => ({
      foo: 5,
      registry: {
        foo: 5,
        extensions: {},
      },
    }));
    const ctx = createActions(state, createListener({}));
    registerExtension(ctx, 'foo', 10 as any);
    expect(state.getState()).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        extensions: {
          foo: [10],
        },
      },
    });
    unregisterExtension(ctx, 'foo', undefined);
    expect(state.getState()).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        extensions: {
          foo: [],
        },
      },
    });
  });

  it('registerPage and unregisterPage', () => {
    const state: any = create(() => ({
      foo: 5,
      registry: {
        foo: 5,
        pages: {},
      },
    }));
    const ctx = createActions(state, createListener({}));
    registerPage(ctx, 'foo', 10 as any);
    expect(state.getState()).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        pages: {
          foo: 10,
        },
      },
    });
    unregisterPage(ctx, 'foo');
    expect(state.getState()).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        pages: {},
      },
    });
  });
});
