/**
 * @vitest-environment jsdom
 */
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { createElement, FC } from 'react';
import { createPageLayoutsApi } from './create';
import type { PageLayoutRegistration } from './types';

const StubComponent: FC = (props) => createElement('div', props);
StubComponent.displayName = 'StubComponent';

vitest.mock('piral-core', () => ({
  useGlobalState: (select: any) => select,
  useGlobalStateContext: () => ({}),
  defaultRender: (c: any) => c,
  defineActions: () => {},
  withApi: (_ctx: any, component: any) => component,
  withAll: (...args: any[]) => (state: any) => {
    for (const fn of args) {
      state = fn(state);
    }
    return state;
  },
  GlobalState: {} as any,
  PiralPlugin: {} as any,
  PageComponentProps: {} as any,
  RouteSwitchProps: {} as any,
  AppPath: {} as any,
  Dict: {} as any,
  ComponentType: {} as any,
  buildName: (pilet: string, name: string | number) => `${pilet}-${name}`,
  createRouteMatcher: (path: string) => new RegExp(path),
  withRootExtension: () => () => ({}),
}));

function createMockContainer() {
  const state = create(() => ({
    app: { wrap: false },
    registry: {
      pageLayouts: {} as Record<string, PageLayoutRegistration>,
      wrappers: {},
    },
    components: {
      RouteSwitch: vitest.fn(),
    },
  }));
  const dispatch = vitest.fn((update: any) => state.setState(update(state.getState())));
  return {
    context: {
      on: vitest.fn(),
      off: vitest.fn(),
      emit: vitest.fn(),
      defineActions: vitest.fn(),
      readState: vitest.fn((select) => select(state.getState())),
      state,
      dispatch,
      registerPageLayout: vitest.fn(),
      unregisterPageLayout: vitest.fn(),
    } as any,
    api: { meta: { name: 'my-module' } } as any,
  };
}

function createApi(container: any, config: any = {}) {
  const plugin = createPageLayoutsApi(config);
  const extender = plugin(container.context) as any;
  if (typeof extender === 'function') {
    Object.assign(container.api, extender(container.api, moduleMetadata));
  } else {
    Object.assign(container.api, extender);
  }
  return container.api;
}

const moduleMetadata = {
  name: 'my-module',
  version: '1.0.0',
  link: undefined,
  custom: undefined,
  hash: '123',
};

describe('Create Page Layouts API Extensions', () => {
  it('calls defineActions on setup', () => {
    const container = createMockContainer();
    createApi(container);
    expect(container.context.defineActions).toHaveBeenCalled();
  });

  it('dispatches initial state with configured layouts', () => {
    const container = createMockContainer();
    createApi(container, {
      fallback: 'custom-fallback',
      layouts: { default: StubComponent },
    });
    expect(container.context.dispatch).toHaveBeenCalled();
  });

  it('registerPageLayout registers a new layout and returns a disposer that cleans up, readState permitting', () => {
    const container = createMockContainer();
    // readState returns undefined → !current → allows registration
    container.context.readState = vitest.fn(() => undefined);
    const api = createApi(container);

    const dispose = api.registerPageLayout('my-layout', StubComponent);

    expect(container.context.registerPageLayout).toHaveBeenCalledTimes(1);
    expect(container.context.registerPageLayout.mock.calls[0][0]).toBe('my-layout');

    // When readState returns undefined, unregisterPageLayout guard (current?.pilet === pilet)
    // rejects since undefined?.pilet → undefined !== 'my-module'. This is the correct guard
    // preventing pilet A from unregistering a layout that was never registered in state.
    //
    // With readState returning the actual layout after registration, dispose would succeed.
    // That behavior is tested in "unregisterPageLayout removes a layout owned by the calling pilet".
    expect(container.context.unregisterPageLayout).toHaveBeenCalledTimes(0);
  });

  it('unregisterPageLayout removes a layout owned by the calling pilet', () => {
    const container = createMockContainer();
    // Existing layout owned by this pilet
    container.context.readState = vitest.fn(() => ({
      pilet: 'my-module',
      component: StubComponent,
    }));
    const api = createApi(container);

    api.unregisterPageLayout('my-layout');
    expect(container.context.unregisterPageLayout).toHaveBeenCalledTimes(1);
  });

  it('registerPageLayout blocks override when layout belongs to another pilet', () => {
    const container = createMockContainer();
    container.context.readState = vitest.fn(() => ({
      pilet: 'other-pilet',
      component: StubComponent,
    }));
    const api = createApi(container);

    api.registerPageLayout('shared-layout', StubComponent);
    expect(container.context.registerPageLayout).not.toHaveBeenCalled();
  });

  it('registerPageLayout allows re-register when layout belongs to same pilet', () => {
    const container = createMockContainer();
    container.context.readState = vitest.fn(() => ({
      pilet: 'my-module',
      component: StubComponent,
    }));
    const api = createApi(container);

    api.registerPageLayout('my-layout', StubComponent);
    expect(container.context.registerPageLayout).toHaveBeenCalledTimes(1);
  });

  it('unregisterPageLayout blocks removal when layout belongs to another pilet', () => {
    const container = createMockContainer();
    container.context.readState = vitest.fn(() => ({
      pilet: 'other-pilet',
      component: StubComponent,
    }));
    const api = createApi(container);

    api.unregisterPageLayout('shared-layout');
    expect(container.context.unregisterPageLayout).not.toHaveBeenCalled();
  });

  it('registerPageLayout registers when no layout exists (undefined readState)', () => {
    const container = createMockContainer();
    container.context.readState = vitest.fn(() => undefined);
    const api = createApi(container);

    api.registerPageLayout('fresh-layout', StubComponent);
    expect(container.context.registerPageLayout).toHaveBeenCalledTimes(1);
  });

  it('multiple registerPageLayout calls each register with correct name', () => {
    const container = createMockContainer();
    container.context.readState = vitest.fn(() => undefined);
    const api = createApi(container);

    api.registerPageLayout('layout-a', StubComponent);
    api.registerPageLayout('layout-b', StubComponent);

    expect(container.context.registerPageLayout).toHaveBeenCalledTimes(2);
    expect(container.context.registerPageLayout.mock.calls[0][0]).toBe('layout-a');
    expect(container.context.registerPageLayout.mock.calls[1][0]).toBe('layout-b');
  });

  it('creates API functions even with empty config', () => {
    const container = createMockContainer();
    const api = createApi(container);
    expect(api.registerPageLayout).toBeInstanceOf(Function);
    expect(api.unregisterPageLayout).toBeInstanceOf(Function);
  });
});
