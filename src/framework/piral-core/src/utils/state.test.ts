import { describe, it, expect } from 'vitest';
import { withAll, withRootExtension } from './state';
import { RootListener } from '../RootListener';

describe('State Module', () => {
  it('withRootExtension should create an extension key', () => {
    const dispatch = withRootExtension('test', RootListener);
    const result = dispatch({ registry: { extensions: {} } } as any);
    expect(result['registry']['extensions']['test']).toBeTruthy();
  });

  it('withAll should return identity state with no dispatcher', () => {
    const dispatchers = withAll();
    const result = dispatchers({ state: ['foo', 'boo'] } as any);
    expect(result).toEqual({ state: ['foo', 'boo'] });
  });

  it('withAll should return identity state with identity dispatcher', () => {
    const dispatchers = withAll((s) => s);
    const result = dispatchers({ state: ['foo', 'boo'] } as any);
    expect(result).toEqual({ state: ['foo', 'boo'] });
  });

  it('withAll should return empty state with blank dispatcher', () => {
    const dispatchers = withAll((s) => ({} as any));
    const result = dispatchers({ state: ['foo', 'boo'] } as any);
    expect(result).toEqual({});
  });

  it('withAll should return mutated state of all dispatchers', () => {
    const dispatchers = withAll(
      (s) => ({ ...s, foo: 'bar' }),
      (s) => ({ ...s, bar: 'qxz' }),
    );
    const result = dispatchers({ state: ['foo', 'boo'] } as any);
    expect(result).toEqual({ state: ['foo', 'boo'], foo: 'bar', bar: 'qxz' });
  });
});
