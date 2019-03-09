import { findFile } from './io';

export interface StandardEnvProps {
  production?: boolean;
  target?: string;
}

function readNextPackageJson(dir: string) {
  const path = findFile(dir, 'package.json');

  if (path) {
    return require(path);
  }

  return {
    name: '',
    version: '',
    description: '',
  };
}

export function setStandardEnvs(options: StandardEnvProps = {}) {
  const packageJson = readNextPackageJson(options.target || process.cwd());

  process.env.BUILD_TIME = new Date().toDateString();
  process.env.BUILD_TIME_FULL = new Date().toISOString();
  process.env.BUILD_PCKG_VERSION = packageJson.version;
  process.env.BUILD_PCKG_NAME = packageJson.name;

  if (options.production) {
    process.env.NODE_ENV = 'production';
  } else if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }
}
