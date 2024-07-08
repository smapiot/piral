import { LocalizationMessages, Localizable, NestedLocalizationMessages, TranslationFallback } from './types';
import { flattenTranslations } from './flatten-translations';

function defaultFallback(key: string, language: string): string {
  if (process.env.NODE_ENV === 'production') {
    return language ? '...' : '';
  } else {
    if (language) {
      console.warn(`Missing translation of "${key}" in language "${language}".`);
      return `__${language}_${key}__`;
    } else {
      return '';
    }
  }
}

function formatMessage<T extends object>(message: string, variables: T): string {
  return message.replace(/{{\s*([A-Za-z0-9_.]+)\s*}}/g, (_match: string, p1: string) => {
    return p1 in variables ? variables[p1] ?? '' : `{{${p1}}}`;
  });
}

export class Localizer implements Localizable {
  public messages: LocalizationMessages;

  /**
   * Creates a new instance of a localizer.
   */
  constructor(
    messages: LocalizationMessages | NestedLocalizationMessages,
    public language: string,
    public languages: Array<string>,
    private fallback: TranslationFallback = defaultFallback,
  ) {
    this.messages = flattenTranslations(messages);
  }

  /**
   * Localizes the given key via the global translations.
   * @param key The key of the translation snippet.
   * @param variables The optional variables to use.
   */
  public localizeGlobal<T extends object>(key: string, variables?: T) {
    return this.localizeBase(key, variables);
  }

  /**
   * Localizes the given key via the local translations.
   * Uses the global translations as fallback mechanism.
   * @param localMessages The local translations to prefer.
   * @param key The key of the translation snippet.
   * @param variables The optional variables to use.
   */
  public localizeLocal<T extends object>(localMessages: LocalizationMessages, key: string, variables?: T) {
    const message = this.translateMessage(localMessages, key, variables);

    if (message === undefined) {
      return this.localizeBase(key, variables);
    }

    return message;
  }

  private localizeBase<T extends object>(key: string, variables?: T) {
    const message = this.translateMessage(this.messages, key, variables);

    if (message === undefined) {
      return this.fallback(key, this.language, this.messages, variables);
    }

    return message;
  }

  private translateMessage<T extends object>(messages: LocalizationMessages, key: string, variables?: T) {
    const language = this.language;
    const translations = language && messages[language];
    const translation = translations && translations[key];
    return translation && (variables ? formatMessage(translation, variables) : translation);
  }
}
