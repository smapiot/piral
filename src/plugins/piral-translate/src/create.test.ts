/**
 * @vitest-environment jsdom
 */
import create from 'zustand';
import { describe, it, expect } from 'vitest';
import { createLocaleApi, setupLocalizer } from './create';

describe('Create Localize API', () => {
  const state = create(() => ({}));
  const context: any = {
    defineActions() {},
    state,
    readState(cb) {
      return cb(state.getState());
    },
    dispatch(update) {
      state.setState(update(state.getState()));
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

  it('createApi can translate from local-global translations using the current language and passed nested translations', () => {
    const config = {
      language: 'en',
    };
    const api = (createLocaleApi(setupLocalizer(config))(context) as any)();
    api.setTranslations({
      en: {
        header: {
          title: 'Hello world',
        },
      },
    });
    const result = api.translate('header.title');
    expect(result).toBe('Hello world');
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

  it('addTranslations should add new translations if no value exists yet for the combination of language and key', (): void => {
    const config = {
      language: 'fr',
      messages: {
        fr: {
          foo: 'fóo',
          bar: 'bár',
        },
      },
    };
    const messagesToAdd = {
      fr: {
        foo: 'fóo (new)',
        bar: 'bár (new)',
        baz: 'báz (new)',
      },
    };
    const api = (createLocaleApi(setupLocalizer(config))(context) as any)();
    api.addTranslations([messagesToAdd]);
    const result = api.translate('baz');

    expect(result).toEqual(messagesToAdd.fr.baz);
  });

  it('addTranslations should add new translations if overwriting is enabled and a value already exists for the combination of language and key', (): void => {
    const config = {
      language: 'fr',
      messages: {
        fr: {
          foo: 'fóo',
          bar: 'bár',
        },
      },
    };
    const messagesToAdd = {
      fr: {
        foo: 'fóo (new)',
        bar: 'bár (new)',
        baz: 'báz (new)',
      },
    };
    const api = (createLocaleApi(setupLocalizer(config))(context) as any)();
    api.addTranslations([messagesToAdd]);
    const result = api.translate('bar');

    expect(result).toEqual(messagesToAdd.fr.bar);
  });

  it('addTranslations should not add new translations if overwriting is disabled and a value already exists for the combination of language and key', (): void => {
    const config = {
      language: 'fr',
      messages: {
        fr: {
          foo: 'fóo',
          bar: 'bár',
        },
      },
    };
    const messagesToAdd = {
      fr: {
        foo: 'fóo (neu)',
        bar: 'bár (neu)',
        baz: 'báz',
      },
    };
    const api = (createLocaleApi(setupLocalizer(config))(context) as any)();
    api.addTranslations([messagesToAdd], false);
    const result = api.translate('bar');

    expect(result).toEqual(config.messages.fr.bar);
  });
});
