import * as React from 'react';
import create from 'zustand';
import { mount } from 'enzyme';
import { StateContext } from 'piral-core';
import { Dashboard } from './Dashboard';

const MockDbContainer: React.FC<any> = ({ children }) => <div>{children}</div>;
MockDbContainer.displayName = 'MockDbContainer';
const MockDbTile: React.FC<any> = ({ children }) => <div>{children}</div>;
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
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
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
  it('uses container for a connected dashboard', () => {
    const fake: any = {};
    const { context } = createMockContainer();
    const node = mount(
      <StateContext.Provider value={context}>
        <Dashboard {...fake} />
      </StateContext.Provider>,
    );
    expect(node.find(MockDbContainer).length).toBe(1);
    expect(node.find(MockDbTile).length).toBe(0);
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
    const node = mount(
      <StateContext.Provider value={context}>
        <Dashboard {...fake} />
      </StateContext.Provider>,
    );
    expect(node.find(MockDbContainer).length).toBe(1);
    expect(node.find(MockDbTile).length).toBe(2);
  });
});
