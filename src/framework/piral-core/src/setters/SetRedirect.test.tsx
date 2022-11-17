import * as React from 'react';
import create from 'zustand';
import { render } from '@testing-library/react';
import { SetRedirect } from './SetRedirect';
import { StateContext } from '../state';

function createMockContainer() {
  const state = create(() => ({
    routes: {},
  }));
  return {
    context: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      state,
      setRoute(name, comp) {
        const update = (s) => ({
          ...s,
          routes: {
            ...s.routes,
            [name]: comp,
          },
        });
        state.setState(update(state.getState()));
      },
    } as any,
  };
}

describe('Piral-Core SetRedirect component', () => {
  it('SetRedirect sets the redirect route in the store', () => {
    const { context } = createMockContainer();
    render(
      <StateContext.Provider value={context}>
        <SetRedirect from="/foo" to="/bar" />
      </StateContext.Provider>,
    );
    expect(context.state.getState().routes).toEqual({
      '/foo': expect.anything(),
    });
  });
});
