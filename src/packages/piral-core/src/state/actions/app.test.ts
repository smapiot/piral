import { Atom, deref } from '@dbeining/react-atom';
import { changeLayout, selectLanguage } from './app';

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
    changeLayout.call(state, 'mobile');
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
    selectLanguage.call(state, 'de');
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
