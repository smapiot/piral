import * as React from 'react';
import create from 'zustand';
import { StateContext } from 'piral-core';
import { render, fireEvent } from '@testing-library/react';
import { Modals } from './Modals';

function createMockContainer(registeredModals: Record<string, any>, openModals: Array<any>) {
  const state = create(() => ({
    components: {
      ModalsHost: ({ open, children, close }) => (
        <div role="host">
          {open && (
            <div role="overlay">
              <button role="close" onClick={close}>
                Close
              </button>
              {children}
            </div>
          )}
        </div>
      ),
    },
    registry: {
      modals: registeredModals,
    },
    modals: openModals,
  }));
  return {
    context: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      defineActions() {},
      converters: {},
      readState(select) {
        return select(state.getState());
      },
      state,
      dispatch(update) {
        state.setState(update(state.getState()));
      },
    } as any,
    api: {} as any,
  };
}

describe('Modals Component Shell Module', () => {
  it('Should display nothing is nothing is there', () => {
    const { context } = createMockContainer({}, []);
    const node = render(
      <StateContext.Provider value={context}>
        <Modals />
      </StateContext.Provider>,
    );
    expect(node.queryByRole('overlay')).toBe(null);
  });

  it('Should display something if something is there and wanted', () => {
    const { context } = createMockContainer(
      {
        foo: {
          component: () => <div />,
        },
      },
      [
        {
          name: 'foo',
          options: {},
        },
      ],
    );
    const node = render(
      <StateContext.Provider value={context}>
        <Modals />
      </StateContext.Provider>,
    );
    expect(node.queryByRole('overlay')).not.toBe(null);
  });

  it('Should display nothing if something is there and not wanted', () => {
    const { context } = createMockContainer(
      {
        foo: {
          component: () => <div />,
        },
      },
      [],
    );
    const node = render(
      <StateContext.Provider value={context}>
        <Modals />
      </StateContext.Provider>,
    );
    expect(node.queryByRole('overlay')).toBe(null);
  });

  it('Should display something if something is there and wanted even indirectly', () => {
    const { context } = createMockContainer(
      {
        'abc:foo': {
          component: () => <div />,
          name: 'bar',
        },
      },
      [
        {
          name: 'xyz:foo',
          alternative: 'bar',
          options: {},
        },
      ],
    );
    const node = render(
      <StateContext.Provider value={context}>
        <Modals />
      </StateContext.Provider>,
    );
    expect(node.queryByRole('overlay')).not.toBe(null);
  });

  it('Should display nothing is something is there and not wanted with indirection', () => {
    const { context } = createMockContainer(
      {
        'abc:foo': {
          component: () => <div />,
          name: 'qxz',
        },
      },
      [
        {
          name: 'xyz:foo',
          alternative: 'bar',
          options: {},
        },
      ],
    );
    const node = render(
      <StateContext.Provider value={context}>
        <Modals />
      </StateContext.Provider>,
    );
    expect(node.queryByRole('overlay')).toBe(null);
  });

  it('Should display nothing if nothing is available even if wanted', () => {
    const { context } = createMockContainer({}, [
      {
        name: 'foo',
        options: {},
      },
    ]);
    const node = render(
      <StateContext.Provider value={context}>
        <Modals />
      </StateContext.Provider>,
    );
    expect(node.queryByRole('overlay')).toBe(null);
  });

  it('Should close all available dialogs', () => {
    const close = jest.fn();
    const { context } = createMockContainer(
      {
        foo: {
          component: () => <div />,
        },
        bar: {
          component: () => <div />,
        },
      },
      [
        {
          name: 'foo',
          options: {},
          close,
        },
        {
          name: 'bar',
          options: {},
          close,
        },
      ],
    );
    const node = render(
      <StateContext.Provider value={context}>
        <Modals />
      </StateContext.Provider>,
    );
    expect(close).toHaveBeenCalledTimes(0);
    fireEvent.click(node.getByRole('close'));
    expect(close).toHaveBeenCalledTimes(2);
  });
});
