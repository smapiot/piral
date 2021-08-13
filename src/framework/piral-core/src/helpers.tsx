import { addChangeHandler } from '@dbeining/react-atom';
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
}: PiletOptionsConfig): LoadPiletsOptions {
  const dependencies = shareDependencies(globalDependencies);
  loadPilet = extendLoader(loadPilet ?? getDefaultLoader(loaderConfig), loaders);

  // if we build the debug version of piral (debug and emulator build)
  if (process.env.DEBUG_PIRAL) {
    const { installPiralDebug } = require('piral-debug-utils');

    installPiralDebug({
      context,
      createApi,
      loadPilet,
      requestPilets,
      getDependencies() {
        return dependencies;
      },
      onChange(cb: (previous: any, current: any) => void) {
        addChangeHandler(context.state, 'debugging', ({ previous, current }) => {
          cb(previous, current);
        });
      },
    });
  }

  if (process.env.DEBUG_PILET) {
    const { withEmulatorPilets } = require('piral-debug-utils');

    requestPilets = withEmulatorPilets(requestPilets, {
      inject: context.injectPilet,
      createApi,
      loadPilet,
    });
  }

  return {
    config: loaderConfig,
    strategy,
    loadPilet,
    createApi,
    pilets: availablePilets,
    fetchPilets: requestPilets,
    dependencies,
  };
}
