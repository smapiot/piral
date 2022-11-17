import * as React from 'react';
import create from 'zustand';
import { render } from '@testing-library/react';
import { SetComponent } from './SetComponent';
import { StateContext } from '../state';

const FakeLoading = () => null;
FakeLoading.displayName = 'FakeLoading';

function createMockContainer() {
  const state = create(() => ({
    components: {},
  }));
  return {
    context: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      state,
      setComponent(name, comp) {
        const s = state.getState();
        state.setState({
          ...s,
          components: {
            ...s.components,
            [name]: comp,
          },
        });
      },
    } as any,
  };
}

describe('Piral-Core SetComponent component', () => {
  it('SetComponent sets the layout component in the store', () => {
    const { context } = createMockContainer();
    render(
      <StateContext.Provider value={context}>
        <SetComponent name="LoadingIndicator" component={FakeLoading} />
      </StateContext.Provider>,
    );
    expect(context.state.getState().components).toEqual({
      LoadingIndicator: FakeLoading,
    });
  });
});
