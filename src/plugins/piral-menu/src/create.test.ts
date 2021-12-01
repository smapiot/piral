import { Atom, swap } from '@dbeining/react-atom';
import { createElement, FC } from 'react';
import { createMenuApi } from './create';

const StubComponent: FC = (props) => createElement('div', props);
StubComponent.displayName = 'StubComponent';

function createMockContainer() {
  const state = Atom.of({
    registry: {
      extensions: {},
    },
  });
  return {
    context: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      defineActions() {},
      converters: {},
      readState() {
        return undefined;
      },
      state,
      dispatch(update) {
        swap(state, update);
      },
    } as any,
    api: {} as any,
  };
}

function createApi(container) {
  Object.assign(container.api, (createMenuApi()(container.context) as any)(container.api, moduleMetadata));
  return container.api;
}

const moduleMetadata = {
  name: 'my-module',
  version: '1.0.0',
  link: undefined,
  custom: undefined,
  hash: '123',
};

describe('Create Menu API Extensions', () => {
  it('createMenuApi can register and unregister a menu', () => {
    const container = createMockContainer();
    container.context.registerMenuItem = jest.fn();
    container.context.unregisterMenuItem = jest.fn();
    const api = createApi(container);
    api.registerMenu('my-menu', StubComponent);
    expect(container.context.registerMenuItem).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterMenuItem).toHaveBeenCalledTimes(0);
    api.unregisterMenu('my-menu');
    expect(container.context.unregisterMenuItem).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterMenuItem.mock.calls[0][0]).toBe(
      container.context.registerMenuItem.mock.calls[0][0],
    );
  });

  it('createMenuApi can dispose a registered menu', () => {
    const container = createMockContainer();
    container.context.registerMenuItem = jest.fn();
    container.context.unregisterMenuItem = jest.fn();
    const api = createApi(container);
    const dispose = api.registerMenu('my-menu', StubComponent);
    expect(container.context.registerMenuItem).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterMenuItem).toHaveBeenCalledTimes(0);
    dispose();
    expect(container.context.unregisterMenuItem).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterMenuItem.mock.calls[0][0]).toBe(
      container.context.registerMenuItem.mock.calls[0][0],
    );
  });

  it('createMenuApi can dispose an anonymous menu', () => {
    const container = createMockContainer();
    container.context.registerMenuItem = jest.fn();
    container.context.unregisterMenuItem = jest.fn();
    const api = createApi(container);
    const dispose = api.registerMenu(StubComponent);
    expect(container.context.registerMenuItem).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterMenuItem).toHaveBeenCalledTimes(0);
    dispose();
    expect(container.context.unregisterMenuItem).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterMenuItem.mock.calls[0][0]).toBe(
      container.context.registerMenuItem.mock.calls[0][0],
    );
  });
});
