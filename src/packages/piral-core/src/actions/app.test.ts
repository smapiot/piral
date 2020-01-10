import { Atom, deref } from '@dbeining/react-atom';
import { changeLayout } from './app';
import { createListener } from '../utils';
import { createActions } from '../state';

describe('App Actions Module', () => {
  it('changeLayout changes the current layout', () => {
    const state = Atom.of({
      foo: 5,
      app: {
        layout: 'tablet',
      },
    });
    const ctx = createActions(state, createListener({}));
    changeLayout(ctx, 'mobile');
    expect(deref(state)).toEqual({
      foo: 5,
      app: {
        layout: 'mobile',
      },
    });
  });
});
