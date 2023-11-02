import { describe, it, expect, vitest } from 'vitest';
import { useAction } from './action';

vitest.mock('react', () => {
  return {
    createContext: vitest.fn(),
    useContext: () => ({ foo: vitest.fn(), bar: vitest.fn() }),
  };
});

describe('Action Module', () => {
  it('selects available function from context', () => {
    const result = useAction('foo' as any);
    expect(typeof result).toBe('function');
  });

  it('does not get unavailable function from context', () => {
    const result = useAction('qxz' as any);
    expect(typeof result).not.toBe('function');
  });
});
