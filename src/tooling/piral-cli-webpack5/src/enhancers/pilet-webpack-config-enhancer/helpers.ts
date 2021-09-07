import { join, resolve } from 'path';
import { Configuration } from 'webpack';

export function getVariables(name: string, version: string, env: string): Record<string, string> {
  return {
    NODE_ENV: env,
    BUILD_TIME: new Date().toDateString(),
    BUILD_TIME_FULL: new Date().toISOString(),
    BUILD_PCKG_VERSION: version,
    BUILD_PCKG_NAME: name,
  };
}

export function setEnvironment(variables: Record<string, string>) {
  Object.keys(variables).forEach((key) => (process.env[key] = variables[key]));
}

export function getDefineVariables(variables: Record<string, string>) {
  return Object.entries(variables).reduce((obj, [name, value]) => {
    obj[`process.env.${name}`] = JSON.stringify(value);
    return obj;
  }, {});
}

interface Importmap {
  imports: Record<string, string>;
}

export function getExternals(piral: string) {
  const shellPkg = require(`${piral}/package.json`);
  const piralExternals = shellPkg.pilets?.externals ?? [];
  return [
    ...piralExternals,
    '@dbeining/react-atom',
    '@libre/atom',
    'history',
    'react',
    'react-dom',
    'react-router',
    'react-router-dom',
    'tslib',
    'path-to-regexp',
  ];
}

export function getDependencies(compilerOptions: Configuration) {
  const packageDetails = require(resolve(process.cwd(), 'package.json'));
  const importmap: Importmap = packageDetails.importmap;
  const dependencies = {};
  const sharedImports = importmap?.imports;

  if (typeof compilerOptions.entry === 'object' && compilerOptions.entry && typeof sharedImports === 'object') {
    for (const depName of Object.keys(sharedImports)) {
      const details = require(`${depName}/package.json`);
      const depId = `${depName}@${details.version}`;
      dependencies[depId] = `${depName}.js`;
      compilerOptions.externals[depName] = depId;
      compilerOptions.entry[depName] = resolve(process.cwd(), sharedImports[depName]);
    }
  }

  return dependencies;
}

export function withSetPath(compilerOptions: Configuration) {
  if (typeof compilerOptions.entry === 'object' && compilerOptions.entry) {
    const setPath = join(__dirname, '..', '..', 'set-path');

    if (Array.isArray(compilerOptions.entry)) {
      compilerOptions.entry.unshift(setPath);
    } else {
      for (const key of Object.keys(compilerOptions.entry)) {
        const entry = compilerOptions.entry[key];

        if (Array.isArray(entry)) {
          entry.unshift(setPath);
        }
      }
    }
  }
}

export function withExternals(compilerOptions: Configuration, externals: Array<string>) {
  const current = compilerOptions.externals;
  const newExternals = Array.isArray(current)
    ? [...(current as Array<string>), ...externals]
    : typeof current === 'string'
    ? [current, ...externals]
    : externals;

  if (newExternals !== externals || typeof compilerOptions.externals !== 'object' || !compilerOptions.externals) {
    compilerOptions.externals = {};
  }

  for (const external of newExternals) {
    if (typeof external === 'string') {
      compilerOptions.externals[external] = external;
    }
  }
}
