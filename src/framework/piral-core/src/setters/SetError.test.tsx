import * as React from 'react';
import create from 'zustand';
import { render } from '@testing-library/react';
import { SetError } from './SetError';
import { StateContext } from '../state';

const FakeError = () => null;
FakeError.displayName = 'FakeError';

function createMockContainer() {
  const state = create(() => ({
    errorComponents: {},
  }));
  return {
    context: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      state,
      setErrorComponent(name, comp) {
        const s = state.getState();
        state.setState({
          ...s,
          errorComponents: {
            ...s.errorComponents,
            [name]: comp,
          },
        });
      },
    } as any,
  };
}

describe('Piral-Core SetError component', () => {
  it('SetError sets the error component in the store', () => {
    const { context } = createMockContainer();
    render(
      <StateContext.Provider value={context}>
        <SetError type="loading" component={FakeError} />
      </StateContext.Provider>,
    );
    expect((context.state.getState()).errorComponents).toEqual({
      loading: FakeError,
    });
  });
});
