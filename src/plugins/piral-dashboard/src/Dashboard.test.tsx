import * as React from 'react';
import { mount } from 'enzyme';
import { StateContext } from 'piral-core';
import { Atom, swap, deref } from '@dbeining/react-atom';
import { Dashboard } from './Dashboard';

const MockDbContainer: React.FC = ({ children }) => <div>{children}</div>;
MockDbContainer.displayName = 'MockDbContainer';
const MockDbTile: React.FC = ({ children }) => <div>{children}</div>;
MockDbTile.displayName = 'MockDbTile';

function createMockContainer(tiles = {}) {
  const state = Atom.of({
    components: {
      DashboardContainer: MockDbContainer,
      DashboardTile: MockDbTile,
    },
    registry: {
      tiles,
    },
  });
  return {
    context: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      defineActions() {},
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
