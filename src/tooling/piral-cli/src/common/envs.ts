import { join } from 'path';
import { log } from './log';
import { config } from './config';
import { pathSeparator, cliVersion, compatVersion } from './info';
import { StandardEnvProps } from '../types';

function hasPath(path: string) {
  const paths = (process.env.PATH || '').split(pathSeparator);
  return paths.includes(path);
}

export function setStandardEnvs(options: StandardEnvProps) {
  log('generalDebug_0003', `Setting environment variables in "${options.root}" ...`);
  const packageJson = require(join(options.root, 'package.json'));
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
    window['dbg:pilet-api'] = config.piletApi;
  } else {
    delete window['dbg:pilet-api'];
  }

  if (options.production) {
    process.env.NODE_ENV = 'production';
  } else if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }

  if (options.dependencies && options.dependencies.length) {
    const excludedDependencies = ['piral', 'piral-core', 'piral-base', options.piral];
    const dependencies = options.dependencies.filter(m => !excludedDependencies.includes(m));
    process.env.SHARED_DEPENDENCIES = dependencies.join(',');
  } else {
    process.env.SHARED_DEPENDENCIES = '';
  }
}
