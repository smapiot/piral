import { LocalizationMessages, NestedLocalizationMessages } from './types';

export function flattenTranslations(messages: LocalizationMessages | NestedLocalizationMessages): LocalizationMessages {
  return Object.fromEntries(
    Object
      .entries(messages)
      .map(([ language, translations ]) => {
        return [
          language,
          flat(translations)
        ]
      })
  );
}

function flat(source: Record<string, unknown>): Record<string, string> {
  const target: Record<string, string> = {};

  flatten(source, target);

  return target;
}

function flatten(source: any, target: Record<string, string>, prop = '') {
  if (typeof source === 'string') {
    target[prop] = source;

    return;
  }

  if (typeof source === 'object' && source !== null) {
    Object
      .keys(source)
      .forEach((key) => {
        flatten(
          source[key],
          target,
          prop
            ? `${prop}.${key}`
            : key
        );
      });

    return;
  }
}
