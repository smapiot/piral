import {} from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletLocaleApi {}

  interface PiralCustomState {
    /**
     * Gets the current localizer.
     */
    localizer: Localizable;
    /**
     * Information for the language display.
     */
    language: {
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
}

export interface LanguageLoader {
  (language: string, current: LanguageData): Promise<LanguageData>;
}

export interface LanguageData {
  global: Translations;
  locals: Array<{
    name: string;
    value: Translations;
  }>;
}

export interface Localizable {
  messages: LocalizationMessages;
  language: string;
  localizeGlobal<T>(key: string, variables?: T): string;
  localizeLocal<T>(localMessages: LocalizationMessages, key: string, variables?: T): string;
}

export interface Translations {
  /**
   * The available wordings (tag to translation).
   */
  [tag: string]: string;
}

export interface LocalizationMessages {
  /**
   * The available languages (lang to wordings).
   */
  [lang: string]: Translations;
}

export interface TranslationFallback {
  (key: string, language: string): string;
}

export interface PiletLocaleApi {
  /**
   * Translates the given tag (using the optional variables) into a string using the current language.
   * The used template can contain placeholders in form of `{{variableName}}`.
   * @param tag The tag to translate.
   * @param variables The optional variables to fill into the temnplate.
   */
  translate<T = Record<string, string>>(tag: string, variables?: T): string;
  /**
   * Provides translations to the application.
   * The translations will be exlusively used for retrieving translations for the pilet.
   * @param messages The messages to use as translation basis.
   */
  setTranslations(messages: LocalizationMessages): void;
  /**
   * Gets the currently provided translations by the pilet.
   */
  getTranslations(): LocalizationMessages;
}

export interface LocaleConfig {
  /**
   * Sets the default (global) localization messages.
   * @default {}
   */
  messages?: LocalizationMessages;
  /**
   * Sets the default language to use.
   */
  language?: string;
  /**
   * Sets the optional fallback to use.
   */
  fallback?: TranslationFallback;
}
