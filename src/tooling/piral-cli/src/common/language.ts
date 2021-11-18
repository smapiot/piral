import { log } from './log';
import { SourceLanguage } from './enums';

export const reactDeps = {
  react: '^17',
  'react-dom': '^17',
  'react-router': '^5',
  'react-router-dom': '^5',
};

export const reactTypings = {
  '@types/react': '^17',
  '@types/react-dom': '^17',
  '@types/react-router': '^5',
  '@types/react-router-dom': '^5',
};

export function getDependencies(language: SourceLanguage, packages: Record<string, string> = reactDeps) {
  switch (language) {
    case SourceLanguage.js:
    case SourceLanguage.ts:
      return {
        ...packages,
      };
    default:
      log('generalDebug_0003', 'Did not find a valid language. Just skipping devDependencies.');
      return {};
  }
}

export function getDevDependencies(language: SourceLanguage, typings: Record<string, string> = reactTypings) {
  switch (language) {
    case SourceLanguage.ts:
      return {
        ...typings,
        '@types/node': 'latest',
        typescript: 'latest',
      };
    case SourceLanguage.js:
      return {};
    default:
      log('generalDebug_0003', 'Did not find a valid language. Just skipping devDependencies.');
      return {};
  }
}
