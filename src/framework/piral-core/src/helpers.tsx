import {
  PiletApiCreator,
  LoadPiletsOptions,
  CustomSpecLoaders,
  DefaultLoaderConfig,
  getDefaultLoader,
  extendLoader,
  PiletLoader,
  PiletLifecycleHooks,
} from 'piral-base';
import type { DebuggerExtensionOptions } from 'piral-debug-utils';
import { globalDependencies } from './modules';
import type { Pilet, PiletRequester, GlobalStateContext, PiletLoadingStrategy, DependencySelector } from './types';
import { integrateDebugger, integrateEmulator } from '../app.codegen';

export interface PiletOptionsConfig {
  context: GlobalStateContext;
  hooks?: PiletLifecycleHooks;
  loaders?: CustomSpecLoaders;
  loaderConfig?: DefaultLoaderConfig;
  availablePilets: Array<Pilet>;
  strategy: PiletLoadingStrategy;
  createApi: PiletApiCreator;
  loadPilet: PiletLoader;
  requestPilets: PiletRequester;
  shareDependencies: DependencySelector;
  debug?: DebuggerExtensionOptions;
}

export function createPiletOptions({
  hooks,
  context,
  loaders,
  loaderConfig,
  availablePilets,
  strategy,
  createApi,
  loadPilet,
  requestPilets,
  shareDependencies,
  debug,
}: PiletOptionsConfig) {
  const options: LoadPiletsOptions = {
    config: loaderConfig,
    strategy,
    loadPilet: extendLoader(loadPilet ?? getDefaultLoader(loaderConfig), loaders),
    createApi,
    pilets: availablePilets,
    fetchPilets: requestPilets,
    hooks,
    dependencies: shareDependencies(globalDependencies),
  };

  integrateDebugger(context, options, debug);
  integrateEmulator(context, options, debug);

  return options;
}
