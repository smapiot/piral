/**
 * @vitest-environment jsdom
 */
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { createUpdateApi } from './create';

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

describe('Create Update API Extensions', () => {
  it('createUpdateApi can set updatability', () => {
    const container = createMockContainer();
    container.context.setUpdateMode = vitest.fn();
    const api = (createUpdateApi()(container.context) as any)(container.api, moduleMetadata);
    api.canUpdate('allow');
    expect(container.context.setUpdateMode).toHaveBeenCalledTimes(1);
    api.canUpdate('block');
    expect(container.context.setUpdateMode).toHaveBeenCalledTimes(2);
  });
});
