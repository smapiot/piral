import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { defineAction, defineActions } from './define';

function createMockContainer(initialState = {}) {
  const state = create(() => initialState);
  return {
    context: {
      on: vitest.fn(),
      off: vitest.fn(),
      emit: vitest.fn(),
      state,
    } as any,
  };
}

describe('Piral-Core define actions', () => {
  it('defineAction adds a single action with bind', () => {
    const { context } = createMockContainer();
    defineAction(context, 'test', (ctx, name) => `Hello ${name}!`);
    const result = context.test('Bernd');
    expect(result).toBe(`Hello Bernd!`);
  });

  it('defineActions adds an object of actions with bind', () => {
    const { context } = createMockContainer();
    defineActions(context, {
      foo(ctx) {
        return 'Hi foo.';
      },
      bar(ctx, name) {
        return `Hi ${name}!`;
      },
    });
    expect(context.foo()).toBe(`Hi foo.`);
    expect(context.bar('qxz')).toBe(`Hi qxz!`);
  });
});
