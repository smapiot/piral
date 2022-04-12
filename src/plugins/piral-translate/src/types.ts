import type { Disposable } from 'piral-core';
import type { ComponentType } from 'react';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletLocaleApi {}

  interface PiralCustomState {
    /**
     * Information for the language display.
     */
    language: {
      /**
       * Gets if languages are currently loading.
       */
      loading: boolean;
      /**
       * The selected, i.e., active, language.
       */
      selected: string;
      /**
       * The available languages.
       */
      available: Array<string>;
    };
  }

  interface PiralCustomEventMap {
    'select-language': PiralSelectLanguageEvent;
  }

  interface PiralCustomActions {
    /**
     * Changes the selected language.
     * @param selected The selected language.
     */
    selectLanguage(selected: string): void;
    /**
     * Gets the translation for the given key at the current
     * language.
     */
    translate(tag: string, variables?: Record<string, string>): string;
    /**
     * Sets the translations (both global and local) for
     * the given language.
     * @param language The language to set the translations for.
     * @param data The global and local translations.
     */
    setTranslations(language: string, data: LanguageData): void;
    /**
     * Gets the translations (both global and local) for
     * the given language.
     * @param language The language to get the translations for.
     * @result The global and local translations.
     */
    getTranslations(language: string): LanguageData;
  }

  interface PiralCustomComponentsState {
    /**
     * Represents the component for rendering a language selection.
     */
    LanguagesPicker: ComponentType<LanguagesPickerProps>;
  }
}

export interface PiralSelectLanguageEvent {
  /**
   * Gets the previously selected language.
   */
  previousLanguage: string;
  /**
   * Gets the currently selected language.
   */
  currentLanguage: string;
}

export interface LanguagesPickerProps {
  /**
   * The currently selected language.
   */
  selected: string;
  /**
   * The languages available for selection.
   */
  available: Array<string>;
}

export interface LanguageData {
  global: Translations;
  locals: Array<{
    name: string;
    value: Translations;
  }>;
}

export interface Translations {
  /**
   * The available wordings (tag to translation).
   */
  [tag: string]: string;
}

export interface LanguageLoader {
  (language: string, current: LanguageData): Promise<LanguageData>;
}

export interface Localizable {
  messages: LocalizationMessages;
  language: string;
  languages: Array<string>;
  localizeGlobal<T>(key: string, variables?: T): string;
  localizeLocal<T>(localMessages: LocalizationMessages, key: string, variables?: T): string;
}

export interface LocalizationMessages {
  /**
   * The available languages (lang to wordings).
   */
  [lang: string]: Translations;
}

export interface PiletLocaleApi {
  /**
   * Gets the currently selected language directly.
   */
  getCurrentLanguage(): string;
  /**
   * Gets the currently selected language in a callback that is also invoked when the
   * selected language changes. Returns a disposable to stop the notifications.
   */
  getCurrentLanguage(cb: (currently: string) => void): Disposable;
  /**
   * Translates the given tag (using the optional variables) into a string using the current language.
   * The used template can contain placeholders in form of `{{variableName}}`.
   * @param tag The tag to translate.
   * @param variables The optional variables to fill into the temnplate.
   */
  translate<T = Record<string, string>>(tag: string, variables?: T): string;
  /**
   * Provides translations to the application.
   * The translations will be exclusively used for retrieving translations for the pilet.
   * @param messages The messages to use as translation basis.
   */
  setTranslations(messages: LocalizationMessages): void;
  /**
   * Gets the currently provided translations by the pilet.
   */
  getTranslations(): LocalizationMessages;
}
