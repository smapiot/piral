import { addChangeHandler } from '@dbeining/react-atom';
import {
  PiletApiCreator,
  LoadPiletsOptions,
  PiletDependencyFetcher,
  getDependencyResolver,
  getDefaultLoader,
  PiletLoader,
  setupPilet,
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
  loadPilet: PiletLoader;
  context: GlobalStateContext;
}

export function createPiletOptions({
  context,
  createApi,
  availablePilets,
  fetchDependency,
  getDependencies,
  loadPilet,
  strategy,
  requestPilets,
}: PiletOptionsConfig): LoadPiletsOptions {
  getDependencies = getDependencyResolver(globalDependencies, getDependencies);
  loadPilet = loadPilet ?? getDefaultLoader(getDependencies, fetchDependency);

  // if we build the debug version of piral (debug and emulator build)
  if (process.env.DEBUG_PIRAL !== undefined) {
    // the DEBUG_PIRAL env should contain the Piral CLI compatibility version
    window['dbg:piral'] = {
      debug: 'v0',
      instance: {
        name: process.env.BUILD_PCKG_NAME,
        version: process.env.BUILD_PCKG_VERSION,
        dependencies: process.env.SHARED_DEPENDENCIES,
        context,
      },
      build: {
        date: process.env.BUILD_TIME_FULL,
        cli: process.env.PIRAL_CLI_VERSION,
        compat: process.env.DEBUG_PIRAL,
      },
      pilets: {
        createApi,
        getDependencies,
        loadPilet,
        requestPilets,
      },
    };

    // we watch the state container for changes
    addChangeHandler(context.state, 'debugging', ({ current, previous }) => {
      const viewState = sessionStorage.getItem('dbg:view-state') !== 'off';

      if (viewState) {
        const infos = new Error().stack;

        if (infos) {
          // Chrome, Firefox, ... (full capability)
          const action = infos.split('\n')[7].replace(/^\s+at\s+(Atom\.|Object\.)?/, '');
          console.group(
            `%c Piral State Change %c ${new Date().toLocaleTimeString()}`,
            'color: gray; font-weight: lighter;',
            'color: black; font-weight: bold;',
          );
          console.log('%c Previous', `color: #9E9E9E; font-weight: bold`, previous);
          console.log('%c Action', `color: #03A9F4; font-weight: bold`, action);
          console.log('%c Next', `color: #4CAF50; font-weight: bold`, current);
          console.groupEnd();
        } else {
          // IE 11, ... (does not know colors etc.)
          console.log('Changed state', previous, current);
        }
      }
    });
  }

  if (process.env.DEBUG_PILET !== undefined) {
    // check if pilets should be loaded
    const loadPilets = sessionStorage.getItem('dbg:load-pilets') === 'on';
    const noPilets = () => Promise.resolve([]);
    requestPilets = loadPilets ? requestPilets : noPilets;
  }

  return {
    strategy,
    getDependencies,
    dependencies: globalDependencies,
    pilets: availablePilets,
    loadPilet,
    fetchPilets() {
      const promise = requestPilets();

      // if we run against the debug pilet API (emulator build only)
      if (process.env.DEBUG_PILET !== undefined) {
        // the window['dbg:pilet-api'] should point to an API address used as a proxy, fall back to '/$pilet-api' if unavailable
        const piletApi = window['dbg:pilet-api'] || '/$pilet-api';
        // either take a full URI or make it an absolute path relative to the current origin
        const initialTarget = /^https?:/.test(piletApi)
          ? piletApi
          : `${location.origin}${piletApi[0] === '/' ? '' : '/'}${piletApi}`;
        const updateTarget = initialTarget.replace('http', 'ws');
        const ws = new WebSocket(updateTarget);
        const appendix = fetch(initialTarget)
          .then((res) => res.json())
          .then((item) => (Array.isArray(item) ? item : [item]));

        ws.onmessage = ({ data }) => {
          const hardRefresh = sessionStorage.getItem('dbg:hard-refresh') === 'on';

          if (!hardRefresh) {
            // standard setting is to just perform an inject
            const meta = JSON.parse(data);
            loadPilet(meta).then((pilet) => {
              try {
                context.injectPilet(pilet);
                setupPilet(pilet, createApi);
              } catch (error) {
                console.error(error);
              }
            });
          } else {
            location.reload();
          }
        };

        return promise
          .catch((err) => {
            console.error(`Requesting the pilets failed. We'll continue loading without pilets (DEBUG only).`, err);
            return [];
          })
          .then((pilets) => appendix.then((debugPilets) => [...pilets, ...debugPilets]));
      }

      return promise;
    },
    createApi,
  };
}
