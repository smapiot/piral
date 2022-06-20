import * as React from 'react';
import create from 'zustand';
import { mount } from 'enzyme';
import { SetErrors } from './SetErrors';
import { StateContext } from '../state/stateContext';

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

describe('Piral SetErrors component', () => {
  it('SetErrors sets the error components', () => {
    const { context } = createMockContainer();
    const node = mount(
      <StateContext.Provider value={context}>
        <SetErrors
          errors={
            {
              menu: FakeError,
            } as any
          }
        />
      </StateContext.Provider>,
    );
    expect(context.state.getState().errorComponents).toEqual({
      menu: FakeError,
    });
  });
});
