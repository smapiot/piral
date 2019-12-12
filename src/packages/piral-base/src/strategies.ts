import { getDependencyResolver } from './utils';
import { loadPilet, loadPilets, loadMetadata } from './load';
import { createPilets, createPilet } from './aggregate';
import { LoadPiletsOptions, PiletsLoaded, GenericPilet, GenericPiletApiCreator, PiletLoadingStrategy } from './types';

function evalAll<TApi>(
  createApi: GenericPiletApiCreator<TApi>,
  oldModules: Array<GenericPilet<TApi>>,
  newModules: Array<GenericPilet<TApi>>,
) {
  for (const oldModule of oldModules) {
    const [newModule] = newModules.filter(m => m.name === oldModule.name);

    if (newModule) {
      newModules.splice(newModules.indexOf(newModule), 1);
    }
  }

  return createPilets(createApi, [...oldModules, ...newModules]);
}

/**
 * This strategy is dependent on the async parameter. If false it will start rendering when
 * everything has been received, otherwise it will start rendering when the metadata has been
 * received. In any case it will evaluate pilets as fast as possible.
 */
export function createProgressiveStrategy<TApi>(async: boolean): PiletLoadingStrategy<TApi> {
  return (options, cb) => {
    const { fetchPilets, fetchDependency, dependencies, getDependencies, createApi, pilets = [] } = options;
    const getDep = getDependencyResolver(dependencies, getDependencies);
    const loader = loadMetadata(fetchPilets);
    const allModules = createPilets(createApi, pilets);

    if (async && allModules.length > 0) {
      cb(undefined, allModules);
    }

    const followUp = loader.then(metadata =>
      metadata.map(m =>
        loadPilet<TApi>(m, getDep, fetchDependency).then(mod => {
          const available = pilets.filter(m => m.name === mod.name).length === 0;
          metadata.pop();

          if (available) {
            allModules.push(createPilet(createApi, mod));

            if (async) {
              cb(undefined, allModules);
            }
          }

          if (!async && metadata.length === 0) {
            cb(undefined, allModules);
          }
        }),
      ),
    );

    return async ? loader.then() : followUp.then();
  };
}

/**
 * This strategy starts rendering when the pilets metadata has been received.
 * Evaluates the pilets once available without waiting for all pilets to be
 * available.
 */
export function blazingStrategy<TApi>(options: LoadPiletsOptions<TApi>, cb: PiletsLoaded<TApi>): PromiseLike<void> {
  const strategy = createProgressiveStrategy<TApi>(true);
  return strategy(options, cb);
}

/**
 * The async strategy picked when no strategy is declared and async is set to
 * true. Directly renders, but waits for all pilets to be available before
 * evaluating them.
 */
export function asyncStrategy<TApi>(options: LoadPiletsOptions<TApi>, cb: PiletsLoaded<TApi>): PromiseLike<void> {
  standardStrategy(options, cb);
  return Promise.resolve();
}

/**
 * The standard strategy that is used if no strategy is declared and async is
 * false. Loads and evaluates all pilets before rendering.
 */
export function standardStrategy<TApi>(options: LoadPiletsOptions<TApi>, cb: PiletsLoaded<TApi>): PromiseLike<void> {
  const { fetchPilets, fetchDependency, dependencies, getDependencies, createApi, pilets = [] } = options;
  return loadPilets(fetchPilets, fetchDependency, dependencies, getDependencies).then(
    newModules => cb(undefined, evalAll(createApi, pilets, newModules)),
    error => cb(error, []),
  );
}

/**
 * The strategy that could be used for special purposes, e.g., SSR or specific
 * builds of the Piral instance. This strategy ignores the fetcher and only
 * considers the already given pilets.
 */
export function syncStrategy<TApi>(options: LoadPiletsOptions<TApi>, cb: PiletsLoaded<TApi>): PromiseLike<void> {
  const { createApi, pilets = [] } = options;
  cb(undefined, evalAll(createApi, pilets, []));
  return {
    then(done) {
      done();
      return undefined;
    },
  };
}
