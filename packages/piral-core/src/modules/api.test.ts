import { createApi } from './api';

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

  it('createApi pluginMeta returns the metadata', () => {
    const container = createMockContainer();
    const api = createApi<{}>(moduleMetadata, container);
    const meta = api.pluginMeta();
    expect(meta).toEqual({
      name: moduleMetadata.name,
      version: moduleMetadata.version,
      dependencies: moduleMetadata.dependencies,
      hash: moduleMetadata.hash,
    });
  });
});
