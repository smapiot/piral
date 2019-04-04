import * as hooks from '../hooks';
import { createElement, SFC } from 'react';
import { createApi } from './api';

jest.mock('../hooks');

const StubComponent: SFC = props => createElement('div', props);
StubComponent.displayName = 'StubComponent';

const moduleMetadata = {
  dependencies: {},
  name: 'my-module',
  version: '1.0.0',
  hash: '123',
};

function createMockContainer() {
  return {
    availableModules: [] as any,
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    context: undefined as any,
    extendApi(api) {
      return api;
    },
    getDependencies: undefined as any,
    requestModules: undefined as any,
  };
}

describe('API Module', () => {
  it('createApi trackError fires an event', () => {
    const container = createMockContainer();
    const api = createApi<{}>(moduleMetadata, container);
    api.trackError('my error');
    expect(container.events.emit).toHaveBeenCalledWith('track', {
      type: 'error',
      error: 'my error',
      properties: {},
      measurements: {},
      severityLevel: 1,
    });
  });

  it('createApi trackEvent fires an event', () => {
    const container = createMockContainer();
    const api = createApi<{}>(moduleMetadata, container);
    api.trackEvent('my event');
    expect(container.events.emit).toHaveBeenCalledWith('track', {
      type: 'event',
      name: 'my event',
      properties: {},
      measurements: {},
    });
  });

  it('createApi trackFrame fires an event and leaves back a tracker', () => {
    const container = createMockContainer();
    const api = createApi<{}>(moduleMetadata, container);
    const tracker = api.trackFrame('my frame');
    expect(container.events.emit).toHaveBeenCalledWith('track', {
      type: 'start-frame',
      name: 'my frame',
    });
    tracker();
    expect(container.events.emit).toHaveBeenLastCalledWith('track', {
      type: 'end-frame',
      name: 'my frame',
      properties: {},
      measurements: {},
    });
  });

  it('createApi showModal uses an action and leaves a disposer', () => {
    const container = createMockContainer();
    container.context = {
      openModal: jest.fn(),
      closeModal: jest.fn(),
    };
    const api = createApi<{}>(moduleMetadata, container);
    const close = api.showModal('my-modal');
    close();
    expect(container.context.openModal).toHaveBeenCalled();
    expect(container.context.closeModal).toHaveBeenCalled();
  });

  it('createApi showNotification uses an action and leaves a disposer', () => {
    const container = createMockContainer();
    container.context = {
      openNotification: jest.fn(),
      closeNotification: jest.fn(),
    };
    const api = createApi<{}>(moduleMetadata, container);
    const close = api.showNotification('my notification');
    close();
    expect(container.context.openNotification).toHaveBeenCalled();
    expect(container.context.closeNotification).toHaveBeenCalled();
  });

  it('createApi showNotification can be auto closed', () => {
    jest.useFakeTimers();
    const container = createMockContainer();
    container.context = {
      openNotification: jest.fn(),
      closeNotification: jest.fn(),
    };
    const api = createApi<{}>(moduleMetadata, container);
    api.showNotification('my notification', {
      autoClose: 100,
    });
    expect(container.context.openNotification).toHaveBeenCalled();
    expect(container.context.closeNotification).not.toHaveBeenCalled();
    jest.advanceTimersByTime(100);
    expect(container.context.closeNotification).toHaveBeenCalled();
  });

  it('createApi pluginMeta returns the metadata', () => {
    const container = createMockContainer();
    const api = createApi<{}>(moduleMetadata, container);
    expect(api.meta).toEqual({
      name: moduleMetadata.name,
      version: moduleMetadata.version,
      dependencies: moduleMetadata.dependencies,
      hash: moduleMetadata.hash,
    });
  });

  it('createApi can translate from global translations using the current language', () => {
    (hooks as any).useGlobalState = jest.fn(f =>
      f({
        app: {
          language: {
            selected: 'fr',
            translations: {
              fr: {
                foo: 'bár',
              },
            },
          },
        },
      }),
    );
    const container = createMockContainer();
    const api = createApi<{}>(moduleMetadata, container);
    const result = api.translate('foo');
    expect(result).toEqual('bár');
  });

  it('createApi can translate from local translations using the current language', () => {
    (hooks as any).useGlobalState = jest.fn(f =>
      f({
        app: {
          language: {
            selected: 'fr',
            translations: {
              fr: {
                foo: 'bár',
              },
            },
          },
        },
      }),
    );
    const container = createMockContainer();
    const api = createApi<{}>(moduleMetadata, container);
    api.provideTranslations({
      fr: {
        foo: 'boo',
      },
    });
    const result = api.translate('foo');
    expect(result).toEqual('boo');
  });

  it('createApi can translate from local-global translations using the current language', () => {
    (hooks as any).useGlobalState = jest.fn(f =>
      f({
        app: {
          language: {
            selected: 'fr',
            translations: {
              fr: {
                bar: 'bár',
              },
            },
          },
        },
      }),
    );
    const container = createMockContainer();
    const api = createApi<{}>(moduleMetadata, container);
    api.provideTranslations({
      fr: {
        foo: 'boo',
      },
    });
    const result = api.translate('bar');
    expect(result).toEqual('bár');
  });

  it('createApi can register and unregister a tile', () => {
    const container = createMockContainer();
    container.context = {
      registerTile: jest.fn(),
      unregisterTile: jest.fn(),
    };
    const api = createApi<{}>(moduleMetadata, container);
    api.registerTile('my-tile', StubComponent);
    expect(container.context.registerTile).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterTile).toHaveBeenCalledTimes(0);
    api.unregisterTile('my-tile');
    expect(container.context.unregisterTile).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterTile.mock.calls[0][0]).toBe(container.context.registerTile.mock.calls[0][0]);
  });

  it('createApi can register and unregister a page', () => {
    const container = createMockContainer();
    container.context = {
      registerPage: jest.fn(),
      unregisterPage: jest.fn(),
    };
    const api = createApi<{}>(moduleMetadata, container);
    api.registerPage('/route', StubComponent);
    expect(container.context.registerPage).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterPage).toHaveBeenCalledTimes(0);
    api.unregisterPage('/route');
    expect(container.context.unregisterPage).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterPage.mock.calls[0][0]).toBe(container.context.registerPage.mock.calls[0][0]);
  });

  it('createApi can register and unregister a menu', () => {
    const container = createMockContainer();
    container.context = {
      registerMenuItem: jest.fn(),
      unregisterMenuItem: jest.fn(),
    };
    const api = createApi<{}>(moduleMetadata, container);
    api.registerMenu('my-menu', StubComponent);
    expect(container.context.registerMenuItem).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterMenuItem).toHaveBeenCalledTimes(0);
    api.unregisterMenu('my-menu');
    expect(container.context.unregisterMenuItem).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterMenuItem.mock.calls[0][0]).toBe(
      container.context.registerMenuItem.mock.calls[0][0],
    );
  });

  it('createApi can register and unregister a modal', () => {
    const container = createMockContainer();
    container.context = {
      registerModal: jest.fn(),
      unregisterModal: jest.fn(),
    };
    const api = createApi<{}>(moduleMetadata, container);
    api.registerModal('modal', StubComponent);
    expect(container.context.registerModal).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterModal).toHaveBeenCalledTimes(0);
    api.unregisterModal('modal');
    expect(container.context.unregisterModal).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterModal.mock.calls[0][0]).toBe(container.context.registerModal.mock.calls[0][0]);
  });

  it('createApi can register and unregister an extension', () => {
    const container = createMockContainer();
    container.context = {
      registerExtension: jest.fn(),
      unregisterExtension: jest.fn(),
    };
    const api = createApi<{}>(moduleMetadata, container);
    api.registerExtension('ext', StubComponent);
    expect(container.context.registerExtension).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterExtension).toHaveBeenCalledTimes(0);
    api.unregisterExtension('ext', StubComponent);
    expect(container.context.unregisterExtension).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterExtension.mock.calls[0][0]).toBe(
      container.context.registerExtension.mock.calls[0][0],
    );
  });

  it('createApi read data by its name', () => {
    const container = createMockContainer();
    container.context = {
      readDataValue: jest.fn(name => name),
    };
    const api = createApi<{}>(moduleMetadata, container);
    const result = api.getData('foo');
    expect(result).toBe('foo');
    expect(container.context.readDataValue).toHaveBeenCalled();
  });

  it('createApi write data without options shall pass, but memory should not emit events', () => {
    const container = createMockContainer();
    container.context = {
      tryWriteDataItem: jest.fn(() => true),
    };
    const api = createApi<{}>(moduleMetadata, container);
    api.setData('foo', 5);
    expect(container.context.tryWriteDataItem).toHaveBeenCalled();
    expect(container.events.emit).not.toHaveBeenCalled();
  });

  it('createApi write data with empty options shall pass, but memory should not emit events', () => {
    const container = createMockContainer();
    container.context = {
      tryWriteDataItem: jest.fn(() => true),
    };
    const api = createApi<{}>(moduleMetadata, container);
    api.setData('foo', 5, {});
    expect(container.context.tryWriteDataItem).toHaveBeenCalled();
    expect(container.events.emit).not.toHaveBeenCalled();
  });

  it('createApi write data by the simple option should not pass, never emitting events', () => {
    const container = createMockContainer();
    container.context = {
      tryWriteDataItem: jest.fn(() => false),
    };
    const api = createApi<{}>(moduleMetadata, container);
    api.setData('foo', 5, 'remote');
    expect(container.context.tryWriteDataItem).toHaveBeenCalled();
    expect(container.events.emit).not.toHaveBeenCalled();
  });

  it('createApi write data by the simple option shall pass with remote emitting an event', () => {
    const container = createMockContainer();
    container.context = {
      tryWriteDataItem: jest.fn(() => true),
    };
    const api = createApi<{}>(moduleMetadata, container);
    api.setData('foo', 5, 'remote');
    expect(container.context.tryWriteDataItem).toHaveBeenCalled();
    expect(container.events.emit).toHaveBeenCalledWith('store', {
      name: 'foo',
      target: 'remote',
      value: 5,
      owner: moduleMetadata.name,
      expires: -1,
    });
  });

  it('createApi write data by the object options shall pass with remote emitting an event', () => {
    const container = createMockContainer();
    container.context = {
      tryWriteDataItem: jest.fn(() => true),
    };
    const api = createApi<{}>(moduleMetadata, container);
    api.setData('foo', 15, {
      expires: 10,
      target: 'local',
    });
    expect(container.context.tryWriteDataItem).toHaveBeenCalled();
    expect(container.events.emit).toHaveBeenCalledWith('store', {
      name: 'foo',
      target: 'local',
      value: 15,
      owner: moduleMetadata.name,
      expires: 10,
    });
  });

  it('createApi allows using the created form creator as a HOC', () => {
    const container = createMockContainer();
    container.context = {
      updateFormState: jest.fn(),
    };
    const api = createApi<{}>(moduleMetadata, container);
    const create = api.createForm({
      emptyData: {},
      onSubmit() {
        return Promise.resolve();
      },
    });
    const NewComponent = create(StubComponent);
    expect(NewComponent.displayName).toBe('withRouter(FormLoader)');
  });

  it('createApi provides the option to create a feed connector', () => {
    const container = createMockContainer();
    container.context = {
      createFeed: jest.fn(),
      loadFeed: jest.fn(),
    };
    const api = createApi<{}>(moduleMetadata, container);
    api.createConnector(() => Promise.resolve(true));
    expect(container.context.createFeed).toHaveBeenCalled();
    expect(container.context.loadFeed).not.toHaveBeenCalled();
  });

  it('createApi can immediately start loading the created feed', () => {
    const container = createMockContainer();
    container.context = {
      createFeed: jest.fn(),
      loadFeed: jest.fn(),
    };
    const api = createApi<{}>(moduleMetadata, container);
    api.createConnector({
      initialize: () => Promise.resolve(true),
      connect: () => () => {},
      update: () => Promise.resolve({}),
      immediately: true,
    });
    expect(container.context.createFeed).toHaveBeenCalled();
    expect(container.context.loadFeed).toHaveBeenCalled();
  });

  it('createApi allows using the created feed connector as a HOC', () => {
    const container = createMockContainer();
    container.context = {
      createFeed: jest.fn(),
      loadFeed: jest.fn(),
    };
    const api = createApi<{}>(moduleMetadata, container);
    const connect = api.createConnector(() => Promise.resolve(true));
    const NewComponent = connect(StubComponent);
    expect(NewComponent.displayName).toBe('FeedView_my-module://0');
  });

  it('createApi can register and unregister a search provider', () => {
    const container = createMockContainer();
    container.context = {
      registerSearchProvider: jest.fn(),
      unregisterSearchProvider: jest.fn(),
    };
    const api = createApi<{}>(moduleMetadata, container);
    api.registerSearchProvider('my-sp', () => Promise.resolve([]));
    expect(container.context.registerSearchProvider).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterSearchProvider).toHaveBeenCalledTimes(0);
    api.unregisterSearchProvider('my-sp');
    expect(container.context.registerSearchProvider).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterSearchProvider.mock.calls[0][0]).toBe(
      container.context.registerSearchProvider.mock.calls[0][0],
    );
  });

  it('createApi registration of a search provider wraps it', () => {
    const container = createMockContainer();
    container.context = {
      registerSearchProvider: jest.fn(),
      unregisterSearchProvider: jest.fn(),
    };
    const api = createApi<{}>(moduleMetadata, container);
    const search = jest.fn();
    api.registerSearchProvider('my-sp', search);
    container.context.registerSearchProvider.mock.calls[0][1].search('foo');
    expect(search).toHaveBeenCalledWith('foo', api);
  });
});
