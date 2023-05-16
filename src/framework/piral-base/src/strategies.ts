import { checkCreateApi, promisify, registerDependencies } from './utils';
import { loadPilets, loadMetadata } from './load';
import { getDefaultLoader, extendLoader } from './loader';
import { runPilet, runPilets } from './aggregate';
import type {
  PiletLifecycleHooks,
  LoadPiletsOptions,
  PiletsLoaded,
  Pilet,
  PiletApiCreator,
  PiletLoadingStrategy,
} from './types';

function runAll(
  createApi: PiletApiCreator,
  existingPilets: Array<Pilet>,
  additionalPilets: Array<Pilet>,
  hooks?: PiletLifecycleHooks,
) {
  if (!Array.isArray(existingPilets)) {
    return Promise.reject(`The existing pilets must be passed as an array.`);
  }

  if (!checkCreateApi(createApi)) {
    return Promise.resolve([]);
  }

  try {
    for (const existing of existingPilets) {
      const { name } = existing;
      const [newPilet] = additionalPilets.filter((pilet) => pilet.name === name);

      if (newPilet) {
        additionalPilets.splice(additionalPilets.indexOf(newPilet), 1);
      }
    }

    const pilets = [...existingPilets, ...additionalPilets];
    return runPilets(createApi, pilets, hooks);
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
      hooks,
    } = options;
    const loadingAll = loadMetadata(fetchPilets);
    const loadSingle = extendLoader(loadPilet, loaders);

    return registerDependencies(dependencies).then(() => {
      if (!checkCreateApi(createApi)) {
        cb(undefined, []);
        return Promise.resolve();
      }

      return runPilets(createApi, pilets, hooks).then((integratedPilets) => {
        if (async && integratedPilets.length > 0) {
          cb(undefined, [...integratedPilets]);
        }

        const followUp = loadingAll.then((metadata) => {
          const promises = metadata.map((m) =>
            loadSingle(m).then((app) => {
              const available = pilets.filter((m) => m.name === app.name).length === 0;

              if (available) {
                return runPilet(createApi, app, hooks).then((additionalPilet) => {
                  integratedPilets.push(additionalPilet);

                  if (async) {
                    cb(undefined, [...integratedPilets]);
                  }
                });
              }
            }),
          );

          return Promise.all(promises).then(() => {
            if (!async) {
              cb(undefined, integratedPilets);
            }
          });
        });

        if (async) {
          followUp.catch(() => {});
          return loadingAll.then();
        } else {
          return followUp.then();
        }
      });
    });
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
  return promisify();
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
    hooks,
  } = options;
  const loadSingle = extendLoader(loadPilet, loaders);

  return registerDependencies(dependencies)
    .then(() => loadPilets(fetchPilets, loadSingle))
    .then((additionalPilets) => runAll(createApi, pilets, additionalPilets, hooks))
    .then((integratedPilets) => cb(undefined, integratedPilets))
    .catch((error) => cb(error, []));
}

/**
 * The strategy that could be used for special purposes, e.g., SSR or specific
 * builds of the Piral instance. This strategy ignores the fetcher and only
 * considers the already given pilets.
 */
export function syncStrategy(options: LoadPiletsOptions, cb: PiletsLoaded): PromiseLike<void> {
  const { createApi, hooks, dependencies = {}, pilets = [] } = options;

  return registerDependencies(dependencies).then(() =>
    runAll(createApi, pilets, [], hooks).then(
      (integratedPilets) => cb(undefined, integratedPilets),
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
    return promisify();
  };
}
