import { createElement, SFC } from 'react';
import { createMenuApi } from './create';

const StubComponent: SFC = props => createElement('div', props);
StubComponent.displayName = 'StubComponent';

function createMockContainer() {
  return {
    context: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      defineActions() {},
    } as any,
    api: {} as any,
  };
}

const moduleMetadata = {
  name: 'my-module',
  version: '1.0.0',
  link: undefined,
  custom: undefined,
  hash: '123',
};

describe('Create Menu API Extensions', () => {
  it('createCoreApi can register and unregister a menu', () => {
    const container = createMockContainer();
    container.context.registerMenuItem = jest.fn();
    container.context.unregisterMenuItem = jest.fn();
    const api = createMenuApi(container.context)(container.api, moduleMetadata);
    api.registerMenu('my-menu', StubComponent);
    expect(container.context.registerMenuItem).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterMenuItem).toHaveBeenCalledTimes(0);
    api.unregisterMenu('my-menu');
    expect(container.context.unregisterMenuItem).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterMenuItem.mock.calls[0][0]).toBe(
      container.context.registerMenuItem.mock.calls[0][0],
    );
  });
});
