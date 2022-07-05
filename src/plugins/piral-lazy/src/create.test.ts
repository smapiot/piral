import create from 'zustand';
import { render } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { createElement, Suspense } from 'react';
import { StateContext } from 'piral-core';
import { createLazyApi } from './create';

function createMockContainer() {
  const state = create(() => ({
    components: {},
    errorComponents: {},
    portals: {},
    registry: {
      wrappers: {},
    },
  }));
  return {
    context: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      defineActions() {},
      state,
      converters: {
        html: ({ component }) => component,
      },
      readState(read) {
        return read(state.getState());
      },
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
    const mount = jest.fn();
    const MyComponent = { component: { mount }, type: 'html' };
    const load = async () => await Promise.resolve(MyComponent);
    const { context, api } = createMockContainer();
    const apiCreator: any = createLazyApi()(context);
    const { fromLazy, defineDependency } = apiCreator(api);
    defineDependency('testName', () => {});
    const LazyComponent = fromLazy(load, ['testName']);
    const container = document.body.appendChild(document.createElement('div'));
    render(
      createElement(
        StateContext.Provider,
        { value: context },
        createElement(Suspense, { fallback: 'anything' }, createElement(LazyComponent)),
      ),
      container,
    );
    await act(() => Promise.resolve());
    expect(LazyComponent).not.toBeUndefined();
  });
});
