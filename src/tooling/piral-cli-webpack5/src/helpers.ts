import { existsSync } from 'fs';
import { Configuration } from 'webpack';
import { DefaultConfiguration } from './configs/common';

export function extendConfig(
  [webPackConfig, enhancer]: DefaultConfiguration,
  otherConfigPath: string,
  overrides: Configuration = {},
): Configuration {
  if (existsSync(otherConfigPath)) {
    const otherConfig = require(otherConfigPath);

    if (typeof otherConfig === 'function') {
      webPackConfig = otherConfig(webPackConfig);
    } else if (typeof otherConfig === 'object') {
      return enhancer({
        ...webPackConfig,
        ...otherConfig,
        ...overrides,
      });
    } else {
      console.warn(`Did not recognize the export from "${otherConfigPath}". Skipping.`);
    }
  }

  return enhancer({
    ...webPackConfig,
    ...overrides,
  });
}
