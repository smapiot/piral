/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vitest } from 'vitest';
import { createGlobalState } from './createGlobalState';

process.env.PIRAL_PUBLIC_PATH = '/';

vitest.mock('../../app.codegen', () => ({
  createDefaultState() {
    return {
      app: {
        error: undefined,
        loading: typeof window !== 'undefined',
      },
      components: {},
      errorComponents: {},
      registry: {
        extensions: {},
        pages: {},
        wrappers: {},
      },
      routes: {},
      data: {},
      portals: {},
      modules: [],
    };
  },
}));

describe('Create Global State Module', () => {
  window.matchMedia = vitest.fn((q) => ({ matches: false })) as any;

  it('global state works with language as empty string', () => {
    const globalState = createGlobalState({});
    const tmp = globalState.getState();

    expect(tmp).toEqual({
      app: {
        loading: true,
        error: undefined,
      },
      errorComponents: {},
      components: {},
      routes: {},
      registry: {
        extensions: {},
        pages: {},
        wrappers: {},
      },
      modules: [],
      portals: {},
      data: {},
    });
  });

  it('global state with custom language and translations', () => {
    const globalState = createGlobalState({});
    expect(globalState.getState()).toEqual({
      app: {
        loading: true,
        error: undefined,
      },
      errorComponents: {},
      components: {},
      routes: {},
      registry: {
        extensions: {},
        pages: {},
        wrappers: {},
      },
      modules: [],
      portals: {},
      data: {},
    });
  });

  it('global state with non-default breakpoints and more routes', () => {
    const routes = {
      '/': '...' as any,
      '/foo': '...' as any,
    };
    const globalState = createGlobalState({ routes });
    expect(globalState.getState()).toEqual({
      app: {
        error: undefined,
        loading: true,
      },
      errorComponents: {},
      components: {},
      routes,
      registry: {
        extensions: {},
        pages: {},
        wrappers: {},
      },
      modules: [],
      portals: {},
      data: {},
    });
  });

  it('global state can be created without arguments', () => {
    const globalState = createGlobalState();
    expect(globalState.getState()).toEqual({
      app: {
        loading: true,
        error: undefined,
      },
      errorComponents: {},
      components: {},
      registry: {
        extensions: {},
        pages: {},
        wrappers: {},
      },
      modules: [],
      portals: {},
      data: {},
      routes: {},
    });
  });

  it('global state works with language as empty string', () => {
    const globalState = createGlobalState({
      app: {},
    });
    expect(globalState.getState()).toEqual({
      app: {
        loading: true,
        error: undefined,
      },
      errorComponents: {},
      components: {},
      registry: {
        extensions: {},
        pages: {},
        wrappers: {},
      },
      modules: [],
      portals: {},
      data: {},
      routes: {},
    });
  });

  it('global state with custom language and translations', () => {
    const globalState = createGlobalState({
      app: {},
    });
    expect(globalState.getState()).toEqual({
      app: {
        loading: true,
        error: undefined,
      },
      errorComponents: {},
      components: {},
      registry: {
        extensions: {},
        pages: {},
        wrappers: {},
      },
      modules: [],
      portals: {},
      data: {},
      routes: {},
    });
  });

  it('global state with non-default breakpoints and more routes', () => {
    const globalState = createGlobalState({
      app: {},
      routes: {
        '/': '...' as any,
        '/foo': '...' as any,
      },
    });
    expect(globalState.getState()).toEqual({
      app: {
        loading: true,
        error: undefined,
      },
      errorComponents: {},
      components: {},
      registry: {
        extensions: {},
        pages: {},
        wrappers: {},
      },
      modules: [],
      portals: {},
      data: {},
      routes: {
        '/': '...' as any,
        '/foo': '...' as any,
      },
    });
  });

  it('global state with explicit loading override', () => {
    const globalState = createGlobalState({
      app: {
        loading: false,
      },
    });
    expect(globalState.getState()).toEqual({
      app: {
        loading: false,
        error: undefined,
      },
      errorComponents: {},
      components: {},
      registry: {
        extensions: {},
        pages: {},
        wrappers: {},
      },
      modules: [],
      portals: {},
      data: {},
      routes: {},
    });
  });
});
