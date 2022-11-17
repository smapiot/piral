import * as React from 'react';
import create from 'zustand';
import { render } from '@testing-library/react';
import { Mediator } from './Mediator';
import { StateContext } from '../state';
import { PiletMetadata } from '../types';

function createMockContainer() {
  const state = create(() => ({
    app: {
      layout: 'tablet',
      loading: false,
      error: undefined,
    },
  }));
  return {
    context: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      state,
      dispatch(update) {
        state.setState(update(state.getState()));
      },
      readState(select) {
        return select(state.getState());
      },
      initialize(loading, error, modules) {
        const s = state.getState();
        state.setState({
          ...s,
          app: {
            ...s.app,
            error,
            loading,
          },
          modules,
        } as any);
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
    render(
      <StateContext.Provider value={context}>
        <Mediator options={options} />
      </StateContext.Provider>,
    );
    expect(context.state.getState().app.layout).toEqual('tablet');
  });
});
