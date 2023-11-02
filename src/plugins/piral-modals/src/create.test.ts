/**
 * @vitest-environment jsdom
 */
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { createElement, FC } from 'react';
import { createModalsApi } from './create';

const StubComponent: FC = (props) => createElement('div', props);
StubComponent.displayName = 'StubComponent';

function createMockContainer() {
  const state = create(() => ({
    registry: {
      extensions: {},
    },
  }));
  return {
    context: {
      on: vitest.fn(),
      off: vitest.fn(),
      emit: vitest.fn(),
      defineActions() {},
      converters: {},
      readState() {
        return undefined;
      },
      state,
      dispatch(update) {
        state.setState(update(state.getState()));
      },
    } as any,
    api: {} as any,
  };
}

function createApi(container) {
  Object.assign(container.api, (createModalsApi()(container.context) as any)(container.api, moduleMetadata));
  return container.api;
}

const moduleMetadata = {
  name: 'my-module',
  version: '1.0.0',
  link: undefined,
  custom: undefined,
  hash: '123',
};

describe('Create Modals API Extensions', () => {
  it('createModalsApi can register and unregister a modal', () => {
    const container = createMockContainer();
    container.context.registerModal = vitest.fn();
    container.context.unregisterModal = vitest.fn();
    const api = createApi(container);
    api.registerModal('modal', StubComponent);
    expect(container.context.registerModal).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterModal).toHaveBeenCalledTimes(0);
    api.unregisterModal('modal');
    expect(container.context.unregisterModal).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterModal.mock.calls[0][0]).toBe(container.context.registerModal.mock.calls[0][0]);
  });

  it('createModalsApi showModal uses an action and leaves a disposer', async () => {
    const container = createMockContainer();
    container.context.openModal = vitest.fn();
    container.context.closeModal = vitest.fn();
    const api = createApi(container);
    const close = api.showModal('my-modal');
    close();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(container.context.openModal).toHaveBeenCalled();
    expect(container.context.closeModal).toHaveBeenCalled();
  });

  it('createModalsApi can be disposed', async () => {
    const container = createMockContainer();
    container.context.registerModal = vitest.fn();
    container.context.unregisterModal = vitest.fn();
    const api = createApi(container);
    const dispose = api.registerModal('modal', StubComponent);
    expect(container.context.registerModal).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterModal).toHaveBeenCalledTimes(0);
    dispose();
    expect(container.context.unregisterModal).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterModal.mock.calls[0][0]).toBe(container.context.registerModal.mock.calls[0][0]);
  });
});
