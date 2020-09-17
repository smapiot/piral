import { Atom, swap } from '@dbeining/react-atom';
import { createElement, SFC } from 'react';
import { createFeedsApi } from './create';

const StubComponent: SFC = (props) => createElement('div', props);
StubComponent.displayName = 'StubComponent';

function createMockContainer() {
  const state = Atom.of({});
  return {
    context: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      defineActions() {},
      state,
      dispatch(update) {
        swap(state, update);
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
    container.context.createFeed = jest.fn();
    container.context.loadFeed = jest.fn();
    const api = (createFeedsApi()(container.context) as any)(container.api, moduleMetadata);
    api.createConnector(() => Promise.resolve(true));
    expect(container.context.createFeed).toHaveBeenCalled();
    expect(container.context.loadFeed).not.toHaveBeenCalled();
  });

  it('createCoreApi can immediately start loading the created feed', () => {
    const container = createMockContainer();
    container.context.createFeed = jest.fn();
    container.context.loadFeed = jest.fn();
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
    container.context.createFeed = jest.fn();
    container.context.loadFeed = jest.fn();
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
    container.context.createFeed = jest.fn();
    container.context.loadFeed = jest.fn();
    const api = (createFeedsApi()(container.context) as any)(container.api, moduleMetadata);
    const connect = api.createConnector(() => Promise.resolve(true));
    const NewComponent = connect(StubComponent);
    expect(NewComponent.displayName).toBe('FeedView_my-module://0');
  });
});
