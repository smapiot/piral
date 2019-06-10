import * as piralCore from 'piral-core';
import { createLocaleApi, setupLocalizer } from './create';

jest.mock('piral-core');

const config = {
  messages: {
    fr: {
      foo: 'bár',
      bar: 'bár',
    },
  },
};

describe('Create Localize API', () => {
  it('createApi can translate from global translations using the current language', () => {
    piralCore.useGlobalState = jest.fn(f =>
      f({
        app: {
          language: {
            selected: 'fr',
          },
        },
      }),
    );
    const api = createLocaleApi(setupLocalizer(config));
    const result = api.translate('foo');
    expect(result).toEqual('bár');
  });

  it('createApi can translate from local translations using the current language', () => {
    piralCore.useGlobalState = jest.fn(f =>
      f({
        app: {
          language: {
            selected: 'fr',
          },
        },
      }),
    );
    const api = createLocaleApi(setupLocalizer(config));
    api.provideTranslations({
      fr: {
        foo: 'boo',
      },
    });
    const result = api.translate('foo');
    expect(result).toEqual('boo');
  });

  it('createApi can translate from local-global translations using the current language', () => {
    piralCore.useGlobalState = jest.fn(f =>
      f({
        app: {
          language: {
            selected: 'fr',
          },
        },
      }),
    );
    const api = createLocaleApi(setupLocalizer(config));
    api.provideTranslations({
      fr: {
        foo: 'boo',
      },
    });
    const result = api.translate('bar');
    expect(result).toEqual('bár');
  });

  it('createApi falls back to standard string if language is not found', () => {
    piralCore.useGlobalState = jest.fn(f =>
      f({
        app: {
          language: {
            selected: 'en',
          },
        },
      }),
    );
    const api = createLocaleApi(setupLocalizer(config));
    const result = api.translate('bar');
    expect(result).toEqual('__en_bar__');
  });

  it('createApi falls back to standard string if key is not found', () => {
    piralCore.useGlobalState = jest.fn(f =>
      f({
        app: {
          language: {
            selected: 'fr',
          },
        },
      }),
    );
    const api = createLocaleApi(setupLocalizer(config));
    const result = api.translate('qxz');
    expect(result).toEqual('__fr_qxz__');
  });
});
