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
    });

    // we watch the state container for changes
    addChangeHandler(context.state, 'debugging', ({ current, previous }) => {
      const viewState = sessionStorage.getItem('dbg:view-state') !== 'off';

      if (viewState) {
        const infos = new Error().stack;

        if (infos) {
          // Chrome, Firefox, ... (full capability)
          const lastLine = infos.split('\n')[7];

          if (lastLine) {
            const action = lastLine.replace(/^\s+at\s+(Atom\.|Object\.)?/, '');
            console.group(
              `%c Piral State Change %c ${new Date().toLocaleTimeString()}`,
              'color: gray; font-weight: lighter;',
              'color: black; font-weight: bold;',
            );
            console.log('%c Previous', `color: #9E9E9E; font-weight: bold`, previous);
            console.log('%c Action', `color: #03A9F4; font-weight: bold`, action);
            console.log('%c Next', `color: #4CAF50; font-weight: bold`, current);
            console.groupEnd();
          }
        } else {
          // IE 11, ... (does not know colors etc.)
          console.log('Changed state', previous, current);
        }
      }
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
