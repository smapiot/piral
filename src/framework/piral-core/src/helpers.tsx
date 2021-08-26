import { addChangeHandler } from '@dbeining/react-atom';
import {
  PiletApiCreator,
  LoadPiletsOptions,
  CustomSpecLoaders,
  DefaultLoaderConfig,
  PiletDependencyFetcher,
  getDependencyResolver,
  getDefaultLoader,
  extendLoader,
  PiletLoader,
} from 'piral-base';
import { globalDependencies, getLocalDependencies } from './modules';
import type {
  AvailableDependencies,
  Pilet,
  PiletRequester,
  GlobalStateContext,
  PiletDependencyGetter,
  PiletLoadingStrategy,
} from './types';

/**
 * Creates a dependency getter that sets the shared dependencies explicitly.
 * Overrides the potentially set shared dependencies from the Piral CLI, but
 * keeps all global dependencies such as react, react-dom, ...
 * @param sharedDependencies The shared dependencies to declare.
 */
export function setSharedDependencies(sharedDependencies: AvailableDependencies) {
  const dependencies = {
    ...globalDependencies,
    ...sharedDependencies,
  };
  return () => dependencies;
}

/**
 * Creates a dependency getter that extends the shared dependencies with additional dependencies.
 * @param additionalDependencies The additional dependencies to declare.
 */
export function extendSharedDependencies(additionalDependencies: AvailableDependencies) {
  const dependencies = {
    ...getLocalDependencies(),
    ...additionalDependencies,
  };
  return () => dependencies;
}

export interface PiletOptionsConfig {
  availablePilets: Array<Pilet>;
  createApi: PiletApiCreator;
  fetchDependency: PiletDependencyFetcher;
  getDependencies: PiletDependencyGetter;
  strategy: PiletLoadingStrategy;
  requestPilets: PiletRequester;
  loaderConfig?: DefaultLoaderConfig;
  loaders?: CustomSpecLoaders;
  loadPilet: PiletLoader;
  context: GlobalStateContext;
}

export function createPiletOptions({
  context,
  createApi,
  availablePilets,
  fetchDependency,
  getDependencies,
  loaderConfig,
  loadPilet,
  strategy,
  loaders,
  requestPilets,
}: PiletOptionsConfig): LoadPiletsOptions {
  getDependencies = getDependencyResolver(globalDependencies, getDependencies);
  loadPilet = extendLoader(loadPilet ?? getDefaultLoader(getDependencies, fetchDependency, loaderConfig), loaders);

  // if we build the debug version of piral (debug and emulator build)
  if (process.env.DEBUG_PIRAL) {
    const { installPiralDebug } = require('piral-debug-utils');

    installPiralDebug({
      context,
      createApi,
      getDependencies,
      loadPilet,
      requestPilets,
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
    getDependencies,
    pilets: availablePilets,
    fetchPilets: requestPilets,
    dependencies: globalDependencies,
  };
}
