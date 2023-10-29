/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import create from 'zustand';
import { describe, it, expect, vitest, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { StateContext } from 'piral-core';
import { Dashboard } from './Dashboard';

const MockDbContainer: React.FC<any> = ({ children }) => <ul>{children}</ul>;
MockDbContainer.displayName = 'MockDbContainer';
const MockDbTile: React.FC<any> = ({ children }) => <li>{children}</li>;
MockDbTile.displayName = 'MockDbTile';

function createMockContainer(tiles = {}) {
  const state = create(() => ({
    components: {
      DashboardContainer: MockDbContainer,
      DashboardTile: MockDbTile,
    },
    registry: {
      tiles,
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

describe('Piral-Dashboard Dashboard component', () => {
  afterEach(() => {
    cleanup();
  });

  it('uses container for a connected dashboard', () => {
    const fake: any = {};
    const { context } = createMockContainer();
    const node = render(
      <StateContext.Provider value={context}>
        <Dashboard {...fake} />
      </StateContext.Provider>,
    );
    expect(node.getAllByRole('list').length).toBe(1);
    expect(node.queryByRole('listitem')).toBe(null);
  });

  it('uses container and tile for each tile of a connected dashboard', () => {
    const fake: any = {};
    const { context } = createMockContainer({
      foo: {
        component: () => <div />,
        preferences: {},
      },
      bar: {
        component: () => <div />,
        preferences: {},
      },
    });
    const node = render(
      <StateContext.Provider value={context}>
        <Dashboard {...fake} />
      </StateContext.Provider>,
    );
    expect(node.getAllByRole('list').length).toBe(1);
    expect(node.getAllByRole('listitem').length).toBe(2);
  });
});
