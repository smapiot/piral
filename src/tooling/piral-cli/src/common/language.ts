import { log } from './log';
import { PiletLanguage } from './enums';

export const reactTypings = {
  '@types/react': 'latest',
  '@types/react-dom': 'latest',
  '@types/react-router': 'latest',
  '@types/react-router-dom': 'latest',
};

export function getLanguageExtension(language: PiletLanguage) {
  switch (language) {
    case PiletLanguage.js:
      return '.jsx';
    case PiletLanguage.ts:
      return '.tsx';
    default:
      log('generalDebug_0003', 'Did not find a valid language. Just skipping extension.');
  }
}

export function getDevDependencies(language: PiletLanguage, typings: Record<string, string> = reactTypings) {
  switch (language) {
    case PiletLanguage.ts:
      return {
        ...typings,
        '@types/node': 'latest',
        typescript: 'latest',
      };
    case PiletLanguage.js:
    default:
      log('generalDebug_0003', 'Did not find a valid language. Just skipping devDependencies.');
      return {};
  }
}
