import * as React from 'react';
import { Mediator } from './Mediator';
import { Atom, swap, deref } from '@dbeining/react-atom';
import { mount } from 'enzyme';
import { StateContext } from '../state';
import { PiletMetadata } from '../types';

function createMockContainer() {
  const state = Atom.of({
    app: {
      layout: 'tablet',
      loading: false,
      error: undefined,
    },
  });
  return {
    context: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      state,
      dispatch(update) {
        swap(state, update);
      },
      readState(select) {
        return select(deref(state));
      },
      initialize(loading, error, modules) {
        swap(state, (state) => ({
          ...state,
          app: {
            ...state.app,
            error,
            loading,
          },
          modules,
        }));
      },
    } as any,
  };
}

describe('Component Mediator', () => {
  it('Create mediator component.', () => {
    const options = {
      createApi: jest.fn(),
      fetchPilets: () => {
        return new Promise<Array<PiletMetadata>>((resolve) => resolve([]));
      },
    };
    const { context } = createMockContainer();
    const node = mount(
      <StateContext.Provider value={context}>
        <Mediator options={options} />
      </StateContext.Provider>,
    );
    expect(deref<any>(context.state).app.layout).toEqual('tablet');
  });
});
