import * as React from 'react';
import create from 'zustand';
import { render } from '@testing-library/react';
import { StateContext } from 'piral-core';
import { Breadcrumbs } from './Breadcrumbs';
import { useRouteMatch } from 'react-router';

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
  useRouteMatch: jest.fn(() => ({})),
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
  it('breadcrumbs empty', () => {
    const { context } = createMockContainer();
    const node = render(
      <StateContext.Provider value={context}>
        <Breadcrumbs />
      </StateContext.Provider>,
    );
    expect(node.getAllByRole('container').length).toBe(1);
    expect(node.queryByRole('dialog')).toBe(null);
  });

  it('breadcrumbs are created successfully', () => {
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

  it('dynamic title function replaces wildcard with route param', () => {
    (useRouteMatch as any).mockReturnValueOnce({ params: { example: 'replacedWildcard' } });

    const { context } = createMockContainer({
      example: {
        matcher: /^\/example$/,
        settings: {
          path: '/:example*',
          title: ({ path }) => {
            return path;
          },
          parent: '/',
        },
      },
    });
    const node = render(
      <StateContext.Provider value={context}>
        <Breadcrumbs />
      </StateContext.Provider>,
    );

    expect(node.getAllByRole('container').length).toBe(1);
    expect(node.getAllByRole('dialog').length).toBe(1);
    expect(node.getAllByRole('container')[0].innerHTML).toBe('<div role="dialog">/replacedWildcard</div>');
  });

  it('dynamic title function no match in params', () => {
    (useRouteMatch as any).mockReturnValueOnce({ params: { imNotHere: 'replacedWildcard' } });

    const { context } = createMockContainer({
      example: {
        matcher: /^\/example$/,
        settings: {
          path: '/:example*',
          title: ({ path }) => {
            return path;
          },
          parent: '/',
        },
      },
    });
    const node = render(
      <StateContext.Provider value={context}>
        <Breadcrumbs />
      </StateContext.Provider>,
    );

    expect(node.getAllByRole('container').length).toBe(1);
    expect(node.getAllByRole('dialog').length).toBe(1);
    expect(node.getAllByRole('container')[0].innerHTML).toBe('<div role="dialog">/:example*</div>');
  });

  it('dynamic title function with falsely route param', () => {
    (useRouteMatch as any).mockReturnValueOnce({ params: { example: false } });

    const { context } = createMockContainer({
      example: {
        matcher: /^\/example$/,
        settings: {
          path: '/:example*',
          title: ({ path }) => {
            return path;
          },
          parent: '/',
        },
      },
    });
    const node = render(
      <StateContext.Provider value={context}>
        <Breadcrumbs />
      </StateContext.Provider>,
    );

    expect(node.getAllByRole('container').length).toBe(1);
    expect(node.getAllByRole('dialog').length).toBe(1);
    expect(node.getAllByRole('container')[0].innerHTML).toBe('<div role="dialog">/</div>');
  });

  it('dynamic title function with static title', () => {
    (useRouteMatch as any).mockReturnValueOnce({ params: { imNotHere: 'replacedWildcard' } });

    const { context } = createMockContainer({
      example: {
        matcher: /^\/example$/,
        settings: {
          path: '/example',
          title: ({ path }) => {
            return 'My Path';
          },
          parent: '/',
        },
      },
    });
    const node = render(
      <StateContext.Provider value={context}>
        <Breadcrumbs />
      </StateContext.Provider>,
    );

    expect(node.getAllByRole('container').length).toBe(1);
    expect(node.getAllByRole('dialog').length).toBe(1);
    expect(node.getAllByRole('container')[0].innerHTML).toBe('<div role="dialog">My Path</div>');
  });

  it('static title', () => {
    (useRouteMatch as any).mockReturnValueOnce({ params: {} });

    const { context } = createMockContainer({
      example: {
        matcher: /^\/example$/,
        settings: {
          path: '/:example*',
          title: 'My Path',
          parent: '/',
        },
      },
    });
    const node = render(
      <StateContext.Provider value={context}>
        <Breadcrumbs />
      </StateContext.Provider>,
    );

    expect(node.getAllByRole('container').length).toBe(1);
    expect(node.getAllByRole('container')[0].innerHTML).toBe('<div role="dialog">My Path</div>');
  });
});
