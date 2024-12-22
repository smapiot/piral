/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { flattenTranslations } from './flatten-translations';

describe('Flatten translations', () => {
  it('flattenTranslations can handle flat keys', () => {
    const messages = {
      en: {
        key: 'value',
      },
      fr: {
        key: 'value (fr)',
      },
    };
    const flatMessages = flattenTranslations(messages);
    expect(flatMessages.fr.key).toEqual('value (fr)');
  });

  it('flattenTranslations can handle flat dot keys', () => {
    const messages = {
      en: {
        'header.title': 'Hello world',
      },
    };
    const flatMessages = flattenTranslations(messages);
    expect(flatMessages.en['header.title']).toBe('Hello world');
  });

  it('flattenTranslations can handle nested keys', () => {
    const messages = {
      en: {
        header: {
          title: 'Hello world',
        },
      },
    };
    const flatMessages = flattenTranslations(messages);
    expect(flatMessages.en['header.title']).toBe('Hello world');
  });

  it('flattenTranslations can handle nested keys with multiple depth levels', () => {
    const messages = {
      en: {
        header: {
          title: {
            subtitle: 'Hello world',
          },
        },
      },
    };
    const flatMessages = flattenTranslations(messages);
    expect(flatMessages.en['header.title.subtitle']).toBe('Hello world');
  });
});
