import { describe, it, expect, vitest } from 'vitest';
import { useActions } from './actions';

const fn = vitest.fn();

vitest.mock('react', () => {
  return {
    createContext: vitest.fn(),
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
