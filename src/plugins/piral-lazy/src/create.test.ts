import { Atom, swap, deref } from '@dbeining/react-atom';
import { createRoot } from 'react-dom/client';
import { createElement, Suspense } from 'react';
import { StateContext } from 'piral-core';
import { createLazyApi } from './create';
import { act } from 'react-dom/test-utils';

function createMockContainer() {
  const state = Atom.of({
    components: {},
    errorComponents: {},
    registry: {
      wrappers: {},
    },
  });
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
        return read(deref(state));
      },
      dispatch(update) {
        swap(state, update);
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
    const root = createRoot(document.body.appendChild(document.createElement('div')));
    root.render(
      createElement(
        StateContext.Provider,
        { value: context },
        createElement(Suspense, { fallback: 'anything' }, createElement(LazyComponent)),
      ),
    );
    await act(() => Promise.resolve());
    expect(LazyComponent).not.toBeUndefined();
  });
});
