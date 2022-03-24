import { Atom, swap, deref } from '@dbeining/react-atom';
import { createLocaleApi, setupLocalizer } from './create';

describe('Create Localize API', () => {
  const state = Atom.of({});
  const context: any = {
    defineActions() {},
    state,
    readState(cb) {
      return cb(deref(state));
    },
    dispatch(update) {
      swap(state, update);
    },
  };

  it('createApi can translate from global translations using the current language', () => {
    const config = {
      language: 'fr',
      messages: {
        fr: {
          foo: 'bár',
          bar: 'bár',
        },
      },
    };
    const api = (createLocaleApi(setupLocalizer(config))(context) as any)();
    const result = api.translate('foo');
    expect(result).toEqual('bár');
  });

  it('createApi can translate from local translations using the current language', () => {
    const config = {
      language: 'fr',
      messages: {
        fr: {
          foo: 'bár',
          bar: 'bár',
        },
      },
    };
    const api = (createLocaleApi(setupLocalizer(config))(context) as any)();
    api.setTranslations({
      fr: {
        foo: 'boo',
      },
    });
    const result = api.translate('foo');
    expect(result).toEqual('boo');
  });

  it('createApi can translate from local-global translations using the current language', () => {
    const config = {
      language: 'fr',
      messages: {
        fr: {
          foo: 'bár',
          bar: 'bár',
        },
      },
    };
    const api = (createLocaleApi(setupLocalizer(config))(context) as any)();
    api.setTranslations({
      fr: {
        foo: 'boo',
      },
    });
    const result = api.translate('bar');
    expect(result).toEqual('bár');
  });

  it('createApi falls back to standard string if language is not found', () => {
    const config = {
      language: 'en',
      messages: {
        fr: {
          foo: 'bár',
          bar: 'bár',
        },
      },
    };
    const api = (createLocaleApi(setupLocalizer(config))(context) as any)();
    const result = api.translate('bar');
    expect(result).toEqual('__en_bar__');
  });

  it('createApi falls back to standard string if key is not found', () => {
    const config = {
      language: 'fr',
      messages: {
        fr: {
          foo: 'bár',
          bar: 'bár',
        },
      },
    };
    const api = (createLocaleApi(setupLocalizer(config))(context) as any)();
    const result = api.translate('qxz');
    expect(result).toEqual('__fr_qxz__');
  });

  it('getTranslations return the translations', () => {
    const config = {
      language: 'fr',
      messages: {
        fr: {
          foo: 'bár',
          bar: 'bár',
        },
      },
    };
    const api = (createLocaleApi(setupLocalizer(config))(context) as any)();
    api.setTranslations({
      fr: {
        foo: 'boo',
      },
    });
    const result = api.getTranslations();
    expect(result).toEqual({ fr: { foo: 'boo' } });
  });

  it('getCurrentLanguage return the current language', () => {
    const config = {
      language: 'fr',
      messages: {
        fr: {
          foo: 'bár',
          bar: 'bár',
        },
      },
    };
    const api = (createLocaleApi(setupLocalizer(config))(context) as any)();
    const result = api.getCurrentLanguage();
    expect(result).toEqual('fr');
  });
});
