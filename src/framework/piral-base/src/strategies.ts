import { getDefaultLoader, extendLoader } from './loader';
import { loadPilets, loadMetadata } from './load';
import { registerDependencies } from './system';
import { createPilets, createPilet } from './aggregate';
import type { LoadPiletsOptions, PiletsLoaded, Pilet, PiletApiCreator, PiletLoadingStrategy } from './types';

function evalAll(createApi: PiletApiCreator, oldModules: Array<Pilet>, newModules: Array<Pilet>) {
  if (!Array.isArray(oldModules)) {
    return Promise.reject(`The existing pilets must be passed as an array.`);
  }

  try {
    for (const oldModule of oldModules) {
      const [newModule] = newModules.filter((m) => m.name === oldModule.name);

      if (newModule) {
        newModules.splice(newModules.indexOf(newModule), 1);
      }
    }

    return createPilets(createApi, [...oldModules, ...newModules]);
  } catch (err) {
    return Promise.reject(err);
  }
}

/**
 * This strategy is dependent on the async parameter. If false it will start rendering when
 * everything has been received, otherwise it will start rendering when the metadata has been
 * received. In any case it will evaluate pilets as fast as possible.
 * @param async Uses the asynchronous mode.
 */
export function createProgressiveStrategy(async: boolean): PiletLoadingStrategy {
  return (options, cb) => {
    const {
      fetchPilets,
      dependencies = {},
      createApi,
      config,
      pilets = [],
      loadPilet = getDefaultLoader(config),
      loaders,
    } = options;
    const loader = loadMetadata(fetchPilets);
    const loadSingle = extendLoader(loadPilet, loaders);

    return registerDependencies(dependencies).then(() =>
      createPilets(createApi, pilets).then((allModules) => {
        if (async && allModules.length > 0) {
          cb(undefined, [...allModules]);
        }

        const followUp = loader.then((metadata) => {
          const promises = metadata.map((m) =>
            loadSingle(m).then((mod) => {
              const available = pilets.filter((m) => m.name === mod.name).length === 0;

              if (available) {
                return createPilet(createApi, mod).then((newModule) => {
                  allModules.push(newModule);

                  if (async) {
                    cb(undefined, [...allModules]);
                  }
                });
              }
            }),
          );

          return Promise.all(promises).then(() => {
            if (!async) {
              cb(undefined, allModules);
            }
          });
        });

        return async ? loader.then() : followUp.then();
      }),
    );
  };
}

/**
 * This strategy starts rendering when the pilets metadata has been received.
 * Evaluates the pilets once available without waiting for all pilets to be
 * available.
 */
export function blazingStrategy(options: LoadPiletsOptions, cb: PiletsLoaded): PromiseLike<void> {
  const strategy = createProgressiveStrategy(true);
  return strategy(options, cb);
}

/**
 * The async strategy picked when no strategy is declared and async is set to
 * true. Directly renders, but waits for all pilets to be available before
 * evaluating them.
 */
export function asyncStrategy(options: LoadPiletsOptions, cb: PiletsLoaded): PromiseLike<void> {
  standardStrategy(options, cb);
  return Promise.resolve();
}

/**
 * The standard strategy that is used if no strategy is declared and async is
 * false. Loads and evaluates all pilets before rendering.
 */
export function standardStrategy(options: LoadPiletsOptions, cb: PiletsLoaded): PromiseLike<void> {
  const {
    fetchPilets,
    dependencies = {},
    createApi,
    config,
    pilets = [],
    loadPilet = getDefaultLoader(config),
    loaders,
  } = options;
  const loadSingle = extendLoader(loadPilet, loaders);
  return registerDependencies(dependencies)
    .then(() => loadPilets(fetchPilets, loadSingle))
    .then((newModules) => evalAll(createApi, pilets, newModules))
    .then((modules) => cb(undefined, modules))
    .catch((error) => cb(error, []));
}

/**
 * The strategy that could be used for special purposes, e.g., SSR or specific
 * builds of the Piral instance. This strategy ignores the fetcher and only
 * considers the already given pilets.
 */
export function syncStrategy(options: LoadPiletsOptions, cb: PiletsLoaded): PromiseLike<void> {
  const { createApi, dependencies = {}, pilets = [] } = options;
  return registerDependencies(dependencies).then(() =>
    evalAll(createApi, pilets, []).then(
      (modules) => cb(undefined, modules),
      (err) => cb(err, []),
    ),
  );
}

/**
 * Creates a strategy that deferres the actual loading until a trigger promise resolves.
 * The loading spinner is not shown during this time and pilets are supposed to appear directly.
 * @param trigger The trigger resolving when the strategy should be applied.
 * @param strategy The strategy to apply. Falls back to the standard strategy.
 * @returns A pilet loading strategy.
 */
export function createDeferredStrategy(trigger: Promise<void>, strategy = standardStrategy): PiletLoadingStrategy {
  return (options, cb) => {
    cb(undefined, []);
    trigger.then(() => strategy(options, cb));
    return Promise.resolve();
  };
}
