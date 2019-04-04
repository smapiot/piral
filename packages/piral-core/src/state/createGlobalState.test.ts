import { deref } from '@dbeining/react-atom';
import { createGlobalState } from './createGlobalState';
import { DefaultDashboard, DefaultErrorInfo, DefaultLoader } from '../components/default';
import { defaultBreakpoints } from '../utils';
import { LayoutBreakpoints } from '../types';

describe('Create Global State Module', () => {
  window.matchMedia = jest.fn(q => ({ matches: false })) as any;

  it('global state can be created without arguments', () => {
    const globalState = createGlobalState();
    expect(deref(globalState)).toEqual({
      app: {
        language: {
          selected: 'en',
          available: [],
          translations: {},
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
        data: {},
        modals: [],
        notifications: [],
        routes: {},
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
    });
  });

  it('global state with custom language and translations', () => {
    const translations = { de: {}, fr: {}, en: {} };
    const globalState = createGlobalState({ language: 'fr', translations });
    expect(deref(globalState)).toEqual({
      app: {
        language: {
          selected: 'fr',
          available: ['de', 'fr', 'en'],
          translations,
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
        data: {},
        modals: [],
        notifications: [],
        routes: {},
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
    });
  });

  it('global state with non-default breakpoints and more routes', () => {
    const translations = { de: {}, en: {} };
    const routes = {
      '/': '...' as any,
      '/foo': '...' as any,
    };
    const breakpoints: LayoutBreakpoints = ['12px', '24px', '360px'];
    const globalState = createGlobalState({ translations, breakpoints, routes });
    expect(deref(globalState)).toEqual({
      app: {
        language: {
          selected: 'en',
          available: ['de', 'en'],
          translations,
        },
        layout: {
          current: 'desktop',
          breakpoints,
        },
        components: {
          Dashboard: DefaultDashboard,
          ErrorInfo: DefaultErrorInfo,
          Loader: DefaultLoader,
        },
        data: {},
        modals: [],
        notifications: [],
        routes,
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
    });
  });
});
