import { existsSync } from 'fs';
import { Configuration } from 'webpack';

export function extendConfig(
  webPackConfig: Configuration,
  otherConfigPath: string,
  overrides: Configuration = {},
): Configuration {
  if (existsSync(otherConfigPath)) {
    const otherConfig = require(otherConfigPath);

    if (typeof otherConfig === 'function') {
      webPackConfig = otherConfig(webPackConfig);
    } else if (typeof otherConfig === 'object') {
      return {
        ...webPackConfig,
        ...otherConfig,
        ...overrides,
      };
    } else {
      console.warn(`Did not recognize the export from "${otherConfigPath}". Skipping.`);
    }
  }

  return {
    ...webPackConfig,
    ...overrides,
  };
}
