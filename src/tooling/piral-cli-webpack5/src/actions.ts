import { resolve } from 'path';
import type {
  DebugPiletBundlerDefinition,
  DebugPiralBundlerDefinition,
  BuildPiletBundlerDefinition,
  BuildPiralBundlerDefinition,
  WatchPiralBundlerDefinition,
} from 'piral-cli';
import { defaultWebpackConfig } from './constants';

export const watchPiral: WatchPiralBundlerDefinition = {
  path: resolve(__dirname, 'webpack', 'piral.js'),
};

export const debugPiral: DebugPiralBundlerDefinition = {
  flags(argv) {
    return argv
      .string('config')
      .describe('config', 'Sets configuration file for modifying the Webpack configuration.')
      .default('config', defaultWebpackConfig)
      .number('hmr-port')
      .describe('hmr-port', 'Sets the port to be used for HMR for reloading the application.')
      .default('hmr-port', 62123);
  },
  path: resolve(__dirname, 'webpack', 'piral.js'),
};

export const buildPiral: BuildPiralBundlerDefinition = {
  flags(argv) {
    return argv
      .string('config')
      .describe('config', 'Sets configuration file for modifying the Webpack configuration.')
      .default('config', defaultWebpackConfig);
  },
  path: resolve(__dirname, 'webpack', 'piral.js'),
};

export const debugPilet: DebugPiletBundlerDefinition = {
  flags(argv) {
    return argv
      .string('config')
      .describe('config', 'Sets configuration file for modifying the Webpack configuration.')
      .default('config', defaultWebpackConfig);
  },
  path: resolve(__dirname, 'webpack', 'pilet.js'),
};

export const buildPilet: BuildPiletBundlerDefinition = {
  flags(argv) {
    return argv
      .string('config')
      .describe('config', 'Sets configuration file for modifying the Webpack configuration.')
      .default('config', defaultWebpackConfig);
  },
  path: resolve(__dirname, 'webpack', 'pilet.js'),
};
