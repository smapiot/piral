/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { StateContext } from 'piral-core';
import { createContainersApi } from './create';

function createMockContainer() {
  const state = create(() => ({}));
  return {
    context: {
      on: vitest.fn(),
      off: vitest.fn(),
      emit: vitest.fn(),
      defineActions(actions) {
        for (const actionName of Object.keys(actions)) {
          this[actionName] = actions[actionName].bind(this, this);
        }
      },
      state,
      readState(read) {
        return read(state.getState());
      },
      dispatch(update) {
        state.setState(update(state.getState()));
      },
    } as any,
    api: {} as any,
  };
}

describe('Piral-Containers create module', () => {
  it('creates an empty container', () => {
    const { context } = createMockContainer();
    const creator: any = createContainersApi()(context);
    const api = creator(undefined, {
      name: 'test',
    });
    const connect = api.createState({
      state: {
        count: 0,
      },
      actions: {
        increment(dispatch) {
          dispatch((state) => ({
            count: state.count + 1,
          }));
        },
      },
    });

    const MyComponent = ({ state, actions }) => (
      <button role="button" onClick={actions.increment}>
        {state.count}
      </button>
    );
    MyComponent.displayName = 'MyComponent';
    const ConnectedComponent = connect(MyComponent);
    const node = render(
      <StateContext.Provider value={context}>
        <ConnectedComponent />
      </StateContext.Provider>,
    );
    const button = node.getByRole('button');
    expect(button.textContent).toEqual('0');
    fireEvent.click(button);
    expect(button.textContent).toEqual('1');
  });
});
