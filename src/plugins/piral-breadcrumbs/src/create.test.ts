import create from 'zustand';
import { createBreadcrumbsApi } from './create';

function createMockContainer() {
  const state = create(() => ({
    registry: {
      extensions: {},
    },
  }));
  return {
    context: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      defineActions() {},
      state,
      dispatch(update) {
        state.setState(update(state.getState()));
      },
    } as any,
    api: {} as any,
  };
}

function createApi(container) {
  Object.assign(container.api, (createBreadcrumbsApi()(container.context) as any)(container.api, moduleMetadata));
  return container.api;
}

const moduleMetadata = {
  name: 'my-module',
  version: '1.0.0',
  link: undefined,
  custom: undefined,
  hash: '123',
};

describe('Create Breadcrumb API Extensions', () => {
  it('createBreadcrumbsApi can register and unregister a breadcrumb', () => {
    const container = createMockContainer();
    container.context.registerBreadcrumbs = jest.fn();
    container.context.unregisterBreadcrumbs = jest.fn();
    const api = createApi(container);
    api.registerBreadcrumb('my-bc', {
      title: 'My breadcrumb',
      path: '/example',
    });
    expect(container.context.registerBreadcrumbs).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterBreadcrumbs).toHaveBeenCalledTimes(0);
    api.unregisterBreadcrumb('my-bc');
    expect(container.context.unregisterBreadcrumbs).toHaveBeenCalledTimes(1);
    const ids = Object.keys(container.context.registerBreadcrumbs.mock.calls[0][0]);
    expect(container.context.unregisterBreadcrumbs.mock.calls[0][0]).toEqual(ids);
  });

  it('createBreadcrumbsApi can dispose a registered breadcrumb', () => {
    const container = createMockContainer();
    container.context.registerBreadcrumbs = jest.fn();
    container.context.unregisterBreadcrumbs = jest.fn();
    const api = createApi(container);
    const dispose = api.registerBreadcrumb('my-bc', {
      title: 'My breadcrumb',
      path: '/example',
    });
    expect(container.context.registerBreadcrumbs).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterBreadcrumbs).toHaveBeenCalledTimes(0);
    dispose();
    expect(container.context.unregisterBreadcrumbs).toHaveBeenCalledTimes(1);
    const ids = Object.keys(container.context.registerBreadcrumbs.mock.calls[0][0]);
    expect(container.context.unregisterBreadcrumbs.mock.calls[0][0]).toEqual(ids);
  });

  it('createBreadcrumbsApi can dispose a registered anonymous breadcrumb', () => {
    const container = createMockContainer();
    container.context.registerBreadcrumbs = jest.fn();
    container.context.unregisterBreadcrumbs = jest.fn();
    const api = createApi(container);
    const dispose = api.registerBreadcrumb({
      title: 'My breadcrumb',
      path: '/example',
    });
    expect(container.context.registerBreadcrumbs).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterBreadcrumbs).toHaveBeenCalledTimes(0);
    dispose();
    expect(container.context.unregisterBreadcrumbs).toHaveBeenCalledTimes(1);
    const ids = Object.keys(container.context.registerBreadcrumbs.mock.calls[0][0]);
    expect(container.context.unregisterBreadcrumbs.mock.calls[0][0]).toEqual(ids);
  });

  it('createBreadcrumsApi can use dynamic function as breadcrumb title', () => {
    const container = createMockContainer();
    container.context.registerBreadcrumbs = jest.fn();
    container.context.unregisterBreadcrumbs = jest.fn();
    const api = createApi(container);
    const dispose = api.registerBreadcrumb({
      title: ({ path }) => path,
      path: '/example',
    });
    expect(container.context.registerBreadcrumbs).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterBreadcrumbs).toHaveBeenCalledTimes(0);
    dispose();
    expect(container.context.registerBreadcrumbs).toHaveBeenCalledTimes(1);
    const ids = Object.keys(container.context.registerBreadcrumbs.mock.calls[0][0]);
    expect(container.context.unregisterBreadcrumbs.mock.calls[0][0]).toEqual(ids);
  });
});
