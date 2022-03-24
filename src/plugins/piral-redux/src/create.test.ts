import { Atom, swap, deref } from '@dbeining/react-atom';
import { createReduxApi } from './create';
import { MyComponent } from './MyComponent';

function createMockContainer() {
  const state = Atom.of({});
  return {
    context: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      includeProvider() {},
      defineActions() {},
      state,
      readState(read) {
        return read(deref(state));
      },
      dispatch(update) {
        swap(state, update);
      },
    } as any,
    api: {} as any,
  };
}

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
