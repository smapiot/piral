import { Translations } from 'piral-ext';

export interface LanguageData {
  global: Translations;
  locals: Array<{
    name: string;
    value: Translations;
  }>;
}

export interface LanguageLoader {
  (language: string, current: LanguageData): Promise<LanguageData>;
}
