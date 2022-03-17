import { withAll, withRootExtension } from './state';
import { RootListener } from '../RootListener';
import { Atom } from '@dbeining/react-atom';
import { GlobalState } from '../types';

describe('State Modul', () => {
  const state: GlobalState = Atom.of({
    app: {},
    components: {},
  });
  it('withAll should return all state with dispatchers', () => {
    const result = withAll(state);
    expect(result).not.toEqual({});
  });

  it('withRootExtension', () => {
    const result = withRootExtension('testNmae', RootListener);
    expect(result).not.toEqual({});
  });
});
