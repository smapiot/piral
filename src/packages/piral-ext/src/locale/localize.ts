import { LocalizationMessages, TranslationLoader } from './types';

function defaultFallback(key: string, language: string): string {
  return `__${language}_${key}__`;
}

function formatMessage<T>(message: string, variables: T): string {
  return message.replace(/{{\s*([A-Za-z0-9_.]+)\s*}}/g, (_match: string, p1: string) => {
    return p1 in variables ? variables[p1] || '' : `{{${p1}}}`;
  });
}

function translateMessage<T>(language: string, messages: LocalizationMessages, key: string, variables?: T) {
  const translations = language && messages[language];
  const translation = translations && translations[key];
  return translation && (variables ? formatMessage(translation, variables) : translation);
}

export class Localizer {
  /**
   * Creates a new instance of a localizer.
   */
  constructor(
    private globalMessages: LocalizationMessages,
    private language: string,
    private fallback = defaultFallback,
    private load?: TranslationLoader,
  ) {}

  /**
   * Gets the currently set language.
   */
  public get currentLanguage(): string {
    return this.language;
  }

  /**
   * Changes the currently set language.
   * @param language The language to change to.
   */
  public changeLanguage(language: string) {
    if (this.language !== language) {
      this.language = language;

      if (typeof this.load === 'function') {
        this.load(language).then(translations => {
          this.globalMessages[language] = translations;
        });
      }
    }
  }

  /**
   * Localizes the given key via the global translations.
   * @param key The key of the translation snippet.
   * @param variables The optional variables to use.
   */
  public localizeGlobal<T>(key: string, variables?: T) {
    const language = this.language;
    const messages = this.globalMessages;
    return this.localizeBase(messages, language, key, variables);
  }

  /**
   * Localizes the given key via the local translations.
   * Uses the global translations as fallback mechanism.
   * @param localMessages The local translations to prefer.
   * @param key The key of the translation snippet.
   * @param variables The optional variables to use.
   */
  public localizeLocal<T>(localMessages: LocalizationMessages, key: string, variables?: T) {
    const language = this.language;
    const message = translateMessage(language, localMessages, key, variables);

    if (message === undefined) {
      return this.localizeBase(this.globalMessages, language, key, variables);
    }

    return message;
  }

  private localizeBase<T>(messages: LocalizationMessages, language: string, key: string, variables?: T) {
    const message = translateMessage(language, messages, key, variables);

    if (message === undefined) {
      return this.fallback(key, language);
    }

    return message;
  }
}
