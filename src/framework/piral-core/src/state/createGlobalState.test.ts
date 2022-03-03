import { deref } from '@dbeining/react-atom';
import { createGlobalState } from './createGlobalState';
import {
  DefaultErrorInfo,
  DefaultLoadingIndicator,
  DefaultLayout,
  DefaultRouter,
  DefaultRouteSwitch,
} from '../components';

process.env.PIRAL_PUBLIC_PATH = '/';

describe('Create Global State Module', () => {
  window.matchMedia = jest.fn((q) => ({ matches: false })) as any;

  it('global state works with language as empty string', () => {
    const globalState = createGlobalState({});
    expect(deref(globalState)).toEqual({
      app: {
        layout: 'desktop',
        loading: true,
        error: undefined,
        publicPath: '/',
      },
      errorComponents: {},
      components: {
        ErrorInfo: DefaultErrorInfo,
        LoadingIndicator: DefaultLoadingIndicator,
        Router: DefaultRouter,
        Layout: DefaultLayout,
        RouteSwitch: DefaultRouteSwitch,
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
    expect(deref(globalState)).toEqual({
      app: {
        layout: 'desktop',
        loading: true,
        error: undefined,
        publicPath: '/',
      },
      errorComponents: {},
      components: {
        ErrorInfo: DefaultErrorInfo,
        LoadingIndicator: DefaultLoadingIndicator,
        Router: DefaultRouter,
        Layout: DefaultLayout,
        RouteSwitch: DefaultRouteSwitch,
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
    expect(deref(globalState)).toEqual({
      app: {
        error: undefined,
        layout: 'desktop',
        loading: true,
        publicPath: '/',
      },
      errorComponents: {},
      components: {
        ErrorInfo: DefaultErrorInfo,
        LoadingIndicator: DefaultLoadingIndicator,
        Router: DefaultRouter,
        Layout: DefaultLayout,
        RouteSwitch: DefaultRouteSwitch,
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
    expect(deref(globalState)).toEqual({
      app: {
        layout: 'desktop',
        loading: true,
        error: undefined,
        publicPath: '/',
      },
      errorComponents: {},
      components: {
        ErrorInfo: DefaultErrorInfo,
        LoadingIndicator: DefaultLoadingIndicator,
        Router: DefaultRouter,
        Layout: DefaultLayout,
        RouteSwitch: DefaultRouteSwitch,
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
    expect(deref(globalState)).toEqual({
      app: {
        layout: 'desktop',
        loading: true,
        error: undefined,
        publicPath: '/',
      },
      errorComponents: {},
      components: {
        ErrorInfo: DefaultErrorInfo,
        LoadingIndicator: DefaultLoadingIndicator,
        Router: DefaultRouter,
        Layout: DefaultLayout,
        RouteSwitch: DefaultRouteSwitch,
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
    expect(deref(globalState)).toEqual({
      app: {
        layout: 'desktop',
        loading: true,
        error: undefined,
        publicPath: '/',
      },
      errorComponents: {},
      components: {
        ErrorInfo: DefaultErrorInfo,
        LoadingIndicator: DefaultLoadingIndicator,
        Router: DefaultRouter,
        Layout: DefaultLayout,
        RouteSwitch: DefaultRouteSwitch,
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
      app: {
        layout: 'desktop',
      },
      routes: {
        '/': '...' as any,
        '/foo': '...' as any,
      },
    });
    expect(deref(globalState)).toEqual({
      app: {
        layout: 'desktop',
        loading: true,
        error: undefined,
        publicPath: '/',
      },
      errorComponents: {},
      components: {
        ErrorInfo: DefaultErrorInfo,
        LoadingIndicator: DefaultLoadingIndicator,
        Router: DefaultRouter,
        Layout: DefaultLayout,
        RouteSwitch: DefaultRouteSwitch,
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
    expect(deref(globalState)).toEqual({
      app: {
        layout: 'desktop',
        loading: false,
        error: undefined,
        publicPath: '/',
      },
      errorComponents: {},
      components: {
        ErrorInfo: DefaultErrorInfo,
        LoadingIndicator: DefaultLoadingIndicator,
        Router: DefaultRouter,
        Layout: DefaultLayout,
        RouteSwitch: DefaultRouteSwitch,
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
