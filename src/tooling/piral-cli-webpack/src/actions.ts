import { resolve } from 'path';
import {
  DebugPiletBundlerDefinition,
  DebugPiralBundlerDefinition,
  BuildPiletBundlerDefinition,
  BuildPiralBundlerDefinition,
  WatchPiralBundlerDefinition,
} from 'piral-cli';

export const debugPiral: DebugPiralBundlerDefinition = {
  path: resolve(__dirname, 'webpack', 'piral.js'),
};

export const watchPiral: WatchPiralBundlerDefinition = {
  path: resolve(__dirname, 'webpack', 'piral.js'),
};

export const buildPiral: BuildPiralBundlerDefinition = {
  path: resolve(__dirname, 'webpack', 'piral.js'),
};

export const debugPilet: DebugPiletBundlerDefinition = {
  path: resolve(__dirname, 'webpack', 'pilet.js'),
};

export const buildPilet: BuildPiletBundlerDefinition = {
  path: resolve(__dirname, 'webpack', 'pilet.js'),
};
