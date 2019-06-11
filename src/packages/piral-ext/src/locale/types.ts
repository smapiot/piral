export interface LocalizationMessages {
  /**
   * The available languages (lang to wordings).
   */
  [lang: string]: {
    /**
     * The available wordings (tag to translation).
     */
    [tag: string]: string;
  };
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
}
