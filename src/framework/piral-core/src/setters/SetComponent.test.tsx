import * as React from 'react';
import { mount } from 'enzyme';
import { Atom, swap, deref } from '@dbeining/react-atom';
import { SetComponent } from './SetComponent';
import { StateContext } from '../state';

const FakeLoading = () => null;
FakeLoading.displayName = 'FakeLoading';

function createMockContainer() {
  const state = Atom.of({
    components: {},
  });
  return {
    context: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      state,
      setComponent(name, comp) {
        swap(state, (s) => ({
          ...s,
          components: {
            ...s.components,
            [name]: comp,
          },
        }));
      },
    } as any,
  };
}

describe('Piral-Core SetComponent component', () => {
  it('SetComponent sets the layout component in the store', () => {
    const { context } = createMockContainer();
    const node = mount(
      <StateContext.Provider value={context}>
        <SetComponent name="LoadingIndicator" component={FakeLoading} />
      </StateContext.Provider>,
    );
    expect(deref<any>(context.state).components).toEqual({
      LoadingIndicator: FakeLoading,
    });
  });
});
