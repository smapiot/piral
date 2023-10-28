import { describe, it, expect, vitest } from 'vitest';
import { createElement, FC } from 'react';
import { defaultApiFactory } from './api';

vitest.mock('../hooks');

const StubComponent: FC = (props) => createElement('div', props);
StubComponent.displayName = 'StubComponent';

const moduleMetadata = {
  name: 'my-module',
  version: '1.0.0',
  link: undefined,
  custom: undefined,
  hash: '123',
};

function createMockContainer() {
  return {
    context: {
      on: vitest.fn(),
      off: vitest.fn(),
      emit: vitest.fn(),
      converters: {},
      apis: {},
      readState() {
        return undefined;
      },
    } as any,
  };
}

function createApi(container, apis = []) {
  const api = defaultApiFactory(container.context, apis);
  return api(moduleMetadata);
}

describe('API Module', () => {
  it('defaultApiFactory can register and unregister a page', () => {
    const container = createMockContainer();
    container.context.registerPage = vitest.fn();
    container.context.unregisterPage = vitest.fn();
    const api = createApi(container);
    api.registerPage('/route', StubComponent);
    expect(container.context.registerPage).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterPage).toHaveBeenCalledTimes(0);
    api.unregisterPage('/route');
    expect(container.context.unregisterPage).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterPage.mock.calls[0][0]).toBe(container.context.registerPage.mock.calls[0][0]);
  });

  it('defaultApiFactory can dispose a registered page', () => {
    const container = createMockContainer();
    container.context.registerPage = vitest.fn();
    container.context.unregisterPage = vitest.fn();
    const api = createApi(container);
    const dispose = api.registerPage('/route', StubComponent);
    expect(container.context.registerPage).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterPage).toHaveBeenCalledTimes(0);
    dispose();
    expect(container.context.unregisterPage).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterPage.mock.calls[0][0]).toBe(container.context.registerPage.mock.calls[0][0]);
  });

  it('defaultApiFactory can register and unregister an extension', () => {
    const container = createMockContainer();
    container.context.registerExtension = vitest.fn();
    container.context.unregisterExtension = vitest.fn();
    const api = createApi(container);
    api.registerExtension('ext', StubComponent);
    expect(container.context.registerExtension).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterExtension).toHaveBeenCalledTimes(0);
    api.unregisterExtension('ext', StubComponent);
    expect(container.context.unregisterExtension).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterExtension.mock.calls[0][0]).toBe(
      container.context.registerExtension.mock.calls[0][0],
    );
  });

  it('defaultApiFactory can dispose an registered extension', () => {
    const container = createMockContainer();
    container.context.registerExtension = vitest.fn();
    container.context.unregisterExtension = vitest.fn();
    const api = createApi(container);
    const dispose = api.registerExtension('ext', StubComponent);
    expect(container.context.registerExtension).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterExtension).toHaveBeenCalledTimes(0);
    dispose();
    expect(container.context.unregisterExtension).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterExtension.mock.calls[0][0]).toBe(
      container.context.registerExtension.mock.calls[0][0],
    );
  });

  it('defaultApiFactory read data by its name', () => {
    const container = createMockContainer();
    container.context.readDataValue = vitest.fn((name) => name);
    const api = createApi(container);
    const result = api.getData('foo');
    expect(result).toBe('foo');
    expect(container.context.readDataValue).toHaveBeenCalled();
  });

  it('defaultApiFactory write data without options shall pass, but memory should not emit events', () => {
    const container = createMockContainer();
    container.context.tryWriteDataItem = vitest.fn(() => true);
    const api = createApi(container);
    api.setData('foo', 5);
    expect(container.context.tryWriteDataItem).toHaveBeenCalled();
    expect(container.context.emit).not.toHaveBeenCalled();
  });

  it('defaultApiFactory write data with empty options shall pass, but memory should not emit events', () => {
    const container = createMockContainer();
    container.context.tryWriteDataItem = vitest.fn(() => true);
    const api = createApi(container);
    api.setData('foo', 5, {});
    expect(container.context.tryWriteDataItem).toHaveBeenCalled();
    expect(container.context.emit).not.toHaveBeenCalled();
  });

  it('defaultApiFactory write data by the simple option should not pass, never emitting events', () => {
    const container = createMockContainer();
    container.context.tryWriteDataItem = vitest.fn(() => false);
    const api = createApi(container);
    api.setData('foo', 5, 'remote');
    expect(container.context.tryWriteDataItem).toHaveBeenCalled();
    expect(container.context.emit).not.toHaveBeenCalled();
  });

  it('defaultApiFactory write data by the simple option shall pass with remote', () => {
    const container = createMockContainer();
    container.context.tryWriteDataItem = vitest.fn(() => true);
    const api = createApi(container);
    api.setData('foo', 5, 'remote');
    expect(container.context.tryWriteDataItem).toHaveBeenCalled();
  });

  it('defaultApiFactory write data by the object options shall pass with remote', () => {
    const container = createMockContainer();
    container.context.tryWriteDataItem = vitest.fn(() => true);
    const api = createApi(container);
    api.setData('foo', 15, {
      expires: 10,
      target: 'local',
    });
    expect(container.context.tryWriteDataItem).toHaveBeenCalled();
  });
});
