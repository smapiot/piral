import * as React from 'react';
import { useOnClickOutside, useDynamicLanguage, useTranslate, LanguagesPickerProps } from 'piral';
import { LanguageIcon } from './LanguageIcon';
import { loadLanguage } from '../language';

export const LanguagePicker: React.FC<LanguagesPickerProps> = ({ selected, available }) => {
  const [open, setOpen] = React.useState(false);
  const [language, setLanguage] = useDynamicLanguage(selected, loadLanguage);
  const container = React.useRef<HTMLDivElement>();
  const translate = useTranslate();
  useOnClickOutside(container, () => setOpen(false));

  return (
    <div className="language-picker" ref={container}>
      <div className="current" onClick={() => setOpen(!open)}>
        <LanguageIcon language={language} />
      </div>
      <ul className={open ? 'open' : 'closed'}>
        {available.map(lang => (
          <li key={lang} onClick={() => setLanguage(lang)}>
            <LanguageIcon language={lang} /> <span>{translate(lang)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
