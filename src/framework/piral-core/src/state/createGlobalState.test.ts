import { createGlobalState } from './createGlobalState';

process.env.PIRAL_PUBLIC_PATH = '/';

describe('Create Global State Module', () => {
  window.matchMedia = jest.fn((q) => ({ matches: false })) as any;

  it('global state works with language as empty string', () => {
    const globalState = createGlobalState({});
    const tmp = globalState.getState();

    console.log(tmp);

    expect(tmp).toEqual({
      app: {
        loading: true,
        error: undefined,
      },
      errorComponents: {},
      components: {
        ErrorInfo: expect.anything(),
        LoadingIndicator: expect.anything(),
        Router: expect.anything(),
        Layout: expect.anything(),
        RouteSwitch: expect.anything(),
      },
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
      components: {
        ErrorInfo: expect.anything(),
        LoadingIndicator: expect.anything(),
        Router: expect.anything(),
        Layout: expect.anything(),
        RouteSwitch: expect.anything(),
      },
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
      components: {
        ErrorInfo: expect.anything(),
        LoadingIndicator: expect.anything(),
        Router: expect.anything(),
        Layout: expect.anything(),
        RouteSwitch: expect.anything(),
      },
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
      components: {
        ErrorInfo: expect.anything(),
        LoadingIndicator: expect.anything(),
        Router: expect.anything(),
        Layout: expect.anything(),
        RouteSwitch: expect.anything(),
      },
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
      components: {
        ErrorInfo: expect.anything(),
        LoadingIndicator: expect.anything(),
        Router: expect.anything(),
        Layout: expect.anything(),
        RouteSwitch: expect.anything(),
      },
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
      components: {
        ErrorInfo: expect.anything(),
        LoadingIndicator: expect.anything(),
        Router: expect.anything(),
        Layout: expect.anything(),
        RouteSwitch: expect.anything(),
      },
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
      components: {
        ErrorInfo: expect.anything(),
        LoadingIndicator: expect.anything(),
        Router: expect.anything(),
        Layout: expect.anything(),
        RouteSwitch: expect.anything(),
      },
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
      components: {
        ErrorInfo: expect.anything(),
        LoadingIndicator: expect.anything(),
        Router: expect.anything(),
        Layout: expect.anything(),
        RouteSwitch: expect.anything(),
      },
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
