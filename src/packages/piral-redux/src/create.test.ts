import { Atom, swap } from '@dbeining/react-atom';
import { createReduxApi } from './create';

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
        return read(state);
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
  });
});
