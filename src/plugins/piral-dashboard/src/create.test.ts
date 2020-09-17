import { Atom, swap } from '@dbeining/react-atom';
import { createElement, SFC } from 'react';
import { createDashboardApi } from './create';

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

describe('Create Dashboard API Extensions', () => {
  it('createCoreApi can register and unregister a tile', () => {
    const container = createMockContainer();
    container.context.registerTile = jest.fn();
    container.context.unregisterTile = jest.fn();
    const api = (createDashboardApi()(container.context) as any)(container.api, moduleMetadata);
    api.registerTile('my-tile', StubComponent);
    expect(container.context.registerTile).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterTile).toHaveBeenCalledTimes(0);
    api.unregisterTile('my-tile');
    expect(container.context.unregisterTile).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterTile.mock.calls[0][0]).toBe(container.context.registerTile.mock.calls[0][0]);
  });
});
