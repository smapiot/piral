import * as React from 'react';
import { mount } from 'enzyme';
import { Atom, swap, deref } from '@dbeining/react-atom';
import { SetErrors } from './SetErrors';
import { StateContext } from '../state/stateContext';

const FakeError = () => null;
FakeError.displayName = 'FakeError';

function createMockContainer() {
  const state = Atom.of({
    errorComponents: {},
  });
  return {
    context: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      state,
      setErrorComponent(name, comp) {
        swap(state, (s) => ({
          ...s,
          errorComponents: {
            ...s.errorComponents,
            [name]: comp,
          },
        }));
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
    expect(deref<any>(context.state).errorComponents).toEqual({
      menu: FakeError,
    });
  });
});
