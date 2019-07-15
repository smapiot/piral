import * as React from 'react';
import { useOnClickOutside, useDynamicLanguage, LanguageData } from 'piral';
import { LanguageIcon } from './LanguageIcon';

export interface LanguagePickerProps {
  selected: string;
  available: Array<string>;
}

function getSampleTranslations(language: string) {
  switch (language) {
    case 'en':
      return {
        sample: 'Welcome to the Piral Sample App!',
      };
    case 'de':
      return {
        sample: 'Willkommen in der Piral Beispielanwendung!',
      };
  }
}

function loadLanguage(language: string, data: LanguageData) {
  return new Promise<LanguageData>(resolve =>
    setTimeout(
      () =>
        resolve({
          ...data,
          global: getSampleTranslations(language),
        }),
      500,
    ),
  );
}

export const LanguagePicker: React.FC<LanguagePickerProps> = ({ selected, available }) => {
  const [open, setOpen] = React.useState(false);
  const [language, setLanguage] = useDynamicLanguage(selected, loadLanguage);
  const container = React.useRef<HTMLDivElement>();
  useOnClickOutside(container, () => setOpen(false));

  return (
    <div className="language-picker" ref={container}>
      <div className="current" onClick={() => setOpen(!open)}>
        <LanguageIcon language={language} />
      </div>
      <ul className={open ? 'open' : 'closed'}>
        {available.map(lang => (
          <li key={lang} onClick={() => setLanguage(lang)}>
            <LanguageIcon language={lang} />
          </li>
        ))}
      </ul>
    </div>
  );
};
