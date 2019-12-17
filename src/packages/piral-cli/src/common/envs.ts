import { findFile } from './io';
import { debugPiletApi } from './info';

export interface StandardEnvProps {
  production?: boolean;
  develop?: boolean;
  target?: string;
  piral?: string;
  dependencies?: Array<string>;
}

async function readNextPackageJson(dir: string) {
  const path = await findFile(dir, 'package.json');

  if (path) {
    return require(path);
  }

  return {
    name: '',
    version: '',
    description: '',
  };
}

export async function setStandardEnvs(options: StandardEnvProps = {}) {
  const packageJson = await readNextPackageJson(options.target || process.cwd());

  process.env.BUILD_TIME = new Date().toDateString();
  process.env.BUILD_TIME_FULL = new Date().toISOString();
  process.env.BUILD_PCKG_VERSION = packageJson.version;
  process.env.BUILD_PCKG_NAME = packageJson.name;

  if (options.develop) {
    process.env.DEBUG_PILET = options.develop ? debugPiletApi : '';
  } else {
    delete process.env.DEBUG_PILET;
  }

  if (options.production) {
    process.env.NODE_ENV = 'production';
  } else if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }

  if (options.dependencies && options.dependencies.length) {
    const excludedDependencies = ['piral', 'piral-core', options.piral];
    const dependencies = options.dependencies.filter(m => !excludedDependencies.includes(m));
    process.env.SHARED_DEPENDENCIES = dependencies.join(',');
  } else {
    process.env.SHARED_DEPENDENCIES = '';
  }
}
