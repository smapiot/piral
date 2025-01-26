/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { render, act } from '@testing-library/react';
import { StateContext } from 'piral-core';
import { createLazyApi } from './create';

vitest.mock('piral-core/app.codegen', () => ({
  applyStyle: vitest.fn(),
  fillDependencies: vitest.fn(),
}));

function createMockContainer() {
  const state = create(() => ({
    app: {
      publicPath: '/',
    },
    components: {},
    errorComponents: {},
    portals: {},
    registry: {
      wrappers: {},
    },
  }));
  return {
    context: {
      on: vitest.fn(),
      off: vitest.fn(),
      emit: vitest.fn(),
      defineActions() {},
      state,
      converters: {
        html: ({ component }) => component,
      },
      navigation: {
        router: undefined,
      },
      readState(read) {
        return read(state.getState());
      },
      destroyPortal() {},
      dispatch(update) {
        state.setState(update(state.getState()));
      },
    } as any,
    api: {
      meta: {
        name: 'sample-pilet',
      },
    } as any,
  };
}

describe('Piral-Lazy create module', () => {
  it('appends lazy loading for a DOM component', async () => {
    const mount = vitest.fn();
    const MyComponent = { component: { mount }, type: 'html' };
    const load = async () => await Promise.resolve(MyComponent);
    const { context, api } = createMockContainer();
    const apiCreator: any = createLazyApi()(context);
    const { fromLazy, defineDependency } = apiCreator(api);
    defineDependency('testName', () => {});
    const LazyComponent = fromLazy(load, ['testName']);
    render(
      <StateContext.Provider value={context}>
        <React.Suspense fallback="anything">
          <LazyComponent />
        </React.Suspense>
      </StateContext.Provider>,
    );
    await act(() => Promise.resolve());
    expect(LazyComponent).not.toBeUndefined();
  });
});
