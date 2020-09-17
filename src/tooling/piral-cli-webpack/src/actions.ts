import { callDynamic, callStatic } from './webpack';
import {
  DebugPiletBundlerDefinition,
  DebugPiralBundlerDefinition,
  BuildPiletBundlerDefinition,
  BuildPiralBundlerDefinition,
  WatchPiralBundlerDefinition,
} from 'piral-cli';

export const debugPiral: DebugPiralBundlerDefinition = {
  async run(args) {
    const bundler = await callDynamic('debug-piral', args);
    return bundler;
  },
};

export const watchPiral: WatchPiralBundlerDefinition = {
  async run(args) {
    const bundler = await callStatic('debug-mono-piral', args);
    return bundler;
  },
};

export const buildPiral: BuildPiralBundlerDefinition = {
  async run(args) {
    const bundler = await callStatic('build-piral', args);
    return bundler.bundle;
  },
};

export const debugPilet: DebugPiletBundlerDefinition = {
  async run(args) {
    const bundler = await callDynamic('debug-pilet', args);
    return bundler;
  },
};

export const buildPilet: BuildPiletBundlerDefinition = {
  async run(args) {
    const bundler = await callStatic('build-pilet', args);
    return bundler.bundle;
  },
};
