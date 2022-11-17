import create from 'zustand';
import * as React from 'react';
import { render } from '@testing-library/react';
import { StateContext } from 'piral-core';
import { Menu } from './Menu';

const MockMenuContainer: React.FC<any> = ({ children }) => <div role="menu">{children}</div>;
MockMenuContainer.displayName = 'MockMenuContainer';
const MockMenuItem: React.FC<any> = ({ children }) => <div role="item">{children}</div>;
MockMenuItem.displayName = 'MockMenuItem';

function createMockContainer(menuItems = {}) {
  const state = create(() => ({
    components: {
      MenuContainer: MockMenuContainer,
      MenuItem: MockMenuItem,
    },
    registry: {
      menuItems,
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

describe('Piral-Menu Menu component', () => {
  it('uses container for a connected menu', () => {
    const fake: any = {
      type: '1',
    };
    const { context } = createMockContainer();
    const node = render(
      <StateContext.Provider value={context}>
        <Menu {...fake} />
      </StateContext.Provider>,
    );
    expect(node.getAllByRole("menu").length).toBe(1);
    expect(node.queryByRole("item")).toBe(null);
  });

  it('uses container and item for each menu item of a connected menu', () => {
    const fake: any = {
      type: '1',
    };
    const { context } = createMockContainer({
      foo: {
        component: () => <div />,
        settings: {
          type: '1',
        },
      },
      bar: {
        component: () => <div />,
        settings: {
          type: '1',
        },
      },
      qxz: {
        component: () => <div />,
        settings: {
          type: 'general',
        },
      },
    });
    const node = render(
      <StateContext.Provider value={context}>
        <Menu {...fake} />
      </StateContext.Provider>,
    );
    expect(node.getAllByRole("menu").length).toBe(1);
    expect(node.getAllByRole("item").length).toBe(2);
  });

  it('uses container and item for general if type not specified', () => {
    const fake: any = {};
    const { context } = createMockContainer({
      foo: {
        component: () => <div />,
        settings: {
          type: '1',
        },
      },
      bar: {
        component: () => <div />,
        settings: {
          type: '1',
        },
      },
      qxz: {
        component: () => <div />,
        settings: {
          type: 'general',
        },
      },
    });
    const node = render(
      <StateContext.Provider value={context}>
        <Menu {...fake} />
      </StateContext.Provider>,
    );
    expect(node.getAllByRole("menu").length).toBe(1);
    expect(node.getAllByRole("item").length).toBe(1);
  });
});
