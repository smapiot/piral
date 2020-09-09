import * as React from 'react';
import { mount } from 'enzyme';
import { Atom, swap, deref } from '@dbeining/react-atom';
import { SetProvider } from './SetProvider';
import { StateContext } from '../state';

const FakeProvider = () => null;
FakeProvider.displayName = 'FakeProvider';

function createMockContainer() {
  const state = Atom.of({
    providers: [],
  });
  return {
    context: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      state,
      includeProvider(provider) {
        swap(state, (s) => ({
          ...s,
          providers: [...s.providers, provider],
        }));
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
    expect(deref<any>(context.state).providers).toEqual([provider]);
  });
});
