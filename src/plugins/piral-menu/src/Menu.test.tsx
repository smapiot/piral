/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import { describe, it, expect, vitest, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { Menu } from './Menu';

let menuItems: Record<string, any> = {};

vitest.mock('piral-core', () => ({
  getPiralComponent(name) {
    switch (name) {
      case 'MenuContainer':
        const MockMenuContainer: React.FC<any> = ({ children }) => <div role="menu">{children}</div>;
        MockMenuContainer.displayName = 'MockMenuContainer';
        return MockMenuContainer;
      case 'MenuItem':
        const MockMenuItem: React.FC<any> = ({ children }) => <div role="item">{children}</div>;
        MockMenuItem.displayName = 'MockMenuItem';
        return MockMenuItem;
      default:
        return null;
    }
  },
  useGlobalState(select) {
    return select({
      registry: {
        menuItems,
      },
    });
  },
}));

describe('Piral-Menu Menu component', () => {
  afterEach(() => {
    cleanup();
  });

  it('uses container for a connected menu', () => {
    const fake: any = {
      type: '1',
    };
    menuItems = {};
    const node = render(<Menu {...fake} />);
    expect(node.getAllByRole('menu').length).toBe(1);
    expect(node.queryByRole('item')).toBe(null);
  });

  it('uses container and item for each menu item of a connected menu', () => {
    const fake: any = {
      type: '1',
    };
    menuItems = {
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
    };
    const node = render(<Menu {...fake} />);
    expect(node.getAllByRole('menu').length).toBe(1);
    expect(node.getAllByRole('item').length).toBe(2);
  });

  it('uses container and item for general if type not specified', () => {
    const fake: any = {};
    menuItems = {
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
    };
    const node = render(<Menu {...fake} />);
    expect(node.getAllByRole('menu').length).toBe(1);
    expect(node.getAllByRole('item').length).toBe(1);
  });
});
