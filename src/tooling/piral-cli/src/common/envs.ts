import { join } from 'path';
import { readFileSync } from 'fs';
import { log } from './log';
import { frameworkLibs } from './constants';
import { pathSeparator, cliVersion, compatVersion } from './info';
import { StandardEnvProps } from '../types';

function hasPath(path: string) {
  const paths = (process.env.PATH || '').split(pathSeparator);
  return paths.includes(path);
}

export function setStandardEnvs(options: StandardEnvProps) {
  log('generalDebug_0003', `Setting environment variables in "${options.root}" ...`);
  const packageJson = JSON.parse(readFileSync(join(options.root, 'package.json'), 'utf8'));
  const binDir = join(options.root, 'node_modules', '.bin');

  process.env.BUILD_TIME = new Date().toDateString();
  process.env.BUILD_TIME_FULL = new Date().toISOString();
  process.env.BUILD_PCKG_VERSION = packageJson.version;
  process.env.BUILD_PCKG_NAME = packageJson.name;
  process.env.PIRAL_CLI_VERSION = cliVersion;

  if (!hasPath(binDir)) {
    const existing = process.env.PATH || '';
    process.env.PATH = `${existing}${pathSeparator}${binDir}`;
  }

  if (options.debugPiral) {
    process.env.DEBUG_PIRAL = compatVersion;
  } else {
    delete process.env.DEBUG_PIRAL;
  }

  if (options.debugPilet) {
    process.env.DEBUG_PILET = 'on';
  } else {
    delete process.env.DEBUG_PILET;
  }

  if (options.publicPath) {
    process.env.PIRAL_PUBLIC_PATH = options.publicPath;
  }

  if (options.production) {
    process.env.NODE_ENV = 'production';
  } else if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }

  if (Array.isArray(options.piralInstances) && options.piralInstances.length) {
    process.env.PIRAL_INSTANCE = options.piralInstances.join(',');
  } else {
    options.piralInstances = [];
  }

  if (Array.isArray(options.dependencies) && options.dependencies.length) {
    const excludedDependencies = [...frameworkLibs, ...options.piralInstances];
    const dependencies = options.dependencies.filter((m) => !excludedDependencies.includes(m));
    process.env.SHARED_DEPENDENCIES = dependencies.join(',');
  } else {
    process.env.SHARED_DEPENDENCIES = '';
  }
}
