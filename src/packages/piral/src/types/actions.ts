import { PiletApi } from 'piral-core';
import { LanguageData } from './hooks';

export interface PiletsBag {
  [name: string]: PiletApi;
}

export interface SetTranslationsAction {
  /**
   * Sets the translations (both global and local) for
   * the given language.
   * @param language The language to set the translations for.
   * @param data The global and local translations.
   */
  (language: string, data: LanguageData): void;
}

export interface GetTranslationsAction {
  /**
   * Gets the translations (both global and local) for
   * the given language.
   * @param language The language to get the translations for.
   * @result The global and local translations.
   */
  (language: string): LanguageData;
}

export interface TranslateAction {
  /**
   * Gets the translation for the given key at the current
   * language.
   */
  (tag: string, variables?: Record<string, string>): string;
}

export interface TranslationsActions {
  /**
   * Tries to find a translation for the given key.
   */
  translate: TranslateAction;
  /**
   * Sets the translations for the given language.
   */
  setTranslations: SetTranslationsAction;
  /**
   * Gets the translations for the given language.
   */
  getTranslations: GetTranslationsAction;
}
