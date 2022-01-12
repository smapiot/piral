import { existsSync } from 'fs';
import { BuildOptions } from 'esbuild';
import { resolve } from 'path';
import { defaultEsbuildConfig } from './constants';

export function extendConfig(esbuildConfig: BuildOptions, root: string): BuildOptions {
  const otherConfigPath = resolve(root, defaultEsbuildConfig);

  if (existsSync(otherConfigPath)) {
    const otherConfig = require(otherConfigPath);

    if (typeof otherConfig === 'function') {
      esbuildConfig = otherConfig(esbuildConfig);
    } else if (typeof otherConfig === 'object') {
      return {
        ...esbuildConfig,
        ...otherConfig,
      };
    } else {
      console.warn(`Did not recognize the export from "${otherConfigPath}". Skipping.`);
    }
  }

  return esbuildConfig;
}
