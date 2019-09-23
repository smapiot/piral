import { createElement, SFC } from 'react';
import { createModalsApi } from './create';

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

describe('Create Modals API Extensions', () => {
  it('createCoreApi can register and unregister a modal', () => {
    const container = createMockContainer();
    container.context.registerModal = jest.fn();
    container.context.unregisterModal = jest.fn();
    const api = (createModalsApi()(container.context) as any)(container.api, moduleMetadata);
    api.registerModal('modal', StubComponent);
    expect(container.context.registerModal).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterModal).toHaveBeenCalledTimes(0);
    api.unregisterModal('modal');
    expect(container.context.unregisterModal).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterModal.mock.calls[0][0]).toBe(container.context.registerModal.mock.calls[0][0]);
  });

  it('createCoreApi showModal uses an action and leaves a disposer', () => {
    const container = createMockContainer();
    container.context.openModal = jest.fn();
    container.context.closeModal = jest.fn();
    const api = (createModalsApi()(container.context) as any)(container.api, moduleMetadata);
    const close = api.showModal('my-modal');
    close();
    expect(container.context.openModal).toHaveBeenCalled();
    expect(container.context.closeModal).toHaveBeenCalled();
  });
});
