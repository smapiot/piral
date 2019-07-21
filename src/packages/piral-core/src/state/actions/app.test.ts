import { Atom, deref } from '@dbeining/react-atom';
import { changeLayout, selectLanguage } from './app';
import { createListener } from '../../modules/events';

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

  it('selectLanguage changes the current language', () => {
    const state = Atom.of({
      foo: 5,
      app: {
        language: {
          foo: 10,
          selected: 'fr',
        },
      },
    });
    const events = createListener(undefined);
    selectLanguage.call(events, state, 'de');
    expect(deref(state)).toEqual({
      foo: 5,
      app: {
        language: {
          foo: 10,
          selected: 'de',
        },
      },
    });
  });
});
