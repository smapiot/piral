/**
 * @vitest-environment jsdom
 */
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { createElement, FC } from 'react';
import { createFeedsApi } from './create';

const StubComponent: FC = (props) => createElement('div', props);
StubComponent.displayName = 'StubComponent';

function createMockContainer() {
  const state = create(() => ({}));
  return {
    context: {
      on: vitest.fn(),
      off: vitest.fn(),
      emit: vitest.fn(),
      defineActions() {},
      state,
      dispatch(update) {
        state.setState(update(state.getState()));
      },
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

describe('Create Feeds API Extensions', () => {
  it('createCoreApi provides the option to create a feed connector', () => {
    const container = createMockContainer();
    container.context.createFeed = vitest.fn();
    container.context.loadFeed = vitest.fn();
    const api = (createFeedsApi()(container.context) as any)(container.api, moduleMetadata);
    api.createConnector(() => Promise.resolve(true));
    expect(container.context.createFeed).toHaveBeenCalled();
    expect(container.context.loadFeed).not.toHaveBeenCalled();
  });

  it('createCoreApi can immediately start loading the created feed', () => {
    const container = createMockContainer();
    container.context.createFeed = vitest.fn();
    container.context.loadFeed = vitest.fn();
    const api = (createFeedsApi()(container.context) as any)(container.api, moduleMetadata);
    api.createConnector({
      initialize: () => Promise.resolve(true),
      connect: () => () => {},
      update: () => Promise.resolve({}),
      immediately: true,
    });
    expect(container.context.createFeed).not.toHaveBeenCalled();
    expect(container.context.loadFeed).toHaveBeenCalled();
  });

  it('createCoreApi can invalidate the loaded feed', () => {
    const container = createMockContainer();
    container.context.createFeed = vitest.fn();
    container.context.loadFeed = vitest.fn();
    const api = (createFeedsApi()(container.context) as any)(container.api, moduleMetadata);
    const connect = api.createConnector({
      initialize: () => Promise.resolve(true),
      connect: () => () => {},
      update: () => Promise.resolve({}),
      immediately: true,
    });
    connect.invalidate();
    expect(container.context.createFeed).toHaveBeenCalled();
    expect(container.context.loadFeed).toHaveBeenCalled();
  });

  it('createCoreApi allows using the created feed connector as a HOC', () => {
    const container = createMockContainer();
    container.context.createFeed = vitest.fn();
    container.context.loadFeed = vitest.fn();
    const api = (createFeedsApi()(container.context) as any)(container.api, moduleMetadata);
    const connect = api.createConnector(() => Promise.resolve(true));
    const NewComponent = connect(StubComponent);
    expect(NewComponent.displayName).toBe('FeedView_my-module://0');
  });
});
