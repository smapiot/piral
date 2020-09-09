import * as React from 'react';
import { mount } from 'enzyme';
import { Atom, swap, deref } from '@dbeining/react-atom';
import { SetLayout } from './SetLayout';
import { StateContext } from '../state/stateContext';

const FakeContainer = () => null;
FakeContainer.displayName = 'FakeContainer';

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

describe('Piral SetLayout component', () => {
  it('SetLayout sets the layout components', () => {
    const { context } = createMockContainer();
    const node = mount(
      <StateContext.Provider value={context}>
        <SetLayout
          layout={
            {
              DashboardContainer: FakeContainer,
            } as any
          }
        />
      </StateContext.Provider>,
    );
    expect(deref<any>(context.state).components).toEqual({
      DashboardContainer: FakeContainer,
    });
  });
});
