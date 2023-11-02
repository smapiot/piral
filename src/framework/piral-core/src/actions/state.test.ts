import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { readState, dispatch } from './state';

function createMockContainer(initialState = {}) {
  const state = create(() => initialState);
  return {
    context: {
      on: vitest.fn(),
      off: vitest.fn(),
      emit: vitest.fn(),
      defineActions() {},
      state,
      read() {
        return state.getState();
      },
    } as any,
  };
}

describe('Piral-Core state actions', () => {
  it('readState gets the current state', () => {
    const { context } = createMockContainer({
      test: 42,
    });
    const result = readState(context, (state: any) => state.test);
    expect(result).toBe(42);
  });

  it('dispatch updates the current state', () => {
    const { context } = createMockContainer({
      test: 0,
    });
    const result = dispatch(context, (state: any) => ({
      ...state,
      test: 11,
    }));
    expect(context.read().test).toBe(11);
  });
});
