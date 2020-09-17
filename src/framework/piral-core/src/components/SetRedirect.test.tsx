import * as React from 'react';
import { mount } from 'enzyme';
import { Atom, swap, deref } from '@dbeining/react-atom';
import { SetRedirect } from './SetRedirect';
import { StateContext } from '../state';

function createMockContainer() {
  const state = Atom.of({
    routes: {},
  });
  return {
    context: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      state,
      setRoute(name, comp) {
        swap(state, (s) => ({
          ...s,
          routes: {
            ...s.routes,
            [name]: comp,
          },
        }));
      },
    } as any,
  };
}

describe('Piral-Core SetRedirect component', () => {
  it('SetRedirect sets the redirect route in the store', () => {
    const { context } = createMockContainer();
    const node = mount(
      <StateContext.Provider value={context}>
        <SetRedirect from="/foo" to="/bar" />
      </StateContext.Provider>,
    );
    expect(deref<any>(context.state).routes).toEqual({
      '/foo': expect.anything(),
    });
  });
});
