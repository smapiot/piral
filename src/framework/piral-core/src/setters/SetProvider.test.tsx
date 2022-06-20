import * as React from 'react';
import create from 'zustand';
import { mount } from 'enzyme';
import { SetProvider } from './SetProvider';
import { StateContext } from '../state';

const FakeProvider = () => null;
FakeProvider.displayName = 'FakeProvider';

function createMockContainer() {
  const state = create(() => ({
    providers: [],
  }));
  return {
    context: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      state,
      includeProvider(provider) {
        const update = (s) => ({
          ...s,
          providers: [...s.providers, provider],
        });
        state.setState(update(state.getState()));
      },
    } as any,
  };
}

describe('Piral-Core SetProvider component', () => {
  it('SetProvider uses the includeProvider action', () => {
    const { context } = createMockContainer();
    const provider = <FakeProvider />;
    const node = mount(
      <StateContext.Provider value={context}>
        <SetProvider provider={provider} />
      </StateContext.Provider>,
    );
    expect(context.state.getState().providers).toEqual([provider]);
  });
});
