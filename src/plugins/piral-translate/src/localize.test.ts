/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { Localizer } from './localize';

const messages = {
  en: {
    hi: 'hello',
    greeting: 'Hi {{name}}, welcome back',
    secretNumber: 'The secret number is {{number}}.',
    header: {
      title: 'Hello world',
    },
  },
  de: {
    hi: 'hallo',
  },
};

describe('Localize Module', () => {
  it('localizeLocal translates from the local translations if available', () => {
    const localizer = new Localizer(messages, 'en');
    const result = localizer.localizeLocal(
      {
        en: {
          hi: 'hiho',
        },
      },
      'hi',
    );
    expect(result).toBe('hiho');
  });

  it('localizeLocal translates from the global translations if local not available', () => {
    const localizer = new Localizer(messages, 'en');
    const result = localizer.localizeLocal(
      {
        en: {
          ho: 'hiho',
        },
      },
      'hi',
    );
    expect(result).toBe('hello');
  });

  it('localizeGlobal translates from the global translations', () => {
    const localizer = new Localizer(messages, 'en');
    const result = localizer.localizeGlobal('hi');
    expect(result).toBe('hello');
  });

  it('localizeGlobal translates with variable interpolation', () => {
    const localizer = new Localizer(messages, 'en');
    const result = localizer.localizeGlobal('greeting', { name: 'User' });
    expect(result).toBe('Hi User, welcome back');
  });

  it('localizeGlobal variable interpolation ignores non-used variables', () => {
    const localizer = new Localizer(messages, 'en');
    const result = localizer.localizeGlobal('greeting', { name: 'User', age: 99 });
    expect(result).toBe('Hi User, welcome back');
  });

  it('localizeGlobal ignores non-available variables', () => {
    const localizer = new Localizer(messages, 'en');
    const result = localizer.localizeGlobal('greeting', { nom: 'User' });
    expect(result).toBe('Hi {{name}}, welcome back');
  });

  it('localizeGlobal places missing string placeholder if not found', () => {
    const localizer = new Localizer(messages, 'en');
    const result = localizer.localizeGlobal('ho');
    expect(result).toBe('__en_ho__');
  });

  it('localizeGlobal replaces undefined variables with an empty string', () => {
    const localizer = new Localizer(messages, 'en');
    const result = localizer.localizeGlobal('greeting', { name: undefined });
    expect(result).toBe('Hi , welcome back');
  });

  it('localizeGlobal does not replace falsy variables with an empty string', () => {
    const localizer = new Localizer(messages, 'en');
    const result = localizer.localizeGlobal('secretNumber', { number: 0 });
    expect(result).toBe('The secret number is 0.');
  });

  it('localizeGlobal translates from global translations using passed nested translations', () => {
    const localizer = new Localizer(messages, 'en');
    const result = localizer.localizeGlobal('header.title');

    expect(result).toBe('Hello world');
  });
});
