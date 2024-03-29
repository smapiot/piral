/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import create from 'zustand';
import { describe, it, expect, vitest, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { StateContext } from 'piral-core';
import { Breadcrumbs } from './Breadcrumbs';

const MockBcContainer: React.FC<any> = ({ children }) => <div role="container">{children}</div>;
MockBcContainer.displayName = 'MockBcContainer';

const MockBcItem: React.FC<any> = ({ children }) => <div role="dialog">{children}</div>;
MockBcItem.displayName = 'MockBcTile';

function createMockContainer(breadcrumbs = {}, path = '/example') {
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
      navigation: {
        path,
        listen() {},
      },
    } as any,
    api: {} as any,
  };
}

describe('Piral-Breadcrumb Container component', () => {
  afterEach(() => {
    cleanup();
  });
  
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
    const { context } = createMockContainer({
      example: {
        matcher: /^\/([a-zA-Z]+)$/,
        settings: {
          path: '/:example*',
          title: ({ path }) => {
            return path;
          },
          parent: '/',
        },
      },
    }, '/replacedWildcard');
    const node = render(
      <StateContext.Provider value={context}>
        <Breadcrumbs />
      </StateContext.Provider>,
    );

    expect(node.getAllByRole('container').length).toBe(1);
    expect(node.getAllByRole('dialog').length).toBe(1);
    expect(node.getAllByRole('container')[0].innerHTML).toBe('<div role="dialog">/replacedWildcard</div>');
  });

  it('dynamic title function with falsely route param', () => {
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
