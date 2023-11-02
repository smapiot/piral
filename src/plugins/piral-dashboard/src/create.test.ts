/**
 * @vitest-environment jsdom
 */
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { createElement, FC } from 'react';
import { createDashboardApi } from './create';

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
  Object.assign(container.api, (createDashboardApi()(container.context) as any)(container.api, moduleMetadata));
  return container.api;
}

const moduleMetadata = {
  name: 'my-module',
  version: '1.0.0',
  link: undefined,
  custom: undefined,
  hash: '123',
};

describe('Create Dashboard API Extensions', () => {
  it('createDashboardApi can register and unregister a tile', () => {
    const container = createMockContainer();
    container.context.registerTile = vitest.fn();
    container.context.unregisterTile = vitest.fn();
    const api = createApi(container);
    api.registerTile('my-tile', StubComponent);
    expect(container.context.registerTile).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterTile).toHaveBeenCalledTimes(0);
    api.unregisterTile('my-tile');
    expect(container.context.unregisterTile).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterTile.mock.calls[0][0]).toBe(container.context.registerTile.mock.calls[0][0]);
  });

  it('createDashboardApi can dispose a registered tile', () => {
    const container = createMockContainer();
    container.context.registerTile = vitest.fn();
    container.context.unregisterTile = vitest.fn();
    const api = createApi(container);
    const dispose = api.registerTile('my-tile', StubComponent);
    expect(container.context.registerTile).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterTile).toHaveBeenCalledTimes(0);
    dispose();
    expect(container.context.unregisterTile).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterTile.mock.calls[0][0]).toBe(container.context.registerTile.mock.calls[0][0]);
  });

  it('createDashboardApi can dispose an anonymous tile', () => {
    const container = createMockContainer();
    container.context.registerTile = vitest.fn();
    container.context.unregisterTile = vitest.fn();
    const api = createApi(container);
    const dispose = api.registerTile(StubComponent);
    expect(container.context.registerTile).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterTile).toHaveBeenCalledTimes(0);
    dispose();
    expect(container.context.unregisterTile).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterTile.mock.calls[0][0]).toBe(container.context.registerTile.mock.calls[0][0]);
  });
});
