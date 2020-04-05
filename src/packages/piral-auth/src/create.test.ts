import { Atom, swap, deref } from '@dbeining/react-atom';
import { createAuthApi } from './create';

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
        return read(deref(state));
      },
      dispatch(update) {
        swap(state, update);
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
