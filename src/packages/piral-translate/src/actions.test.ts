import { Atom, deref } from '@dbeining/react-atom';
import { createActions } from './actions';

describe('Translation Action Module', () => {
  it('selectLanguage changes the current language', () => {
    const state = Atom.of({
      foo: 5,
      language: {
        foo: 10,
        selected: 'fr',
      },
    });
    const localizer = {
      language: 'en',
      messages: {},
      localizeGlobal() {
        return '';
      },
      localizeLocal() {
        return '';
      },
    };
    const actions = createActions(localizer);
    actions.selectLanguage(state, 'de');
    expect(deref(state)).toEqual({
      foo: 5,
      language: {
        foo: 10,
        selected: 'de',
      },
    });
  });
});
