import {
  AvailableDependencies,
  GenericPiletApiCreator,
  PiletDependencyGetter,
  PiletLoadingStrategy,
  LoadPiletsOptions,
  getDependencyResolver,
  loadPilet,
} from 'piral-base';
import { globalDependencies, getLocalDependencies } from './modules';
import { Pilet, PiletApi, PiletRequester, GlobalStateContext } from './types';

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

interface PiralArbiterConfig {
  availablePilets: Array<Pilet>;
  createApi: GenericPiletApiCreator<PiletApi>;
  getDependencies: PiletDependencyGetter;
  strategy: PiletLoadingStrategy<PiletApi>;
  requestPilets: PiletRequester;
  context: GlobalStateContext;
}

export function createArbiterOptions({
  context,
  createApi,
  availablePilets,
  getDependencies,
  strategy,
  requestPilets,
}: PiralArbiterConfig): LoadPiletsOptions<PiletApi> {
  if (process.env.DEBUG_PILET) {
    const loadPilets = sessionStorage.getItem('dbg:loadPilets') === 'on';
    const noPilets = () => Promise.resolve([]);
    requestPilets = loadPilets ? requestPilets : noPilets;
  }

  return {
    pilets: availablePilets,
    getDependencies,
    strategy,
    dependencies: globalDependencies,
    fetchPilets() {
      const promise = requestPilets();

      if (process.env.DEBUG_PILET) {
        const initialTarget = `${location.origin}${process.env.DEBUG_PILET}`;
        const updateTarget = initialTarget.replace('http', 'ws');
        const appendix = fetch(initialTarget).then(res => res.json());
        const ws = new WebSocket(updateTarget);

        ws.onmessage = ({ data }) => {
          const meta = JSON.parse(data);
          const getter = getDependencyResolver(globalDependencies, getDependencies);
          const fetcher = (url: string) =>
            fetch(url, {
              method: 'GET',
              cache: 'reload',
            }).then(m => m.text());
          loadPilet(meta, getter, fetcher).then(pilet => {
            try {
              const newApi = createApi(pilet);
              context.injectPilet(pilet);
              pilet.setup(newApi);
            } catch (error) {
              console.error(error);
            }
          });
        };

        return promise
          .catch(err => {
            console.error(`Requesting the pilets failed. We'll continue loading without pilets (DEBUG only).`, err);
            return [];
          })
          .then(pilets => appendix.then(pilet => [...pilets, pilet]));
      }

      return promise;
    },
    createApi,
  };
}
