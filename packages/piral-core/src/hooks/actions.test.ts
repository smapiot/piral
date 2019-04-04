import { useActions } from './actions';

const fn = jest.fn();

jest.mock('react', () => {
  return {
    createContext: jest.fn(),
    useContext: () => ({ foo: fn, bar: fn, state: {} }),
  };
});

describe('Actions Hook Module', () => {
  it('selects all available functions from context', () => {
    const result = useActions();
    expect(result).toEqual({
      foo: fn,
      bar: fn,
    });
  });
});
