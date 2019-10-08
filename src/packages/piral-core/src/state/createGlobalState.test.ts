import { deref } from '@dbeining/react-atom';
import { createGlobalState } from './createGlobalState';
import { DefaultErrorInfo, DefaultLoader } from '../components/default';

describe('Create Global State Module', () => {
  window.matchMedia = jest.fn(q => ({ matches: false })) as any;

  it('global state can be created without arguments', () => {
    const globalState = createGlobalState();
    expect(deref(globalState)).toEqual({
      app: {
        layout: 'desktop',
        components: {
          ErrorInfo: DefaultErrorInfo,
          Loader: DefaultLoader,
        },
        loading: false,
        data: {},
        routes: {},
      },
      components: {
        extensions: {},
        pages: {},
      },
      modules: [],
    });
  });

  it('global state works with language as empty string', () => {
    const globalState = createGlobalState({
      app: {},
    });
    expect(deref(globalState)).toEqual({
      app: {
        layout: 'desktop',
        components: {
          ErrorInfo: DefaultErrorInfo,
          Loader: DefaultLoader,
        },
        loading: false,
        data: {},
        routes: {},
      },
      components: {
        extensions: {},
        pages: {},
      },
      modules: [],
    });
  });

  it('global state with custom language and translations', () => {
    const globalState = createGlobalState({
      app: {},
    });
    expect(deref(globalState)).toEqual({
      app: {
        layout: 'desktop',
        components: {
          ErrorInfo: DefaultErrorInfo,
          Loader: DefaultLoader,
        },
        loading: false,
        data: {},
        routes: {},
      },
      components: {
        extensions: {},
        pages: {},
      },
      modules: [],
    });
  });

  it('global state with non-default breakpoints and more routes', () => {
    const globalState = createGlobalState({
      app: {
        routes: {
          '/': '...' as any,
          '/foo': '...' as any,
        },
        layout: 'desktop',
      },
    });
    expect(deref(globalState)).toEqual({
      app: {
        layout: 'desktop',
        components: {
          ErrorInfo: DefaultErrorInfo,
          Loader: DefaultLoader,
        },
        loading: false,
        data: {},
        routes: {
          '/': '...' as any,
          '/foo': '...' as any,
        },
      },
      components: {
        extensions: {},
        pages: {},
      },
      modules: [],
    });
  });
});
