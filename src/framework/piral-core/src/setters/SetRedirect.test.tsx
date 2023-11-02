/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { render } from '@testing-library/react';
import { SetRedirect } from './SetRedirect';
import { StateContext } from '../state';

vitest.mock('../../app.codegen', () => ({
  createRedirect(to) {
    return to;
  },
}));

function createMockContainer() {
  const state = create(() => ({
    routes: {},
  }));
  return {
    context: {
      on: vitest.fn(),
      off: vitest.fn(),
      emit: vitest.fn(),
      state,
      setRoute(name, comp) {
        const update = (s) => ({
          ...s,
          routes: {
            ...s.routes,
            [name]: comp,
          },
        });
        state.setState(update(state.getState()));
      },
    } as any,
  };
}

describe('Piral-Core SetRedirect component', () => {
  it('SetRedirect sets the redirect route in the store', () => {
    const { context } = createMockContainer();
    render(
      <StateContext.Provider value={context}>
        <SetRedirect from="/foo" to="/bar" />
      </StateContext.Provider>,
    );
    expect(context.state.getState().routes).toEqual({
      '/foo': expect.anything(),
    });
  });
});
