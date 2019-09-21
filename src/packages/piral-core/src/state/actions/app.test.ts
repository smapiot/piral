import { Atom, deref } from '@dbeining/react-atom';
import { changeLayout } from './app';
import { createListener } from '../../utils';

describe('App Actions Module', () => {
  it('changeLayout changes the current layout', () => {
    const state = Atom.of({
      foo: 5,
      app: {
        layout: {
          foo: 10,
          current: 'tablet',
        },
      },
    });
    const events = createListener(undefined);
    changeLayout.call(events, state, 'mobile');
    expect(deref(state)).toEqual({
      foo: 5,
      app: {
        layout: {
          foo: 10,
          current: 'mobile',
        },
      },
    });
  });
});
