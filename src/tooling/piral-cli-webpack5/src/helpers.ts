import { existsSync } from 'fs';
import { Configuration } from 'webpack';
import { DefaultConfiguration } from './webpack/common';

export async function extendConfig(
  [webPackConfig, enhancer]: DefaultConfiguration,
  otherConfigPath: string,
  overrides: Configuration = {},
): Promise<Configuration> {
  const original = webPackConfig;

  if (existsSync(otherConfigPath)) {
    try {
      let otherConfig = require(otherConfigPath);
      if (otherConfig.default) {
        // The webpack config file appears to be an ESM module;
        // this interop should give us the actual exported config
        otherConfig = otherConfig.default;
      }

      if (typeof otherConfig === 'function') {
        // support Promise for returned config:
        // https://webpack.js.org/configuration/configuration-types/#exporting-a-promise
        webPackConfig = await otherConfig(webPackConfig);
      } else if (typeof otherConfig === 'object') {
        webPackConfig = {
          ...webPackConfig,
          ...otherConfig,
        };
      } else {
        console.warn(`Did not recognize the export from "${otherConfigPath}". Skipping.`);
      }
    } catch (ex) {
      console.error(`Error while using the config from "${otherConfigPath}": ${ex}`);
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
