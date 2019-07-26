import { setupState } from './helpers';
import { defaultBreakpoints } from './utils';
import { DefaultDashboard, DefaultErrorInfo, DefaultLoader } from './components/default';
import { LayoutBreakpoints } from './types';

jest.mock('history', () => ({
  createBrowserHistory: () => ({}),
}));

describe('Helper Module', () => {
  window.matchMedia = jest.fn(q => ({ matches: false })) as any;

  it('global state works with language as empty string', () => {
    const globalState = setupState({
      language: '',
    });
    expect(globalState).toEqual({
      app: {
        language: {
          selected: '',
          available: [],
        },
        layout: {
          current: 'desktop',
          breakpoints: defaultBreakpoints,
        },
        components: {
          Dashboard: DefaultDashboard,
          ErrorInfo: DefaultErrorInfo,
          Loader: DefaultLoader,
          history: {},
        },
        routes: {},
        trackers: [],
      },
      user: {},
    });
  });

  it('global state with custom language and translations', () => {
    const languages = ['de', 'fr', 'en'];
    const globalState = setupState({ language: 'fr', languages });
    expect(globalState).toEqual({
      app: {
        language: {
          selected: 'fr',
          available: ['de', 'fr', 'en'],
        },
        layout: {
          current: 'desktop',
          breakpoints: defaultBreakpoints,
        },
        components: {
          Dashboard: DefaultDashboard,
          ErrorInfo: DefaultErrorInfo,
          Loader: DefaultLoader,
          history: {},
        },
        routes: {},
        trackers: [],
      },
      user: {},
    });
  });

  it('global state with non-default breakpoints and more routes', () => {
    const languages = ['de', 'en'];
    const routes = {
      '/': '...' as any,
      '/foo': '...' as any,
    };
    const breakpoints: LayoutBreakpoints = ['12px', '24px', '360px'];
    const globalState = setupState({ languages, breakpoints, routes });
    expect(globalState).toEqual({
      app: {
        language: {
          selected: 'en',
          available: ['de', 'en'],
        },
        layout: {
          current: 'desktop',
          breakpoints,
        },
        components: {
          Dashboard: DefaultDashboard,
          ErrorInfo: DefaultErrorInfo,
          Loader: DefaultLoader,
          history: {},
        },
        routes,
        trackers: [],
      },
      user: {},
    });
  });
});
