import { existsSync } from 'fs';
import { Configuration } from 'webpack';
import { DefaultConfiguration } from './webpack/common';

export function extendConfig(
  [webPackConfig, enhancer]: DefaultConfiguration,
  otherConfigPath: string,
  overrides: Configuration = {},
): Configuration {
  const original = webPackConfig;

  if (existsSync(otherConfigPath)) {
    const otherConfig = require(otherConfigPath);

    if (typeof otherConfig === 'function') {
      webPackConfig = otherConfig(webPackConfig);
    } else if (typeof otherConfig === 'object') {
      webPackConfig = {
        ...webPackConfig,
        ...otherConfig,
      };
    } else {
      console.warn(`Did not recognize the export from "${otherConfigPath}". Skipping.`);
    }
  }

  ['entry', 'output', 'optimization'].forEach((s) => {
    if (original[s] !== webPackConfig[s]) {
      console.warn(
        `You've overwritten the "${s}" section of the Webpack config. Make sure you know what you are doing.`,
      );
    }
  });

  return enhancer({
    ...webPackConfig,
    ...overrides,
  });
}
