/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import { describe, it, expect, vitest } from 'vitest';
import { render, act } from '@testing-library/react';
import { Piral } from './Piral';
import { createInstance } from './createInstance';

import { DefaultErrorInfo } from './defaults/DefaultErrorInfo';
import { DefaultLoadingIndicator } from './defaults/DefaultLoadingIndicator';
import { DefaultLayout } from './defaults/DefaultLayout';
import { DefaultRouteSwitch } from './defaults/DefaultRouteSwitch_v5';
import { DefaultRouter } from './defaults/DefaultRouter_v5';

vitest.mock('../app.codegen', () => ({
  createNavigation: vitest.fn(() => ({
    publicPath: '/',
  })),
  fillDependencies: vitest.fn(),
  integrateDebugger: vitest.fn(),
  integrateEmulator: vitest.fn(),
  publicPath: '/',
  useRouteFilter(routes) {
    return routes;
  },
  createDefaultState() {
    return {
      app: {
        error: undefined,
        loading: typeof window !== 'undefined',
      },
      components: {
        ErrorInfo: DefaultErrorInfo,
        LoadingIndicator: DefaultLoadingIndicator,
        Router: DefaultRouter,
        RouteSwitch: DefaultRouteSwitch,
        Layout: DefaultLayout,
      },
      errorComponents: {},
      registry: {
        extensions: {},
        pages: {},
        wrappers: {},
      },
      routes: {},
      data: {},
      portals: {},
      modules: [],
    };
  },
}));

describe('Piral Component', () => {
  it('renders the Piral instance with default settings', async () => {
    const node = render(<Piral />);
    await act(() => Promise.resolve());
    expect(node.container.childNodes.length).toBe(1);
  });

  it('renders the Piral instance with custom settings', async () => {
    const instance = createInstance();
    const node = render(<Piral instance={instance} />);
    await act(() => Promise.resolve());
    expect(node.container.childNodes.length).toBe(1);
  });
});
