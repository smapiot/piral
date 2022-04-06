import * as React from 'react';
import { mount } from 'enzyme';
import { Atom, swap, deref } from '@dbeining/react-atom';
import { SetRoute } from './SetRoute';
import { StateContext } from '../state';

const FakeRoute = () => null;
FakeRoute.displayName = 'FakeRoute';

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

describe('Piral-Core SetRoute component', () => {
  it('SetRoute sets the link route in the store', () => {
    const { context } = createMockContainer();
    const node = mount(
      <StateContext.Provider value={context}>
        <SetRoute path="/foo" component={FakeRoute} />
      </StateContext.Provider>,
    );
    expect(deref<any>(context.state).routes).toEqual({
      '/foo': FakeRoute,
    });
  });
});
