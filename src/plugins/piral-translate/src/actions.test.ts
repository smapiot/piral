import { Atom, deref } from '@dbeining/react-atom';
import { createListener } from 'piral-base';
import { createActions as ca } from 'piral-core';
import { createActions } from './actions';

describe('Translation Action Module', () => {
  it('selectLanguage changes the current language', () => {
    const state = Atom.of({
      foo: 5,
      language: {
        foo: 10,
        loading: false,
        selected: 'fr',
      },
    });
    const localizer = {
      language: 'en',
      languages: ['en'],
      messages: {},
      localizeGlobal() {
        return '';
      },
      localizeLocal() {
        return '';
      },
    };
    const actions = createActions(localizer);
    const ctx = ca(state, createListener({}));
    actions.selectLanguage(ctx, 'de');
    expect(deref(state)).toEqual({
      foo: 5,
      language: {
        foo: 10,
        loading: false,
        selected: 'de',
      },
    });
  });
});
