/**
 * @vitest-environment jsdom
 */
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { createElement, FC } from 'react';
import { createTrackerApi } from './create';

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
  Object.assign(container.api, (createTrackerApi()(container.context) as any)(container.api, moduleMetadata));
  return container.api;
}

const moduleMetadata = {
  name: 'my-module',
  version: '1.0.0',
  link: undefined,
  custom: undefined,
  hash: '123',
};

describe('Create Tracker API Extensions', () => {
  it('createTrackerApi can register and unregister a tracker', () => {
    const container = createMockContainer();
    container.context.registerTracker = vitest.fn();
    container.context.unregisterTracker = vitest.fn();
    const api = createApi(container);
    api.registerTracker('my-tracker', StubComponent);
    expect(container.context.registerTracker).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterTracker).toHaveBeenCalledTimes(0);
    api.unregisterTracker('my-tracker');
    expect(container.context.unregisterTracker).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterTracker.mock.calls[0][0]).toBe(
      container.context.registerTracker.mock.calls[0][0],
    );
  });

  it('createTrackerApi can dispose a registered tracker', () => {
    const container = createMockContainer();
    container.context.registerTracker = vitest.fn();
    container.context.unregisterTracker = vitest.fn();
    const api = createApi(container);
    const dispose = api.registerTracker('my-tracker', StubComponent);
    expect(container.context.registerTracker).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterTracker).toHaveBeenCalledTimes(0);
    dispose();
    expect(container.context.unregisterTracker).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterTracker.mock.calls[0][0]).toBe(
      container.context.registerTracker.mock.calls[0][0],
    );
  });

  it('createTrackerApi can dispose an anonymous tracker', () => {
    const container = createMockContainer();
    container.context.registerTracker = vitest.fn();
    container.context.unregisterTracker = vitest.fn();
    const api = createApi(container);
    const dispose = api.registerTracker(StubComponent);
    expect(container.context.registerTracker).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterTracker).toHaveBeenCalledTimes(0);
    dispose();
    expect(container.context.unregisterTracker).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterTracker.mock.calls[0][0]).toBe(
      container.context.registerTracker.mock.calls[0][0],
    );
  });
});
