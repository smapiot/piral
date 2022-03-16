/**
 * @jest-environment node
 */
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

describe('Media Module', () => {
  it('in here window should be undefined', () => {
    expect(typeof window).toBe('undefined');
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
});
