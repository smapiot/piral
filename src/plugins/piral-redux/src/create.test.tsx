/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import create from 'zustand';
import { describe, it, vitest } from 'vitest';
import { createReduxApi } from './create';

function createMockContainer() {
  const state = create(() => ({}));
  return {
    context: {
      on: vitest.fn(),
      off: vitest.fn(),
      emit: vitest.fn(),
      includeProvider() {},
      defineActions() {},
      state,
      readState(read) {
        return read(state.getState());
      },
      dispatch(update) {
        state.setState(update(state.getState()));
      },
    } as any,
    api: {} as any,
  };
}

const MyComponent: React.FC = () => <div>Component</div>;
MyComponent.displayName = 'MyComponent';

describe('Piral-Redux create module', () => {
  it('creates a new substate', () => {
    const { context } = createMockContainer();
    const apiCreator: any = createReduxApi()(context);
    const api = apiCreator(undefined, {
      name: 'test',
    });
    api.createReduxStore(() => {})(MyComponent);
  });
});
