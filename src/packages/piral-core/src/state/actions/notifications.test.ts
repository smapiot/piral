import { Atom, deref } from '@dbeining/react-atom';
import { openNotification, closeNotification } from './notifications';

describe('Notifications Actions Module', () => {
  it('openNotification prepends a new notification', () => {
    const state = Atom.of({
      foo: 5,
      app: {
        bar: 5,
        notifications: ['b'],
      },
    });
    openNotification(state, 'a');
    expect(deref(state)).toEqual({
      foo: 5,
      app: {
        bar: 5,
        notifications: ['a', 'b'],
      },
    });
  });

  it('closeNotification removes an existing notification', () => {
    const state = Atom.of({
      foo: 5,
      app: {
        bar: 5,
        notifications: ['a', 'b', 'c'],
      },
    });
    closeNotification(state, 'b');
    expect(deref(state)).toEqual({
      foo: 5,
      app: {
        bar: 5,
        notifications: ['a', 'c'],
      },
    });
  });
});
