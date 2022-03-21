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

  it('withAll', () => {
    const dispatcher = withAll((state) => state);
    const result = dispatcher({ state: 'foo' });
    expect(result).toEqual({ state: 'foo' });
  });
});
