/**
 * @vitest-environment jsdom
 */
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { registerPageLayout, unregisterPageLayout } from './actions';

function createListener() {
  return {
    on: vitest.fn(),
    off: vitest.fn(),
    emit: vitest.fn(),
  };
}

function createContext(state: any, listener: any) {
  return {
    ...listener,
    state: state.getState(),
    dispatch(change: any) {
      state.setState(change(state.getState()));
    },
  };
}

describe('Page Layouts Actions Module', () => {
  it('registerPageLayout adds to state registry', () => {
    const state: any = create(() => ({
      foo: 5,
      registry: {
        foo: 5,
        pageLayouts: {},
      },
    }));
    const ctx = createContext(state, createListener());
    registerPageLayout(ctx, 'admin', { pilet: 'test-pilet', component: 'LayoutComp' as any });
    expect(state.getState().registry.pageLayouts).toEqual({
      admin: { pilet: 'test-pilet', component: 'LayoutComp' },
    });
  });

  it('registerPageLayout preserves existing state fields', () => {
    const state: any = create(() => ({
      app: { name: 'test' },
      components: { RouteSwitch: 'rs' },
      registry: {
        pageLayouts: {},
        pages: { existing: 'page' },
      },
    }));
    const ctx = createContext(state, createListener());
    registerPageLayout(ctx, 'custom', { pilet: 'p1', component: 'c1' as any });
    const result = state.getState();
    expect(result.app).toEqual({ name: 'test' });
    expect(result.components).toEqual({ RouteSwitch: 'rs' });
    expect(result.registry.pages).toEqual({ existing: 'page' });
    expect(result.registry.pageLayouts).toEqual({ custom: { pilet: 'p1', component: 'c1' } });
  });

  it('unregisterPageLayout removes from state registry', () => {
    const state: any = create(() => ({
      registry: {
        pageLayouts: {
          guest: { pilet: 'p1', component: 'g' },
          admin: { pilet: 'p2', component: 'a' },
        },
      },
    }));
    const ctx = createContext(state, createListener());
    unregisterPageLayout(ctx, 'guest');
    expect(state.getState().registry.pageLayouts).toEqual({
      admin: { pilet: 'p2', component: 'a' },
    });
  });

  it('unregisterPageLayout is a no-op for non-existent key', () => {
    const state: any = create(() => ({
      registry: {
        pageLayouts: {
          admin: { pilet: 'p1', component: 'a' },
        },
      },
    }));
    const ctx = createContext(state, createListener());
    unregisterPageLayout(ctx, 'nonexistent');
    expect(state.getState().registry.pageLayouts).toEqual({
      admin: { pilet: 'p1', component: 'a' },
    });
  });

  it('registerPageLayout overwrites existing layout with same name', () => {
    const state: any = create(() => ({
      registry: {
        pageLayouts: {
          test: { pilet: 'old-pilet', component: 'old-comp' },
        },
      },
    }));
    const ctx = createContext(state, createListener());
    registerPageLayout(ctx, 'test', { pilet: 'new-pilet', component: 'new-comp' as any });
    expect(state.getState().registry.pageLayouts).toEqual({
      test: { pilet: 'new-pilet', component: 'new-comp' },
    });
  });

  it('registerPageLayout does not mutate the state directly', () => {
    const state: any = create(() => ({
      registry: { pageLayouts: {} },
    }));
    const ctx = createContext(state, createListener());
    const originalState = state.getState();
    registerPageLayout(ctx, 'a', { pilet: 'p', component: 'c' as any });
    expect(originalState.registry.pageLayouts).toEqual({});
  });

  it('register and unregister round-trip restores original state', () => {
    const state: any = create(() => ({
      registry: {
        pageLayouts: {},
      },
    }));
    const ctx = createContext(state, createListener());
    registerPageLayout(ctx, 'temp', { pilet: 'p', component: 'c' as any });
    expect(Object.keys(state.getState().registry.pageLayouts)).toEqual(['temp']);
    unregisterPageLayout(ctx, 'temp');
    expect(state.getState().registry.pageLayouts).toEqual({});
  });

  it('handles empty string as layout name', () => {
    const state: any = create(() => ({
      registry: { pageLayouts: {} },
    }));
    const ctx = createContext(state, createListener());
    registerPageLayout(ctx, '', { pilet: 'p', component: 'c' as any });
    expect(state.getState().registry.pageLayouts).toEqual({
      '': { pilet: 'p', component: 'c' },
    });
    unregisterPageLayout(ctx, '');
    expect(state.getState().registry.pageLayouts).toEqual({});
  });
});
