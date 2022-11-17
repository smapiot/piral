import { log } from './log';
import { Framework, SourceLanguage } from '../types';

const react17Deps = {
  react: '^17',
  'react-dom': '^17',
};

const react18Deps = {
  react: '^18',
  'react-dom': '^18',
};

const reactRouter5Deps = {
  'react-router': '^5',
  'react-router-dom': '^5',
};

const reactRouter6Deps = {
  'react-router': '^6',
  'react-router-dom': '^6',
};

const react17Typings = {
  '@types/react': '^17',
  '@types/react-dom': '^17',
};

const react18Typings = {
  '@types/react': '^18',
  '@types/react-dom': '^18',
};

const reactRouter5Typings = {
  '@types/react-router': '^5',
  '@types/react-router-dom': '^5',
};

const defaultDeps = {};

const defaultTypings = {
  '@types/react': '*',
  '@types/react-dom': '*',
};

export function getDependencyPackages(framework: Framework, reactVersion: number, reactRouterVersion: number) {
  // take default packages only if piral-core
  return framework === 'piral-base'
    ? {}
    : {
        ...(reactVersion < 18 ? react17Deps : react18Deps),
        ...(reactRouterVersion < 6 ? reactRouter5Deps : reactRouter6Deps),
      };
}

export function getDevDependencyPackages(framework: Framework, reactVersion: number, reactRouterVersion: number) {
  // take default dev packages only if not piral-base
  return framework === 'piral-base'
    ? {}
    : {
        ...(reactVersion < 18 ? react17Typings : react18Typings),
        ...(reactRouterVersion < 6 ? reactRouter5Typings : {}),
      };
}

export function getFrameworkDependencies(framework: Framework, version: string) {
  return {
    ...(framework !== 'piral-base' ? { 'piral-base': `${version}` } : {}),
    ...(framework !== 'piral-base' && framework !== 'piral-core' ? { 'piral-core': `${version}` } : {}),
    [framework]: `${version}`,
  };
}

export function getDependencies(language: SourceLanguage, packages: Record<string, string> = defaultDeps) {
  switch (language) {
    case 'js':
    case 'ts':
      return {
        ...packages,
      };
    default:
      log('generalDebug_0003', 'Did not find a valid language. Skipping "dependencies".');
      return {};
  }
}

export function getDevDependencies(language: SourceLanguage, typings: Record<string, string> = defaultTypings) {
  switch (language) {
    case 'ts':
      return {
        ...typings,
        '@types/node': 'latest',
        typescript: 'latest',
      };
    case 'js':
      return {};
    default:
      log('generalDebug_0003', 'Did not find a valid language. Skipping "devDependencies".');
      return {};
  }
}
