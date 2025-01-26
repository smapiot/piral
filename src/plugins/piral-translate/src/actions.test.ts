/**
 * @vitest-environment jsdom
 */
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { createActions } from './actions';

function createListener() {
  return {
    on: vitest.fn(),
    off: vitest.fn(),
    emit: vitest.fn(),
  };
}

function ca(state, listener) {
  return {
    ...listener,
    state: state.getState(),
    dispatch(change) {
      state.setState(change(state.getState()));
    },
  };
}

describe('Translation Action Module', () => {
  it('selectLanguage changes the current language', () => {
    const state: any = create(() => ({
      foo: 5,
      language: {
        foo: 10,
        loading: false,
        selected: 'fr',
      },
    }));
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
    const ctx = ca(state, createListener());
    actions.selectLanguage(ctx, 'de');
    expect(state.getState()).toEqual({
      foo: 5,
      language: {
        foo: 10,
        loading: false,
        selected: 'de',
      },
    });
  });

  it('translate', () => {
    const state: any = create(() => ({
      foo: 5,
      language: {
        foo: 10,
        loading: false,
        selected: 'fr',
      },
    }));
    const localizer = {
      language: 'fr',
      languages: ['fr'],
      messages: {
        fr: {
          bar: 'bár',
        },
      },
      localizeGlobal(key, variables) {
        const messages = {
          fr: {
            bar: 'bár',
          },
        };
        return messages.fr[key];
      },
      localizeLocal() {
        return '';
      },
    };
    const actions = createActions(localizer);
    const ctx = ca(state, createListener());
    const result = actions.translate(ctx, 'bar');
    expect(result).toEqual('bár');
  });

  it('setTranslations sets translations to the global translations', () => {
    const state: any = create(() => ({
      foo: 5,
      language: {
        foo: 10,
        loading: false,
        selected: 'fr',
      },
    }));
    const localizer = {
      language: 'de',
      languages: ['de'],
      messages: {
        de: {},
      },
      localizeGlobal() {
        return '';
      },
      localizeLocal() {
        return '';
      },
    };
    const ctx = {
      emit: vitest.fn(),
      state,
      dispatch(update) {
        state.setState(update(state.getState()));
      },
      apis: {
        firstApi: {
          getTranslations: () => {
            return localizer.messages;
          },
          setTranslations: async (translations) => {
            localizer.messages = await translations;
          },
        },
      },
    };
    const actions = createActions(localizer);
    const data = {
      global: {},
      locals: [{ name: 'firstApi', value: { car: 'Auto', table: 'Tisch' } }],
    };
    actions.setTranslations(ctx, 'de', data);
    expect(localizer.messages).toEqual({
      de: { car: 'Auto', table: 'Tisch' },
    });
  });

  it('getTranslations returns translations', () => {
    const state: any = create(() => ({
      foo: 5,
      language: {
        foo: 10,
        loading: false,
        selected: 'fr',
      },
    }));
    const localizer = {
      language: 'fr',
      languages: ['fr'],
      messages: {
        fr: {
          foo: 'bár',
        },
      },
      localizeGlobal() {
        return '';
      },
      localizeLocal() {
        return '';
      },
    };
    const actions = createActions(localizer);
    const ctx = {
      emit: vitest.fn(),
      state,
      dispatch(update) {
        state.setState(update(state.getState()));
      },
      apis: {
        firstApi: {
          getTranslations: () => {
            return localizer.messages;
          },
        },
      },
    };
    const result = actions.getTranslations(ctx, 'fr');
    expect(result).toEqual({ global: { foo: 'bár' }, locals: [{ name: 'firstApi', value: { foo: 'bár' } }] });
  });
});
