import { useGlobalState } from '../hooks';
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

function localizeBase<T>(language: string, key: string, variables?: T) {
  const messages = useGlobalState(m => m.app.language.translations);
  const message = translateMessage(language, messages, key, variables);

  if (message === undefined) {
    return getMissingKeyString(key, language);
  }

  return message;
}

export function localizeLocal<T>(messages: LocalizationMessages, key: string, variables?: T) {
  const language = useGlobalState(m => m.app.language.selected);
  const message = translateMessage(language, messages, key, variables);

  if (message === undefined) {
    return localizeBase(language, key, variables);
  }

  return message;
}

export function localizeGlobal<T>(key: string, variables?: T) {
  const language = useGlobalState(m => m.app.language.selected);
  return localizeBase(language, key, variables);
}
