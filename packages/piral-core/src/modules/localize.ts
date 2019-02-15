import { LocalizationMessages } from '../types';

function getMissingKeyString(key: string, language: string): string {
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

export function localize<T>(messages: LocalizationMessages, key: string, variables?: T) {
  const language = this.language;
  const message = translateMessage(language, messages, key, variables);

  if (message === undefined) {
    return localizeBase(key, variables);
  }

  return message;
}

export function localizeBase<T>(key: string, variables?: T) {
  const language = this.language;
  const message = translateMessage(language, this.messages, key, variables);

  if (message === undefined) {
    return getMissingKeyString(key, language);
  }

  return message;
}
