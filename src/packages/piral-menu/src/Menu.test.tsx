import * as React from 'react';
import { mount } from 'enzyme';
import { StateContext } from 'piral-core';
import { Atom, swap, deref } from '@dbeining/react-atom';
import { Menu } from './Menu';

const MockMenuContainer: React.FC = ({ children }) => <div>{children}</div>;
MockMenuContainer.displayName = 'MockMenuContainer';
const MockMenuItem: React.FC = ({ children }) => <div>{children}</div>;
MockMenuItem.displayName = 'MockMenuItem';

function createMockContainer(menuItems = {}) {
  const state = Atom.of({
    components: {
      MenuContainer: MockMenuContainer,
      MenuItem: MockMenuItem,
    },
    registry: {
      menuItems,
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

describe('Piral-Menu Menu component', () => {
  it('uses container for a connected menu', () => {
    const fake: any = {
      type: '1',
    };
    const { context } = createMockContainer();
    const node = mount(
      <StateContext.Provider value={context}>
        <Menu {...fake} />
      </StateContext.Provider>,
    );
    expect(node.find(MockMenuContainer).length).toBe(1);
    expect(node.find(MockMenuItem).length).toBe(0);
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
    const node = mount(
      <StateContext.Provider value={context}>
        <Menu {...fake} />
      </StateContext.Provider>,
    );
    expect(node.find(MockMenuContainer).length).toBe(1);
    expect(node.find(MockMenuItem).length).toBe(2);
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
    const node = mount(
      <StateContext.Provider value={context}>
        <Menu {...fake} />
      </StateContext.Provider>,
    );
    expect(node.find(MockMenuContainer).length).toBe(1);
    expect(node.find(MockMenuItem).length).toBe(1);
  });
});
