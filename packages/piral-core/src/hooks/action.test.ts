import { useAction } from './action';

jest.mock('react', () => {
  return {
    createContext: jest.fn(),
    useContext: () => ({ foo: jest.fn(), bar: jest.fn() }),
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
