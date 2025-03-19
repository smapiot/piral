import { Pilet, PiletApi, PiletApiCreator, PiletApp, PiletMetadata } from './runtime';
import { PiletEntries, PiletEntry } from './service';

/**
 * The interface describing a function capable of fetching pilets.
 */
export interface PiletRequester {
  /**
   * Gets the raw pilets (e.g., from a server) asynchronously.
   */
  (): Promise<PiletEntries>;
}

/**
 * The record containing all available dependencies.
 */
export interface AvailableDependencies {
  [name: string]: any;
}

/**
 * The callback to be used when pilets have been loaded.
 */
export interface PiletsLoaded {
  (error: Error | undefined, pilets: Array<Pilet>): void;
}

/**
 * The callback to be used when pilets are loading.
 */
export interface PiletsLoading {
  (error: Error | undefined, pilets: Array<Pilet>, loaded: boolean): void;
}

/**
 * The strategy for how pilets are loaded at runtime.
 */
export interface PiletLoadingStrategy {
  (options: LoadPiletsOptions, pilets: PiletsLoaded): PromiseLike<void>;
}

/**
 * The callback to be used to load a single pilet.
 */
export interface PiletLoader {
  (entry: PiletEntry): Promise<Pilet>;
}

/**
 * Defines the spec identifiers for custom loading.
 */
export type CustomSpecLoaders = Record<string, PiletLoader>;

/**
 * A set of pipeline hooks used by the Piral loading orchestrator.
 */
export interface PiletLifecycleHooks {
  /**
   * Hook fired before a pilet is loaded.
   */
  loadPilet?(pilet: PiletMetadata): void;
  /**
   * Hook fired before a pilet is being set up.
   */
  setupPilet?(pilet: Pilet): void;
  /**
   * Hook fired before a pilet is being cleaned up.
   */
  cleanupPilet?(pilet: Pilet): void;
}

/**
 * The options for loading pilets.
 */
export interface LoadPiletsOptions {
  /**
   * The callback function for creating an API object.
   * The API object is passed on to a specific pilet.
   */
  createApi: PiletApiCreator;
  /**
   * The callback for fetching the dynamic pilets.
   */
  fetchPilets: PiletRequester;
  /**
   * Optionally, some already existing evaluated pilets, e.g.,
   * helpful when debugging or in SSR scenarios.
   */
  pilets?: Array<Pilet>;
  /**
   * Optionally, configures the default loader.
   */
  config?: DefaultLoaderConfig;
  /**
   * Optionally, defines the default way how to load a pilet.
   */
  loadPilet?: PiletLoader;
  /**
   * Optionally, defines loaders for custom specifications.
   */
  loaders?: CustomSpecLoaders;
  /**
   * Optionally, defines a set of loading hooks to be used.
   */
  hooks?: PiletLifecycleHooks;
  /**
   * Gets the map of globally available dependencies with their names
   * as keys and their evaluated pilet content as value.
   */
  dependencies?: AvailableDependencies;
  /**
   * Optionally, defines the loading strategy to use.
   */
  strategy?: PiletLoadingStrategy;
}

/**
 * Shape to be used by a Pilet API extension that requires other
 * APIs or some metadata to work properly.
 */
export interface PiletApiExtender<T> {
  /**
   * Extends the base API of a module with new functionality.
   * @param api The API created by the base layer.
   * @param target The target the API is created for.
   * @returns The extended API.
   */
  (api: PiletApi, target: PiletMetadata): T;
}

export interface PiletRunner {
  (app: PiletApp, apiFactory: PiletApiCreator, hooks: PiletLifecycleHooks): Promise<void>;
}

/**
 * Additional configuration options for the default loader.
 */
export interface DefaultLoaderConfig {
  /**
   * Sets the cross-origin attribute of potential script tags.
   * For pilets v1 this may be useful. Otherwise, only pilets that
   * have an integrity defined will be set to "anonymous".
   */
  crossOrigin?: string;
  /**
   * Sets the override function for attaching a stylesheet.
   * This option will only affect `v3` pilets.
   * @param pilet The pilet containing the style sheet reference.
   * @param url The style sheet reference URL.
   */
  attachStyles?(pilet: Pilet, url: string): void;
}
