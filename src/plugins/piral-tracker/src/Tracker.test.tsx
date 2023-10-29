/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { render } from '@testing-library/react';
import { StateContext } from 'piral-core';
import { Tracker } from './Tracker';

function createMockContainer(trackers = {}) {
  const state = create(() => ({
    registry: {
      trackers,
    },
  }));
  return {
    context: {
      on: vitest.fn(),
      off: vitest.fn(),
      emit: vitest.fn(),
      defineActions() {},
      state,
      readState(read) {
        return read(state.getState());
      },
      dispatch(update) {
        state.setState(update(state.getState()));
      },
    } as any,
    api: {} as any,
  };
}

describe('Piral-Tracker Tracker component', () => {
  it('uses container for connected trackers', () => {
    const fake: any = {};
    const { context } = createMockContainer();
    const node = render(
      <StateContext.Provider value={context}>
        <Tracker {...fake} />
      </StateContext.Provider>,
    );
    expect(node.queryAllByRole('list').length).toBe(0);
  });

  it('uses container and tracker of connected trackers', () => {
    const fake: any = {};
    const { context } = createMockContainer({
      foo: {
        component: () => <ul />,
        preferences: {},
      },
      bar: {
        component: () => <ol />,
        preferences: {},
      },
    });
    const node = render(
      <StateContext.Provider value={context}>
        <Tracker {...fake} />
      </StateContext.Provider>,
    );
    expect(node.getAllByRole('list').length).toBe(2);
  });
});
