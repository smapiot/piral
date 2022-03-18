import { withAll, withRootExtension } from './state';
import { RootListener } from '../RootListener';
import { Atom } from '@dbeining/react-atom';
import { GlobalState } from '../types';

describe('State Module', () => {
  it('withAll should return all state with dispatchers', () => {
    const result = withAll(state);
    expect(result).not.toEqual({});
  });

  it('withRootExtension should create an extension', () => {
    const dispatch = withRootExtension('testNmae', RootListener);
    const result = dispatch({ registry: { extensions: {} } });
    expect(result).not.toBe('undefined');
    expect(result['registry']['extensions']['testNmae']).toBeTruthy();
  });
});
