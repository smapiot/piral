import { useGlobalState } from 'piral-core';

export function useTranslation() {
  const { selected, translations } = useGlobalState(m => m.app.language);
  return translations[selected];
}
