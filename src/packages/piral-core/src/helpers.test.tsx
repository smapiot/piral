import { setupState } from './helpers';
import { defaultBreakpoints } from './utils';
import { DefaultErrorInfo, DefaultLoader } from './components/default';
import { LayoutBreakpoints } from './types';

jest.mock('history', () => ({
  createBrowserHistory: () => ({}),
}));

describe('Helper Module', () => {
  window.matchMedia = jest.fn(q => ({ matches: false })) as any;

  it('global state works with language as empty string', () => {
    const globalState = setupState({});
    expect(globalState).toEqual({
      app: {
        layout: {
          current: 'desktop',
          breakpoints: defaultBreakpoints,
        },
        components: {
          ErrorInfo: DefaultErrorInfo,
          Loader: DefaultLoader,
          history: {},
        },
        routes: {},
        trackers: [],
      },
    });
  });

  it('global state with custom language and translations', () => {
    const globalState = setupState({});
    expect(globalState).toEqual({
      app: {
        layout: {
          current: 'desktop',
          breakpoints: defaultBreakpoints,
        },
        components: {
          ErrorInfo: DefaultErrorInfo,
          Loader: DefaultLoader,
          history: {},
        },
        routes: {},
        trackers: [],
      },
    });
  });

  it('global state with non-default breakpoints and more routes', () => {
    const routes = {
      '/': '...' as any,
      '/foo': '...' as any,
    };
    const breakpoints: LayoutBreakpoints = ['12px', '24px', '360px'];
    const globalState = setupState({ breakpoints, routes });
    expect(globalState).toEqual({
      app: {
        layout: {
          current: 'desktop',
          breakpoints,
        },
        components: {
          ErrorInfo: DefaultErrorInfo,
          Loader: DefaultLoader,
          history: {},
        },
        routes,
        trackers: [],
      },
    });
  });
});
