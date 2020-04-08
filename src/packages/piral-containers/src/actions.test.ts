import { Atom, swap, deref } from '@dbeining/react-atom';
import { createState, destroyState, replaceState } from './actions';

function createMockContainer() {
  const state = Atom.of({});
  return {
    context: {
      converters: {},
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

describe('Piral-Containers actions module', () => {
  it('creates a substate if desired', () => {
    const { context } = createMockContainer();
    const initialData = {
      bar: 'qxz',
    };
    createState(context, 'foo', initialData);
    const state: any = deref(context.state);
    expect(state.containers.foo).toBe(initialData);
  });

  it('destroys the substate if desired', () => {
    const { context } = createMockContainer();
    const initialData = {
      bar: 'qxz',
    };
    createState(context, 'foo', initialData);
    destroyState(context, 'foo');
    const state: any = deref(context.state);
    expect(state.containers.foo).toBeUndefined();
  });

  it('updates the substate with something new if desired', () => {
    const { context } = createMockContainer();
    const initialData = {
      bar: 'qxz',
    };
    const updatedData = {
      q: true,
    };
    createState(context, 'foo', initialData);
    replaceState(context, 'foo', state => updatedData);
    const state: any = deref(context.state);
    expect(state.containers.foo).toEqual({
      ...initialData,
      ...updatedData,
    });
  });

  it('updates the substate with changed if desired', () => {
    const { context } = createMockContainer();
    const initialData = {
      bar: 'qxz',
    };
    const updatedData = {
      bar: 42,
    };
    createState(context, 'foo', initialData);
    replaceState(context, 'foo', state => updatedData);
    const state: any = deref(context.state);
    expect(state.containers.foo).toEqual({
      ...initialData,
      ...updatedData,
    });
  });

  it('updates the substate with changed if desired', () => {
    const { context } = createMockContainer();
    const initialData = {
      bar: 'qxz',
    };
    createState(context, 'foo', initialData);
    replaceState(context, 'foo', state => state);
    const state: any = deref(context.state);
    expect(state.containers.foo).toEqual(initialData);
  });
});
