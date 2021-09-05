import {
  PiletApiCreator,
  LoadPiletsOptions,
  CustomSpecLoaders,
  DefaultLoaderConfig,
  getDefaultLoader,
  extendLoader,
  PiletLoader,
} from 'piral-base';
import { globalDependencies } from './modules';
import type { Pilet, PiletRequester, GlobalStateContext, PiletLoadingStrategy, DependencySelector } from './types';

export interface PiletOptionsConfig {
  context: GlobalStateContext;
  loaders?: CustomSpecLoaders;
  loaderConfig?: DefaultLoaderConfig;
  availablePilets: Array<Pilet>;
  strategy: PiletLoadingStrategy;
  createApi: PiletApiCreator;
  loadPilet: PiletLoader;
  requestPilets: PiletRequester;
  shareDependencies: DependencySelector;
}

export function createPiletOptions({
  context,
  loaders,
  loaderConfig,
  availablePilets,
  strategy,
  createApi,
  loadPilet,
  requestPilets,
  shareDependencies,
}: PiletOptionsConfig) {
  const options: LoadPiletsOptions = {
    config: loaderConfig,
    strategy,
    loadPilet: extendLoader(loadPilet ?? getDefaultLoader(loaderConfig), loaders),
    createApi,
    pilets: availablePilets,
    fetchPilets: requestPilets,
    dependencies: shareDependencies(globalDependencies),
  };

  // if we build the debug version of piral (debug and emulator build)
  if (process.env.DEBUG_PIRAL) {
    const { integrate } = require('../debug-piral');
    integrate(context, options);
  }

  // if we build the emulator version of piral (shipped to pilets)
  if (process.env.DEBUG_PILET) {
    const { integrate } = require('../debug-pilet');
    integrate(context, options);
  }

  return options;
}
