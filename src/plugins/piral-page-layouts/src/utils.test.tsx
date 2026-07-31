/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import { createElement, FC } from 'react';
import { describe, it, expect, vitest, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { getPageLayouts, withPageLayouts } from './utils';

// --- Mocks ------------------------------------------------------------------

let mockNavigationPath = '/';
const mockNavigationListeners: Array<() => void> = [];

vitest.mock('piral-core', async () => {
  const actual = await vitest.importActual('piral-core') as any;
  return {
    ...actual,
    useGlobalState: (select: any) => select(mockGlobalState),
    useGlobalStateContext: () => ({
      navigation: {
        path: mockNavigationPath,
        listen: (cb: () => void) => {
          mockNavigationListeners.push(cb);
          return () => {
            const idx = mockNavigationListeners.indexOf(cb);
            if (idx !== -1) mockNavigationListeners.splice(idx, 1);
          };
        },
      },
    }),
    defaultRender: (child: any, key?: string) =>
      createElement('span', { 'data-testid': 'default-render', key }, child),
    GlobalState: {} as any,
  };
});

// --- State ------------------------------------------------------------------

let mockGlobalState: any;

const DefaultLayout: FC = (props) => createElement('div', { 'data-testid': 'default-layout' }, props.children);
const AdminLayout: FC = (props) => createElement('div', { 'data-testid': 'admin-layout' }, props.children);
const GuestLayout: FC = (props) => createElement('div', { 'data-testid': 'guest-layout' }, props.children);

const StubRoutes: FC = () => createElement('div', { 'data-testid': 'routes' }, 'Routes');
const NotFound: FC = () => createElement('div', { 'data-testid': 'not-found' }, 'Not Found');

// ---------------------------------------------------------------------------

describe('getPageLayouts', () => {
  it('converts component record to PageLayoutRegistration dict', () => {
    const result = getPageLayouts({ default: DefaultLayout, admin: AdminLayout });
    expect(result).toEqual({
      default: { pilet: undefined, component: DefaultLayout },
      admin: { pilet: undefined, component: AdminLayout },
    });
  });

  it('returns empty object for null input', () => {
    expect(getPageLayouts(null as any)).toEqual({});
  });

  it('returns empty object for undefined input', () => {
    expect(getPageLayouts(undefined as any)).toEqual({});
  });

  it('returns empty object for non-object input', () => {
    expect(getPageLayouts('string' as any)).toEqual({});
    expect(getPageLayouts(42 as any)).toEqual({});
    expect(getPageLayouts(true as any)).toEqual({});
  });

  it('returns empty object for empty object', () => {
    expect(getPageLayouts({})).toEqual({});
  });

  it('preserves component identity', () => {
    const result = getPageLayouts({ foo: DefaultLayout });
    expect(result.foo.component).toBe(DefaultLayout);
  });
});

describe('withPageLayouts', () => {
  beforeEach(() => {
    mockGlobalState = {
      components: { RouteSwitch: StubRoutes },
      registry: { pageLayouts: {} },
    };
  });

  it('wraps RouteSwitch with the given fallback', () => {
    const layouts = getPageLayouts({ admin: AdminLayout });
    const updater = withPageLayouts(layouts, 'admin');
    const newState = updater(mockGlobalState);
    expect(newState.components.RouteSwitch).not.toBe(StubRoutes);
    expect(newState.registry.pageLayouts).toEqual(layouts);
  });

  it('does not mutate the original state', () => {
    const layouts = getPageLayouts({ guest: GuestLayout });
    const updater = withPageLayouts(layouts, 'guest');
    const originalComponents = mockGlobalState.components;
    const originalRegistry = mockGlobalState.registry;
    updater(mockGlobalState);
    expect(mockGlobalState.components).toBe(originalComponents);
    expect(mockGlobalState.registry).toBe(originalRegistry);
  });

  it('preserves other state fields', () => {
    const layouts = getPageLayouts({});
    const updater = withPageLayouts(layouts, 'default');
    const stateWithExtra = { ...mockGlobalState, foo: 'bar' as any };
    const result = updater(stateWithExtra);
    expect((result as any).foo).toBe('bar');
  });

  it('injects pageLayouts into registry', () => {
    const layouts = getPageLayouts({ admin: AdminLayout, guest: GuestLayout });
    const updater = withPageLayouts(layouts, 'guest');
    const newState = updater(mockGlobalState);
    expect(newState.registry.pageLayouts).toBe(layouts);
  });
});

describe('createPageWrapper (rendering)', () => {
  beforeEach(() => {
    mockNavigationPath = '/';
    mockNavigationListeners.length = 0;
    mockGlobalState = {
      components: {
        RouteSwitch: StubRoutes,
      },
      registry: {
        pageLayouts: {
          default: { pilet: undefined, component: DefaultLayout },
          admin: { pilet: undefined, component: AdminLayout },
        },
      },
    };
  });

  afterEach(() => {
    cleanup();
  });

  function makePath(path: string, matcher: RegExp, meta: any = {}) {
    return { path, matcher, meta, Component: null };
  }

  function mountWrapper(fallback = 'default') {
    const layouts = getPageLayouts(mockGlobalState.registry.pageLayouts);
    const updater = withPageLayouts(layouts as any, fallback);
    const newState = updater(mockGlobalState);
    const WrappedSwitch = newState.components.RouteSwitch;
    const paths = [
      makePath('/', /^\/$/, { layout: 'default' }),
      makePath('/admin', /^\/admin(\/|$)/, { layout: 'admin' }),
      makePath('/guest', /^\/guest(\/|$)/, {}),
    ];
    return render(createElement(WrappedSwitch as any, { paths, NotFound, navigation: {} }));
  }

  // --- Initial render tests (before any navigation) ---

  it('renders layout matching initial navigation.path', () => {
    mockNavigationPath = '/';
    const { getByTestId } = mountWrapper();
    expect(getByTestId('default-layout')).toBeTruthy();
  });

  it('renders admin layout when path starts on /admin', () => {
    mockNavigationPath = '/admin';
    const { getByTestId } = mountWrapper();
    expect(getByTestId('admin-layout')).toBeTruthy();
  });

  it('falls back to default when no layout meta exists on the matched route', () => {
    mockNavigationPath = '/guest';
    const { getByTestId } = mountWrapper();
    expect(getByTestId('default-layout')).toBeTruthy();
  });

  it('falls back to defaultRender when no layout registered at all', () => {
    mockGlobalState.registry.pageLayouts = {};
    mockNavigationPath = '/nowhere';
    const { getByTestId } = mountWrapper();
    expect(getByTestId('default-render')).toBeTruthy();
    expect(getByTestId('routes')).toBeTruthy();
  });

  // --- Router-agnostic path detection ---

  it('reads navigation.path directly (not { location } from callback) for initial path', () => {
    mockNavigationPath = '/some-custom';
    const { getByTestId } = mountWrapper();
    // Falls to default since /some-custom doesn't match admin
    expect(getByTestId('default-layout')).toBeTruthy();
  });

  // --- Listener lifecycle ---

  it('registers navigation listener on mount', () => {
    const { unmount } = mountWrapper();
    expect(mockNavigationListeners.length).toBeGreaterThanOrEqual(1);
    unmount();
  });

  it('unregisters navigation listener on unmount', () => {
    const { unmount } = mountWrapper();
    const countBefore = mockNavigationListeners.length;
    unmount();
    expect(mockNavigationListeners.length).toBe(countBefore - 1);
  });

  it('wraps children (Routes) inside the layout component', () => {
    mockNavigationPath = '/admin';
    const { getByTestId } = mountWrapper();
    const admin = getByTestId('admin-layout');
    expect(admin.contains(getByTestId('routes'))).toBe(true);
  });
});
