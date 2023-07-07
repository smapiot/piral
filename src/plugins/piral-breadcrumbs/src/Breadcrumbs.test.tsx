import * as React from 'react';
import create from 'zustand';
import { render } from '@testing-library/react';
import { StateContext } from 'piral-core';
import { Breadcrumbs } from './Breadcrumbs';

const MockBcContainer: React.FC<any> = ({ children }) => <div role="container">{children}</div>;
MockBcContainer.displayName = 'MockBcContainer';

const MockBcItem: React.FC<any> = ({ children }) => <div role="dialog">{children}</div>;
MockBcItem.displayName = 'MockBcTile';

jest.mock('react-router', () => ({
  useLocation() {
    return {
      pathname: '/example',
    };
  },
  useRouteMatch() {
    return {};
  },
}));

function createMockContainer(breadcrumbs = {}) {
  const state = create(() => ({
    components: {
      BreadcrumbsContainer: MockBcContainer,
      BreadcrumbItem: MockBcItem,
    },
    registry: {
      breadcrumbs,
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

describe('Piral-Breadcrumb Container component', () => {
  it('uses container for a breadcrumbs', () => {
    const { context } = createMockContainer();
    const node = render(
      <StateContext.Provider value={context}>
        <Breadcrumbs />
      </StateContext.Provider>,
    );
    expect(node.getAllByRole('container').length).toBe(1);
    expect(node.queryByRole('dialog')).toBe(null);
  });

  it('uses container and item for each breadcrumb', () => {
    const { context } = createMockContainer({
      home: {
        matcher: /^\/$/,
        settings: {
          path: '/',
          title: 'Home',
        },
      },
      foo: {
        matcher: /^\/example$/,
        settings: {
          path: '/example',
          title: 'Example',
          parent: '/',
        },
      },
      bar: {
        matcher: /^\/example\/foo$/,
        settings: {
          path: '/example/foo',
          title: 'Foo',
          parent: '/example',
        },
      },
    });
    const node = render(
      <StateContext.Provider value={context}>
        <Breadcrumbs />
      </StateContext.Provider>,
    );
    expect(node.getAllByRole('container').length).toBe(1);
    expect(node.getAllByRole('dialog').length).toBe(2);
  });
});
