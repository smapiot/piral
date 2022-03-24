import { Atom, swap } from '@dbeining/react-atom';
import { render } from 'react-dom';
import { createElement, Suspense } from 'react';
import { createLazyApi } from './create';
import { act } from 'react-dom/test-utils';

function createMockContainer() {
  const state = Atom.of({});
  return {
    context: {
      converters: {},
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      defineActions() {},
      state,
      readState(read) {
        return read(state);
      },
      dispatch(update) {
        swap(state, update);
      },
    } as any,
    api: {} as any,
  };
}

const mount = jest.fn();
const MyComponent = { component: { mount }, type: 'html' };

describe('Piral-Lazy create module', () => {
  it('appends lazy loading for a DOM component', async () => {
    const load = async () => await Promise.resolve(MyComponent);
    const { context, api } = createMockContainer();
    const apiCreator: any = createLazyApi()(context);
    const { fromLazy, defineDependency } = apiCreator(api);
    defineDependency('testName', () => {});
    const LazyComponent = fromLazy(load, ['testName']);
    render(
      createElement(Suspense, { fallback: 'anything' }, createElement(LazyComponent)),
      document.body.appendChild(document.createElement('div')),
    );
    await act(() => Promise.resolve());
    expect(LazyComponent).not.toBeUndefined();
  });
});
