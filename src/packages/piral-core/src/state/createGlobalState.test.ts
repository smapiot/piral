import { deref } from '@dbeining/react-atom';
import { BrowserRouter as DefaultRouter } from 'react-router-dom';
import { createGlobalState } from './createGlobalState';
import { DefaultErrorInfo, DefaultLoadingIndicator, DefaultLayout } from '../components';

describe('Create Global State Module', () => {
  window.matchMedia = jest.fn(q => ({ matches: false })) as any;

  it('global state works with language as empty string', () => {
    const globalState = createGlobalState({});
    expect(deref(globalState)).toEqual({
      app: {
        layout: 'desktop',
        loading: false,
        error: undefined,
      },
      components: {
        ErrorInfo: DefaultErrorInfo,
        LoadingIndicator: DefaultLoadingIndicator,
        Router: DefaultRouter,
        Layout: DefaultLayout,
      },
      routes: {},
      registry: {
        extensions: {},
        pages: {},
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
        loading: false,
        error: undefined,
      },
      components: {
        ErrorInfo: DefaultErrorInfo,
        LoadingIndicator: DefaultLoadingIndicator,
        Router: DefaultRouter,
        Layout: DefaultLayout,
      },
      routes: {},
      registry: {
        extensions: {},
        pages: {},
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
        loading: false,
      },
      components: {
        ErrorInfo: DefaultErrorInfo,
        LoadingIndicator: DefaultLoadingIndicator,
        Router: DefaultRouter,
        Layout: DefaultLayout,
      },
      routes,
      registry: {
        extensions: {},
        pages: {},
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
        loading: false,
        error: undefined,
      },
      components: {
        ErrorInfo: DefaultErrorInfo,
        LoadingIndicator: DefaultLoadingIndicator,
        Router: DefaultRouter,
        Layout: DefaultLayout,
      },
      registry: {
        extensions: {},
        pages: {},
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
        loading: false,
        error: undefined,
      },
      components: {
        ErrorInfo: DefaultErrorInfo,
        LoadingIndicator: DefaultLoadingIndicator,
        Router: DefaultRouter,
        Layout: DefaultLayout,
      },
      registry: {
        extensions: {},
        pages: {},
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
        loading: false,
        error: undefined,
      },
      components: {
        ErrorInfo: DefaultErrorInfo,
        LoadingIndicator: DefaultLoadingIndicator,
        Router: DefaultRouter,
        Layout: DefaultLayout,
      },
      registry: {
        extensions: {},
        pages: {},
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
        loading: false,
        error: undefined,
      },
      components: {
        ErrorInfo: DefaultErrorInfo,
        LoadingIndicator: DefaultLoadingIndicator,
        Router: DefaultRouter,
        Layout: DefaultLayout,
      },
      registry: {
        extensions: {},
        pages: {},
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
});
