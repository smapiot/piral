import { cookie, storage } from 'piral-core';
import { getUserLocale } from './current';

function mockNavigatorLanguage(value = '') {
  (navigator as any).__defineGetter__('language', () => value);
}

describe('User Module', () => {
  it('getUserLocale selects default language as no fallback is given', () => {
    cookie.getItem = jest.fn(() => undefined);
    storage.getItem = jest.fn(() => undefined);
    mockNavigatorLanguage();
    const language = getUserLocale(['en', 'de', 'fr'], 'en');
    expect(language).toBe('en');
  });

  it('getUserLocale selects fallback language', () => {
    cookie.getItem = jest.fn(() => undefined);
    storage.getItem = jest.fn(() => undefined);
    mockNavigatorLanguage();
    const language = getUserLocale(['en', 'de', 'fr'], 'en', 'de');
    expect(language).toBe('de');
  });

  it('getUserLocale selects navigator language if available', () => {
    cookie.getItem = jest.fn(() => undefined);
    storage.getItem = jest.fn(() => undefined);
    mockNavigatorLanguage('fr');
    const language = getUserLocale(['en', 'de', 'fr'], 'en');
    expect(language).toBe('fr');
  });

  it('getUserLocale selects default language if navigator not available', () => {
    cookie.getItem = jest.fn(() => undefined);
    storage.getItem = jest.fn(() => undefined);
    mockNavigatorLanguage('es');
    const language = getUserLocale(['en', 'de', 'fr'], 'en');
    expect(language).toBe('en');
  });

  it('getUserLocale selects language from cookie if available', () => {
    cookie.getItem = jest.fn(() => 'de');
    storage.getItem = jest.fn(() => undefined);
    mockNavigatorLanguage();
    const language = getUserLocale(['en', 'de', 'fr'], 'en');
    expect(language).toBe('de');
  });

  it('getUserLocale does not select language from cookie if not available', () => {
    cookie.getItem = jest.fn(() => 'es');
    storage.getItem = jest.fn(() => undefined);
    mockNavigatorLanguage();
    const language = getUserLocale(['en', 'de', 'fr'], 'en');
    expect(language).toBe('en');
  });

  it('getUserLocale selects language from local storage if available', () => {
    cookie.getItem = jest.fn(() => undefined);
    storage.getItem = jest.fn(() => 'de');
    mockNavigatorLanguage();
    const language = getUserLocale(['en', 'de', 'fr'], 'en');
    expect(language).toBe('de');
  });

  it('getUserLocale does not select language from local storage if not available', () => {
    cookie.getItem = jest.fn(() => undefined);
    storage.getItem = jest.fn(() => 'es');
    mockNavigatorLanguage();
    const language = getUserLocale(['en', 'de', 'fr'], 'en');
    expect(language).toBe('en');
  });

  it('getUserLocale selects language from cookie over local storage', () => {
    cookie.getItem = jest.fn(() => 'fr');
    storage.getItem = jest.fn(() => 'de');
    mockNavigatorLanguage();
    const language = getUserLocale(['en', 'de', 'fr'], 'en');
    expect(language).toBe('fr');
  });
});
