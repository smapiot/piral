import * as React from 'react';
import create from 'zustand';
import { render } from '@testing-library/react';
import { SetRoute } from './SetRoute';
import { StateContext } from '../state';

const FakeRoute = () => null;
FakeRoute.displayName = 'FakeRoute';

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

describe('Piral-Core SetRoute component', () => {
  it('SetRoute sets the link route in the store', () => {
    const { context } = createMockContainer();
    render(
      <StateContext.Provider value={context}>
        <SetRoute path="/foo" component={FakeRoute} />
      </StateContext.Provider>,
    );
    expect(context.state.getState().routes).toEqual({
      '/foo': FakeRoute,
    });
  });
});
