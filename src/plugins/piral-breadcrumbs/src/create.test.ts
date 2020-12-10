import { Atom, swap } from '@dbeining/react-atom';
import { createBreadcrumbsApi } from './create';

function createMockContainer() {
  const state = Atom.of({});
  return {
    context: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      defineActions() {},
      state,
      dispatch(update) {
        swap(state, update);
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
    container.context.registerBreadcrumb = jest.fn();
    container.context.unregisterBreadcrumb = jest.fn();
    const api = createApi(container);
    api.registerBreadcrumb('my-bc', {
      title: 'My breadcrumb',
      path: '/example',
    });
    expect(container.context.registerBreadcrumb).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterBreadcrumb).toHaveBeenCalledTimes(0);
    api.unregisterBreadcrumb('my-bc');
    expect(container.context.unregisterBreadcrumb).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterBreadcrumb.mock.calls[0][0]).toBe(
      container.context.registerBreadcrumb.mock.calls[0][0],
    );
  });

  it('createBreadcrumbsApi can dispose a registered breadcrumb', () => {
    const container = createMockContainer();
    container.context.registerBreadcrumb = jest.fn();
    container.context.unregisterBreadcrumb = jest.fn();
    const api = createApi(container);
    const dispose = api.registerBreadcrumb('my-bc', {
      title: 'My breadcrumb',
      path: '/example',
    });
    expect(container.context.registerBreadcrumb).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterBreadcrumb).toHaveBeenCalledTimes(0);
    dispose();
    expect(container.context.unregisterBreadcrumb).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterBreadcrumb.mock.calls[0][0]).toBe(
      container.context.registerBreadcrumb.mock.calls[0][0],
    );
  });

  it('createBreadcrumbsApi can dispose a registered anonymous breadcrumb', () => {
    const container = createMockContainer();
    container.context.registerBreadcrumb = jest.fn();
    container.context.unregisterBreadcrumb = jest.fn();
    const api = createApi(container);
    const dispose = api.registerBreadcrumb({
      title: 'My breadcrumb',
      path: '/example',
    });
    expect(container.context.registerBreadcrumb).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterBreadcrumb).toHaveBeenCalledTimes(0);
    dispose();
    expect(container.context.unregisterBreadcrumb).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterBreadcrumb.mock.calls[0][0]).toBe(
      container.context.registerBreadcrumb.mock.calls[0][0],
    );
  });
});
