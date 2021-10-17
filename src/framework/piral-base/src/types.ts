/**
 * Basic metadata for pilets using the v0 schema.
 */
export interface PiletMetadataV0Base {
  /**
   * The name of the pilet, i.e., the package id.
   */
  name: string;
  /**
   * The version of the pilet. Should be semantically versioned.
   */
  version: string;
  /**
   * Optionally provides the version of the specification for this pilet.
   */
  spec?: 'v0';
  /**
   * The computed hash value of the pilet's content. Should be
   * accurate to allow caching.
   */
  hash: string;
  /**
   * Optionally provides some custom metadata for the pilet.
   */
  custom?: any;
  /**
   * Optionally provides some configuration to be used in the pilet.
   */
  config?: Record<string, any>;
  /**
   * Additional shared dependency script files.
   */
  dependencies?: Record<string, string>;
}

/**
 * Metadata for pilets using the v0 schema with a content.
 */
export interface PiletMetadataV0Content extends PiletMetadataV0Base {
  /**
   * The content of the pilet. If the content is not available
   * the link will be used (unless caching has been activated).
   */
  content: string;
  /**
   * If available indicates that the pilet should not be cached.
   * In case of a string this is interpreted as the expiration time
   * of the cache. In case of an accurate hash this should not be
   * required or set.
   */
  noCache?: boolean | string;
}

/**
 * Metadata for pilets using the v0 schema with a link.
 */
export interface PiletMetadataV0Link extends PiletMetadataV0Base {
  /**
   * The link for retrieving the content of the pilet.
   */
  link: string;
}

/**
 * Metadata for pilets using the v0 schema.
 */
export type PiletMetadataV0 = PiletMetadataV0Content | PiletMetadataV0Link;

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
   * Optionally provides the version of the specification for this pilet.
   */
  spec?: 'v1';
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
  /**
   * Optionally provides some configuration to be used in the pilet.
   */
  config?: Record<string, any>;
  /**
   * Additional shared dependency script files.
   */
  dependencies?: Record<string, string>;
}

/**
 * Metadata for pilets using the v2 schema.
 */
export interface PiletMetadataV2 {
  /**
   * The name of the pilet, i.e., the package id.
   */
  name: string;
  /**
   * The version of the pilet. Should be semantically versioned.
   */
  version: string;
  /**
   * Provides the version of the specification for this pilet.
   */
  spec: 'v2';
  /**
   * The reference name for the global require.
   */
  requireRef: string;
  /**
   * The computed integrity of the pilet.
   */
  integrity?: string;
  /**
   * The link for retrieving the content of the pilet.
   */
  link: string;
  /**
   * Optionally provides some custom metadata for the pilet.
   */
  custom?: any;
  /**
   * Optionally provides some configuration to be used in the pilet.
   */
  config?: Record<string, any>;
  /**
   * Additional shared dependency script files.
   */
  dependencies?: Record<string, string>;
}

export interface PiletMetadataVx {
  /**
   * The name of the pilet, i.e., the package id.
   */
  name: string;
  /**
   * The version of the pilet. Should be semantically versioned.
   */
  version: string;
  /**
   * Provides an identifier for the custom specification.
   */
  spec: string;
  /**
   * Optionally provides some custom metadata for the pilet.
   */
  custom?: any;
  /**
   * Optionally provides some configuration to be used in the pilet.
   */
  config?: Record<string, any>;
  /**
   * Additional shared dependency script files.
   */
  dependencies?: Record<string, string>;
}

/**
 * Metadata for pilets using the bundle schema.
 */
export interface PiletMetadataBundle {
  /**
   * The name of the bundle pilet, i.e., the package id.
   */
  name?: string;
  /**
   * Optionally provides the version of the specification for this pilet.
   */
  spec?: 'v1';
  /**
   * The link for retrieving the bundle content of the pilet.
   */
  link: string;
  /**
   * The reference name for the global bundle-shared require.
   */
  bundle: string;
  /**
   * The computed integrity of the pilet. Will be used to set the
   * integrity value of the script.
   */
  integrity?: string;
  /**
   * Optionally provides some custom metadata for the pilet.
   */
  custom?: any;
  /**
   * Additional shared dependency script files.
   */
  dependencies?: Record<string, string>;
}

/**
 * The metadata response for a single pilet.
 */
export type SinglePiletMetadata = PiletMetadataV0 | PiletMetadataV1 | PiletMetadataV2 | PiletMetadataVx;

/**
 * The metadata response for a multi pilet.
 */
export type MultiPiletMetadata = PiletMetadataBundle;

/**
 * Additional metadata that may be added to the runtime information.
 */
export interface PiletRuntimeMetadata {
  basePath?: string;
}

/**
 * Describes the metadata transported by a pilet.
 */
export type PiletMetadata = (SinglePiletMetadata | MultiPiletMetadata) & PiletRuntimeMetadata;

/**
 * Metadata for the UMD (v1) pilets.
 */
export type PiletUmdMetadata = (PiletMetadataBundle | PiletMetadataV1) & PiletRuntimeMetadata;

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
 * Gets fired when a pilet gets unloaded.
 */
export interface PiralUnloadPiletEvent {
  /**
   * The name of the pilet to be unloaded.
   */
  name: string;
}

/**
 * The map of known Piral app shell events.
 */
export interface PiralEventMap {
  'unload-pilet': PiralUnloadPiletEvent;
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
export interface SinglePiletApp {
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
 * The pilet app, i.e., the functional exports.
 */
export interface MultiPiletApp {
  /**
   * Integrates the evaluated pilet into the application.
   * @param api The API to access the application.
   */
  setup(apiFactory: PiletApiCreator): void | Promise<void>;
}

/**
 * The application's entry point exported by a pilet.
 */
export type PiletApp = SinglePiletApp | MultiPiletApp;

/**
 * Defines the exports of a pilet.
 */
export interface PiletExports {
  exports: PiletApp | undefined;
}

/**
 * An evaluated single pilet.
 */
export type SinglePilet = SinglePiletApp & SinglePiletMetadata;

/**
 * An evaluated multi pilet.
 */
export type MultiPilet = MultiPiletApp & MultiPiletMetadata;

/**
 * An evaluated pilet, i.e., a full pilet: functionality and metadata.
 */
export type Pilet = SinglePilet | MultiPilet;

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
 * Defines the spec identifiers for custom loading.
 */
export type CustomSpecLoaders = Record<string, PiletLoader>;

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
