/**
 * @vitest-environment jsdom
 */
import { cookie, storage } from 'piral-core';
import { describe, it, expect, vitest } from 'vitest';
import { getUserLocale } from './current';

function mockNavigatorLanguage(value = '') {
  (navigator as any).__defineGetter__('language', () => value);
}

describe('User Module', () => {
  it('getUserLocale selects default language as no fallback is given', () => {
    cookie.getItem = vitest.fn(() => undefined);
    storage.getItem = vitest.fn(() => undefined);
    mockNavigatorLanguage();
    const language = getUserLocale(['en', 'de', 'fr'], 'en');
    expect(language).toBe('en');
  });

  it('getUserLocale selects fallback language', () => {
    cookie.getItem = vitest.fn(() => undefined);
    storage.getItem = vitest.fn(() => undefined);
    mockNavigatorLanguage();
    const language = getUserLocale(['en', 'de', 'fr'], 'en', 'de');
    expect(language).toBe('de');
  });

  it('getUserLocale selects navigator language if available', () => {
    cookie.getItem = vitest.fn(() => undefined);
    storage.getItem = vitest.fn(() => undefined);
    mockNavigatorLanguage('fr');
    const language = getUserLocale(['en', 'de', 'fr'], 'en');
    expect(language).toBe('fr');
  });

  it('getUserLocale selects default language if navigator not available', () => {
    cookie.getItem = vitest.fn(() => undefined);
    storage.getItem = vitest.fn(() => undefined);
    mockNavigatorLanguage('es');
    const language = getUserLocale(['en', 'de', 'fr'], 'en');
    expect(language).toBe('en');
  });

  it('getUserLocale selects language from cookie if available', () => {
    cookie.getItem = vitest.fn(() => 'de');
    storage.getItem = vitest.fn(() => undefined);
    mockNavigatorLanguage();
    const language = getUserLocale(['en', 'de', 'fr'], 'en');
    expect(language).toBe('de');
  });

  it('getUserLocale does not select language from cookie if not available', () => {
    cookie.getItem = vitest.fn(() => 'es');
    storage.getItem = vitest.fn(() => undefined);
    mockNavigatorLanguage();
    const language = getUserLocale(['en', 'de', 'fr'], 'en');
    expect(language).toBe('en');
  });

  it('getUserLocale selects language from local storage if available', () => {
    cookie.getItem = vitest.fn(() => undefined);
    storage.getItem = vitest.fn(() => 'de');
    mockNavigatorLanguage();
    const language = getUserLocale(['en', 'de', 'fr'], 'en');
    expect(language).toBe('de');
  });

  it('getUserLocale does not select language from local storage if not available', () => {
    cookie.getItem = vitest.fn(() => undefined);
    storage.getItem = vitest.fn(() => 'es');
    mockNavigatorLanguage();
    const language = getUserLocale(['en', 'de', 'fr'], 'en');
    expect(language).toBe('en');
  });

  it('getUserLocale selects language from cookie over local storage', () => {
    cookie.getItem = vitest.fn(() => 'fr');
    storage.getItem = vitest.fn(() => 'de');
    mockNavigatorLanguage();
    const language = getUserLocale(['en', 'de', 'fr'], 'en');
    expect(language).toBe('fr');
  });
});
