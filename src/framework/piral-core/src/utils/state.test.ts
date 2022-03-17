import { Atom, deref } from '@dbeining/react-atom';
import { createListener } from 'piral-base';
import { createActions } from '../state';
import { withPage } from './state';

describe('state Module', () => {
  it('withPage', () => {
    // const state = Atom.of({
    //   app: {
    //     layout: 'tablet',
    //   },
    // });
    // const ctx = createActions(state, createListener({}));
    withPage('pageTest', {});
  });
});
