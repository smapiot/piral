import { Atom, swap } from '@dbeining/react-atom';
import { createContainersApi } from './create';

function createMockContainer() {
  const state = Atom.of({});
  return {
    context: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
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

describe('Piral-Containers create module', () => {
  it('creates an empty container', () => {
    const { context } = createMockContainer();
    const api = createContainersApi()(context);
  });
});
