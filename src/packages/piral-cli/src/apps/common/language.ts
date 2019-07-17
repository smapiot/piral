export enum PiletLanguage {
  ts,
  js,
}

export function getLanguageExtension(language: PiletLanguage) {
  switch (language) {
    case PiletLanguage.js:
      return '.jsx';
    case PiletLanguage.ts:
      return '.tsx';
  }
}

export function getDevDependencies(language: PiletLanguage) {
  switch (language) {
    case PiletLanguage.ts:
      return {
        typescript: 'latest',
        '@types/react': 'latest',
        '@types/react-dom': 'latest',
        '@types/react-router': 'latest',
        '@types/react-router-dom': 'latest',
        '@types/node': 'latest',
      };
    case PiletLanguage.js:
    default:
      return {};
  }
}
