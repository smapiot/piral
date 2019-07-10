import { deref } from '@dbeining/react-atom';
import { createGlobalState } from './createGlobalState';
import { DefaultDashboard, DefaultErrorInfo, DefaultLoader } from '../components/default';
import { defaultBreakpoints } from '../utils';

describe('Create Global State Module', () => {
  window.matchMedia = jest.fn(q => ({ matches: false })) as any;

  it('global state can be created without arguments', () => {
    const globalState = createGlobalState();
    expect(deref(globalState)).toEqual({
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
        },
        loading: false,
        data: {},
        modals: [],
        notifications: [],
        routes: {},
        trackers: [],
      },
      components: {
        extensions: {},
        menuItems: {},
        modals: {},
        pages: {},
        tiles: {},
        searchProviders: {},
      },
      feeds: {},
      forms: {},
      user: {
        current: undefined,
        features: {},
        permissions: {},
      },
      search: {
        input: '',
        loading: false,
        results: [],
      },
      modules: [],
    });
  });

  it('global state works with language as empty string', () => {
    const globalState = createGlobalState({
      app: {
        language: {
          selected: '',
          available: [],
        },
      },
    });
    expect(deref(globalState)).toEqual({
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
        },
        loading: false,
        data: {},
        modals: [],
        notifications: [],
        routes: {},
        trackers: [],
      },
      components: {
        extensions: {},
        menuItems: {},
        modals: {},
        pages: {},
        tiles: {},
        searchProviders: {},
      },
      feeds: {},
      forms: {},
      user: {
        current: undefined,
        features: {},
        permissions: {},
      },
      search: {
        input: '',
        loading: false,
        results: [],
      },
      modules: [],
    });
  });

  it('global state with custom language and translations', () => {
    const globalState = createGlobalState({
      app: {
        language: {
          selected: 'fr',
          available: ['de', 'fr', 'en'],
        },
      },
    });
    expect(deref(globalState)).toEqual({
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
        },
        loading: false,
        data: {},
        modals: [],
        notifications: [],
        routes: {},
        trackers: [],
      },
      components: {
        extensions: {},
        menuItems: {},
        modals: {},
        pages: {},
        tiles: {},
        searchProviders: {},
      },
      feeds: {},
      forms: {},
      user: {
        current: undefined,
        features: {},
        permissions: {},
      },
      search: {
        input: '',
        loading: false,
        results: [],
      },
      modules: [],
    });
  });

  it('global state with non-default breakpoints and more routes', () => {
    const globalState = createGlobalState({
      app: {
        language: {
          available: ['de', 'en'],
          selected: 'en',
        },
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
        language: {
          selected: 'en',
          available: ['de', 'en'],
        },
        layout: {
          current: 'desktop',
          breakpoints: ['12px', '24px', '360px'],
        },
        components: {
          Dashboard: DefaultDashboard,
          ErrorInfo: DefaultErrorInfo,
          Loader: DefaultLoader,
        },
        loading: false,
        data: {},
        modals: [],
        notifications: [],
        routes: {
          '/': '...' as any,
          '/foo': '...' as any,
        },
        trackers: [],
      },
      components: {
        extensions: {},
        menuItems: {},
        modals: {},
        pages: {},
        tiles: {},
        searchProviders: {},
      },
      feeds: {},
      forms: {},
      user: {
        current: undefined,
        features: {},
        permissions: {},
      },
      search: {
        input: '',
        loading: false,
        results: [],
      },
      modules: [],
    });
  });
});
