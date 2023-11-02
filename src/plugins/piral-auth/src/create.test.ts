/**
 * @vitest-environment jsdom
 */
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { createAuthApi } from './create';

function createMockContainer() {
  const state = create(() => ({}));
  return {
    context: {
      on: vitest.fn(),
      off: vitest.fn(),
      emit: vitest.fn(),
      defineActions() {},
      state,
      readState(read) {
        return read((state.getState()));
      },
      dispatch(update) {
        state.setState(update(state.getState()));
      },
    } as any,
    api: {} as any,
  };
}

describe('Piral-Auth create module', () => {
  it('createAuthApi returns undefined if not set yet', () => {
    const { context } = createMockContainer();
    const api: any = createAuthApi()(context);
    const user = api.getUser();
    expect(user).toBeUndefined();
  });

  it('createAuthApi returns the user if set initially', () => {
    const { context } = createMockContainer();
    const initialUser: any = {
      name: 'Berthold',
    };
    const api: any = createAuthApi({ user: initialUser })(context);
    const user = api.getUser();
    expect(user).toBe(initialUser);
  });
});
