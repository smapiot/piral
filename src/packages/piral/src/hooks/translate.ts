import { useActions, useGlobalState } from 'piral-core';

export function useTranslate() {
  const { translate } = useActions();
  useGlobalState(m => m.app.language.selected);
  return translate;
}
