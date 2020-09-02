/**
 * Metadata for pilets using the v0 schema.
 */
export interface PiletMetadataV0 {
  /**
   * The name of the pilet, i.e., the package id.
   */
  name: string;
  /**
   * The version of the pilet. Should be semantically versioned.
   */
  version: string;
  /**
   * The content of the pilet. If the content is not available
   * the link will be used (unless caching has been activated).
   */
  content?: string;
  /**
   * The link for retrieving the content of the pilet.
   */
  link?: string;
  /**
   * The computed hash value of the pilet's content. Should be
   * accurate to allow caching.
   */
  hash: string;
  /**
   * If available indicates that the pilet should not be cached.
   * In case of a string this is interpreted as the expiration time
   * of the cache. In case of an accurate hash this should not be
   * required or set.
   */
  noCache?: boolean | string;
  /**
   * Optionally provides some custom metadata for the pilet.
   */
  custom?: any;
}
/**
 * Metadata for pilets using the v1 schema.
 */
export interface PiletMetadataV1 {
  /**
   * The name of the pilet, i.e., the package id.
   */
  name: string;
  /**
   * The version of the pilet. Should be semantically versioned.
   */
  version: string;
  /**
   * The link for retrieving the content of the pilet.
   */
  link: string;
  /**
   * The reference name for the global require.
   */
  requireRef: string;
  /**
   * The computed integrity of the pilet. Will be used to set the
   * integrity value of the script.
   */
  integrity?: string;
  /**
   * Optionally provides some custom metadata for the pilet.
   */
  custom?: any;
}

/**
 * Describes the metadata transported by a pilet.
 */
export type PiletMetadata = PiletMetadataV0 | PiletMetadataV1;

/**
 * Defines the API accessible from pilets.
 */
export interface PiletApi extends EventEmitter {
  /**
   * Gets the metadata of the current pilet.
   */
  meta: PiletMetadata;
}

/**
 * The map of known Piral app shell events.
 */
export interface PiralEventMap {
  [custom: string]: any;
}

/**
 * Listener for Piral app shell events.
 */
export interface Listener<T> {
  /**
   * Receives an event of type T.
   */
  (arg: T): void;
}

/**
 * The emitter for Piral app shell events.
 */
export interface EventEmitter {
  /**
   * Attaches a new event listener.
   * @param type The type of the event to listen for.
   * @param callback The callback to trigger.
   */
  on<K extends keyof PiralEventMap>(type: K, callback: Listener<PiralEventMap[K]>): EventEmitter;
  /**
   * Detaches an existing event listener.
   * @param type The type of the event to listen for.
   * @param callback The callback to trigger.
   */
  off<K extends keyof PiralEventMap>(type: K, callback: Listener<PiralEventMap[K]>): EventEmitter;
  /**
   * Emits a new event with the given type.
   * @param type The type of the event to emit.
   * @param arg The payload of the event.
   */
  emit<K extends keyof PiralEventMap>(type: K, arg: PiralEventMap[K]): EventEmitter;
}

/**
 * The pilet app, i.e., the functional exports.
 */
export interface PiletApp {
  /**
   * Integrates the evaluated pilet into the application.
   * @param api The API to access the application.
   */
  setup(api: PiletApi): void | Promise<void>;
  /**
   * Optional function for cleanup.
   * @param api The API to access the application.
   */
  teardown?(api: PiletApi): void;
}

/**
 * Defines the exports of a pilet.
 */
export interface PiletExports {
  exports: PiletApp | undefined;
}

/**
 * An evaluated pilet, i.e., a full pilet: functionality and metadata.
 */
export type Pilet = PiletApp & PiletMetadata;

/**
 * The callback to fetch a JS content from an URL.
 */
export interface PiletDependencyFetcher {
  /**
   * Defines how other dependencies are fetched.
   * @param url The URL to the dependency that should be fetched.
   * @returns The promise yielding the dependency's content.
   */
  (url: string): Promise<string>;
}

/**
 * The creator function for the pilet API.
 */
export interface PiletApiCreator {
  /**
   * Creates an API for the given raw pilet.
   * @param target The raw (meta) content of the pilet.
   * @returns The API object to be used with the pilet.
   */
  (target: PiletMetadata): PiletApi;
}

/**
 * The callback to get the shared dependencies for a specific pilet.
 */
export interface PiletDependencyGetter {
  /**
   * Gets the locally available dependencies for the specified
   * pilet. If this function is missing or returns false or undefined
   * the globally available dependencies will be used.
   * @returns The dependencies that should be used for evaluating the
   * pilet.
   */
  (target: PiletMetadata): AvailableDependencies | undefined | false;
}

/**
 * The interface describing a function capable of fetching pilets.
 */
export interface PiletRequester {
  /**
   * Gets the raw pilets (e.g., from a server) asynchronously.
   */
  (): Promise<Array<PiletMetadata>>;
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
  (meta: PiletMetadata): Promise<Pilet>;
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
   * Optionally, defines how to load a pilet.
   */
  loadPilet?: PiletLoader;
  /**
   * The callback for defining how a dependency will be fetched.
   */
  fetchDependency?: PiletDependencyFetcher;
  /**
   * Gets a map of available locale dependencies for a pilet.
   * The dependencies are used during the evaluation.
   */
  getDependencies?: PiletDependencyGetter;
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
