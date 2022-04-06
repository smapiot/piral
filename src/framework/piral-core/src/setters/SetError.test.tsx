import * as React from 'react';
import { mount } from 'enzyme';
import { Atom, swap, deref } from '@dbeining/react-atom';
import { SetError } from './SetError';
import { StateContext } from '../state';

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

describe('Piral-Core SetError component', () => {
  it('SetError sets the error component in the store', () => {
    const { context } = createMockContainer();
    const node = mount(
      <StateContext.Provider value={context}>
        <SetError type="loading" component={FakeError} />
      </StateContext.Provider>,
    );
    expect(deref<any>(context.state).errorComponents).toEqual({
      loading: FakeError,
    });
  });
});
