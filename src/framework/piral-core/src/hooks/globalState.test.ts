import { useGlobalState } from './globalState';

jest.mock('react', () => {
  const { Atom } = require('@libre/atom');
  const state = Atom.of({
    foo: 5,
    bar: {
      qxz: 'hello',
    },
    list: [1, 2, 3],
  });
  return {
    createContext: jest.fn(),
    useContext: () => ({ state }),
    useState: (v) => [v, jest.fn()],
    useMemo: (f) => f(),
    useLayoutEffect: (f) => f(),
  };
});

describe('GlobalState Hook Module', () => {
  it('selects key from state', () => {
    const result = useGlobalState((m) => (m as any).foo);
    expect(result).toBe(5);
  });

  it('gets full state object', () => {
    const result = useGlobalState();
    expect(result).toEqual({
      foo: 5,
      bar: {
        qxz: 'hello',
      },
      list: [1, 2, 3],
    });
  });

  it('selects nested values', () => {
    const result = useGlobalState((m) => (m as any).bar.qxz);
    expect(result).toBe('hello');
  });

  it('selection works against array members', () => {
    const result = useGlobalState((m) => (m as any).list[2]);
    expect(result).toBe(3);
  });
});
