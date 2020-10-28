import { log } from './log';
import { SourceLanguage } from './enums';

export const reactTypings = {
  '@types/react': 'latest',
  '@types/react-dom': 'latest',
  '@types/react-router': 'latest',
  '@types/react-router-dom': 'latest',
};

export function getDevDependencies(language: SourceLanguage, typings: Record<string, string> = reactTypings) {
  switch (language) {
    case SourceLanguage.ts:
      return {
        ...typings,
        '@types/node': 'latest',
        typescript: 'latest',
      };
    case SourceLanguage.js:
    default:
      log('generalDebug_0003', 'Did not find a valid language. Just skipping devDependencies.');
      return {};
  }
}
