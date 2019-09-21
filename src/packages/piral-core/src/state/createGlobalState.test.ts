import { deref } from '@dbeining/react-atom';
import { createGlobalState } from './createGlobalState';
import { DefaultErrorInfo, DefaultLoader } from '../components/default';
import { defaultBreakpoints } from '../utils';

describe('Create Global State Module', () => {
  window.matchMedia = jest.fn(q => ({ matches: false })) as any;

  it('global state can be created without arguments', () => {
    const globalState = createGlobalState();
    expect(deref(globalState)).toEqual({
      app: {
        layout: {
          current: 'desktop',
          breakpoints: defaultBreakpoints,
        },
        components: {
          ErrorInfo: DefaultErrorInfo,
          Loader: DefaultLoader,
        },
        loading: false,
        data: {},
        routes: {},
        trackers: [],
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
        layout: {
          current: 'desktop',
          breakpoints: defaultBreakpoints,
        },
        components: {
          ErrorInfo: DefaultErrorInfo,
          Loader: DefaultLoader,
        },
        loading: false,
        data: {},
        routes: {},
        trackers: [],
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
        layout: {
          current: 'desktop',
          breakpoints: defaultBreakpoints,
        },
        components: {
          ErrorInfo: DefaultErrorInfo,
          Loader: DefaultLoader,
        },
        loading: false,
        data: {},
        routes: {},
        trackers: [],
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
        layout: {
          current: 'desktop',
          breakpoints: ['12px', '24px', '360px'],
        },
      },
    });
    expect(deref(globalState)).toEqual({
      app: {
        layout: {
          current: 'desktop',
          breakpoints: ['12px', '24px', '360px'],
        },
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
        trackers: [],
      },
      components: {
        extensions: {},
        pages: {},
      },
      modules: [],
    });
  });
});
