import * as React from 'react';
import { mount } from 'enzyme';
import { StateContext } from 'piral-core';
import { Atom, swap, deref } from '@dbeining/react-atom';
import { createContainersApi } from './create';

function createMockContainer() {
  const state = Atom.of({});
  return {
    context: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      defineActions(actions) {
        for (const actionName of Object.keys(actions)) {
          this[actionName] = actions[actionName].bind(this, this);
        }
      },
      state,
      readState(read) {
        return read(deref(state));
      },
      dispatch(update) {
        swap(state, update);
      },
    } as any,
    api: {} as any,
  };
}

describe('Piral-Containers create module', () => {
  it('creates an empty container', () => {
    const { context } = createMockContainer();
    const creator: any = createContainersApi()(context);
    const api = creator(undefined, {
      name: 'test',
    });
    const connect = api.createState({
      state: {
        count: 0,
      },
      actions: {
        increment(dispatch) {
          dispatch(state => ({
            count: state.count + 1,
          }));
        },
      },
    });

    const MyComponent = () => null;
    MyComponent.displayName = 'MyComponent';
    const ConnectedComponent = connect(MyComponent);
    const node = mount(
      <StateContext.Provider value={context}>
        <ConnectedComponent />
      </StateContext.Provider>,
    );
    const instance = node.find(MyComponent);

    expect(instance.length).toBe(1);
    expect(instance.prop('state')).toEqual({
      count: 0,
    });
    expect(Object.keys(instance.prop('actions'))).toEqual(['increment']);
  });
});
