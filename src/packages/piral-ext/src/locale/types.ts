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

export interface TranslationLoader {
  (language: string, pilet?: string): Promise<Translations>;
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
   * @param messages The messages to use as transslation basis.
   */
  provideTranslations(messages: LocalizationMessages): void;
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
   * Sets the default language to use.
   */
  load?: TranslationLoader;
}
