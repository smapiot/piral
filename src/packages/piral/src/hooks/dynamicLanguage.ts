import { useEffect } from 'react';
import { useActions } from 'piral-core';
import { LanguageLoader, TranslationsActions } from '../types';

export function useDynamicLanguage(selected: string, load: LanguageLoader) {
  const { selectLanguage, setLoading, setTranslations, getTranslations } = useActions<TranslationsActions>();

  useEffect(() => {
    let active = true;
    const current = getTranslations(selected);
    selectLanguage(undefined);
    setLoading(true);
    load(selected, current)
      .then(
        result => {
          if (active) {
            setTranslations(selected, result);
            selectLanguage(selected);
          }
        },
        err => console.error(err),
      )
      .then(() => setLoading(false));
    return () => (active = false);
  }, [selected]);
}
