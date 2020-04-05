import { Atom } from '@dbeining/react-atom';
import { defineAction, defineActions } from './define';

function createMockContainer(initialState = {}) {
  const state = Atom.of(initialState);
  return {
    context: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
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
