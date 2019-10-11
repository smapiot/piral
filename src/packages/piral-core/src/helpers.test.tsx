import { setupState } from './helpers';
import { DefaultErrorInfo, DefaultLoader } from './components/default';

jest.mock('history', () => ({
  createBrowserHistory: () => ({}),
}));

describe('Helper Module', () => {
  window.matchMedia = jest.fn(q => ({ matches: false })) as any;

  it('global state works with language as empty string', () => {
    const globalState = setupState({});
    expect(globalState).toEqual({
      app: {
        layout: 'desktop',
        components: {
          ErrorInfo: DefaultErrorInfo,
          Loader: DefaultLoader,
          history: {},
        },
        routes: {},
      },
    });
  });

  it('global state with custom language and translations', () => {
    const globalState = setupState({});
    expect(globalState).toEqual({
      app: {
        layout: 'desktop',
        components: {
          ErrorInfo: DefaultErrorInfo,
          Loader: DefaultLoader,
          history: {},
        },
        routes: {},
      },
    });
  });

  it('global state with non-default breakpoints and more routes', () => {
    const routes = {
      '/': '...' as any,
      '/foo': '...' as any,
    };
    const globalState = setupState({ routes });
    expect(globalState).toEqual({
      app: {
        layout: 'desktop',
        components: {
          ErrorInfo: DefaultErrorInfo,
          Loader: DefaultLoader,
          history: {},
        },
        routes,
      },
    });
  });
});
