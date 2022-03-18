import { withRootExtension } from './state';
import { RootListener } from '../RootListener';

describe('State Module', () => {
  it('withRootExtension should create an extension', () => {
    const dispatch = withRootExtension('testNmae', RootListener);
    const result = dispatch({ registry: { extensions: {} } });
    expect(result).not.toBe('undefined');
    expect(result['registry']['extensions']['testNmae']).toBeTruthy();
  });
});
