import { Atom, swap } from '@dbeining/react-atom';
import { createLazyApi } from './create';

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

describe('Piral-Lazy create module', () => {
  it('appends lazy loading for a DOM component', () => {
    const { context } = createMockContainer();
    const load = () => Promise.resolve({});
    const api: any = createLazyApi()(context);
    const lazyComponent = api.fromLazy(load);
    expect(lazyComponent.type).toBe('lazy');
    expect(lazyComponent.load).toBe(load);
  });
});
