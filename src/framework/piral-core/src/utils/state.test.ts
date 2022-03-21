import * as hooks from '../hooks';
import { withAll, withRootExtension } from './state';
import { RootListener } from '../RootListener';
import { createGlobalState } from '../state';

describe('State Module', () => {
  it('withRootExtension should create an extension', () => {
    const dispatch = withRootExtension('testNmae', RootListener);
    const result = dispatch({ registry: { extensions: {} } });
    expect(result).not.toBe('undefined');
    expect(result['registry']['extensions']['testNmae']).toBeTruthy();
  });

  it('withAll should return state with dispatchers (s) => s', () => {
    const dispatchers = withAll((s) => s);
    const result = dispatchers({ state: ['foo', 'boo'] });
    expect(result).toEqual({ state: ['foo', 'boo'] });
  });

  it('withAll should return state with dispatchers (s => ({ }))', () => {
    const dispatchers = withAll((s) => ({}));
    const result = dispatchers({});
    expect(result).toEqual({});
  });

  it('withAll should return state with dispatchers with some state', () => {
    const dispatchers = withAll(
      (s) => ({ ...s, foo: 'bar' }),
      (s) => ({ ...s, bar: 'qxz' }),
    );
    const result = dispatchers({ state: 'foo' });
    expect(result).toEqual({ state: 'foo', bar: 'qxz', foo: 'bar' });
  });
});
