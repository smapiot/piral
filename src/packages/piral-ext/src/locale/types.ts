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

export interface PiralLocaleApi {
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
