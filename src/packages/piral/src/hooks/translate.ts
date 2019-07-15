import { useActions, useGlobalState } from 'piral-core';
import { TranslationsActions } from '../types';

export function useTranslate() {
  const { translate } = useActions<TranslationsActions>();
  useGlobalState(m => m.app.language.selected);
  return translate;
}
