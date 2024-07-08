/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { render } from '@testing-library/react';
import { withApi } from './withApi';
import { StateContext } from '../state';

function createMockContainer() {
  const state = create(() => ({
    app: {
      wrap: false,
    },
    components: {
      ErrorInfo: StubErrorInfo,
    },
    registry: {
      wrappers: { feed: 'test', '*': 'test' },
    },
    portals: {},
  }));
  return {
    context: {
      converters: {},
      readState(cb) {
        return cb(state.getState());
      },
      navigation: {
        router: undefined,
      },
      on: vitest.fn(),
      off: vitest.fn(),
      emit: vitest.fn(),
      state,
      destroyPortal: (id) => {},
    } as any,
  };
}

function createMockContainerWithNoWrappers() {
  const state = create(() => ({
    components: {
      ErrorInfo: StubErrorInfo,
    },
    registry: {},
    portals: {},
  }));
  return {
    context: {
      converters: {},
      readState(cb) {
        return cb({
          app: {
            wrap: false,
          },
          registry: {
            wrappers: {},
          },
        });
      },
      on: vitest.fn(),
      off: vitest.fn(),
      emit: vitest.fn(),
      state,
      destroyPortal: (id) => {},
    } as any,
  };
}

const StubErrorInfo: React.FC<any> = ({ type }) => <div role="error">{type}</div>;
StubErrorInfo.displayName = 'StubErrorInfo';

const StubComponent: React.FC<{ shouldCrash?: boolean; piral?: any }> = ({ shouldCrash, piral }) => {
  if (shouldCrash) {
    throw new Error('I should crash!');
  }
  return <div role="component">{piral && 'piral'}</div>;
};
StubComponent.displayName = 'StubComponent';

describe('withApi Module', () => {
  it('wraps a component and forwards the API as piral', () => {
    const { context } = createMockContainer();
    const api: any = {
      meta: {
        name: 'foo',
      },
      on: context.on,
      off: context.off,
      emit: context.emit,
    };
    const Component = withApi(context, StubComponent, api, 'feed' as any);
    const node = render(
      <StateContext.Provider value={context}>
        <Component />
      </StateContext.Provider>,
    );
    expect(node.getByRole('component').textContent).toBe('piral');
  });

  it('is protected against a component crash', () => {
    console.error = vitest.fn();
    const { context } = createMockContainer();
    const api: any = {
      meta: {
        name: 'foo',
      },
      on: context.on,
      off: context.off,
      emit: context.emit,
    };
    const Component = withApi(context, StubComponent, api, 'feed' as any);
    const node = render(
      <StateContext.Provider value={context}>
        <Component shouldCrash />
      </StateContext.Provider>,
    );
    expect(node.getByRole('error').textContent).toBe('feed');
  });

  it('reports to console.error when an error is hit', () => {
    console.error = vitest.fn();
    const { context } = createMockContainer();
    const api: any = {
      meta: {
        name: 'my pilet',
      },
      on: context.on,
      off: context.off,
      emit: context.emit,
    };
    const Component = withApi(context, StubComponent, api, 'feed' as any);
    render(
      <StateContext.Provider value={context}>
        <Component shouldCrash />
      </StateContext.Provider>,
    );
    expect(console.error).toHaveBeenCalled();
  });

  it('Wraps component of type object', () => {
    const { context } = createMockContainer();
    const api: any = {
      meta: {
        name: 'foo',
      },
      on: context.on,
      off: context.off,
      emit: context.emit,
    };
    context.converters = {
      html: ({ component }) => component,
    };
    const Component = withApi(context, { type: 'html', component: { mount: () => {} } }, api, 'unknown');

    const node = render(
      <StateContext.Provider value={context}>
        <Component />
      </StateContext.Provider>,
    );

    expect(node.container.children.length).toBe(1);
  });

  it('Wraps component which is object == null.', () => {
    const { context } = createMockContainerWithNoWrappers();
    const api: any = {
      meta: {
        name: 'foo',
      },
      on: context.on,
      off: context.off,
      emit: context.emit,
    };
    context.converters = {
      html: ({ component }) => component,
    };
    const Component = withApi(context, null as any, api, 'unknown');

    render(
      <StateContext.Provider value={context}>
        <Component />
      </StateContext.Provider>,
    );

    expect(Component.displayName).toBeUndefined();
  });
});
