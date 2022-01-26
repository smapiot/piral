import { resolve } from 'path';
import type {
  DebugPiletBundlerDefinition,
  DebugPiralBundlerDefinition,
  BuildPiletBundlerDefinition,
  BuildPiralBundlerDefinition,
  WatchPiralBundlerDefinition,
} from 'piral-cli';

export const debugPiral: DebugPiralBundlerDefinition = {
  path: resolve(__dirname, 'xbuild', 'piral-debug.js'),
};

export const watchPiral: WatchPiralBundlerDefinition = {
  path: resolve(__dirname, 'xbuild', 'piral-watch.js'),
};

export const buildPiral: BuildPiralBundlerDefinition = {
  path: resolve(__dirname, 'xbuild', 'piral-build.js'),
};

export const debugPilet: DebugPiletBundlerDefinition = {
  path: resolve(__dirname, 'xbuild', 'pilet-debug.js'),
};

export const buildPilet: BuildPiletBundlerDefinition = {
  path: resolve(__dirname, 'xbuild', 'pilet-build.js'),
};
