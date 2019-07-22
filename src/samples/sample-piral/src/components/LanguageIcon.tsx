import * as React from 'react';

function getLanguageUrl(language: string) {
  switch (language) {
    case 'de':
      return require('../images/de.png');
    default:
      return require('../images/en.png');
  }
}

export interface LanguageIconProps {
  language: string;
}

export const LanguageIcon: React.FC<LanguageIconProps> = ({ language }) => {
  const url = getLanguageUrl(language);
  return <img src={url} title={language} className="language-icon" />;
};
