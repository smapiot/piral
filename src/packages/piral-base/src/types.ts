export interface PiletMetadata {
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

export interface GenericPiletApp<TApi> {
  /**
   * Integrates the evaluated pilet into the application.
   * @param api The API to access the application.
   */
  setup(api: TApi): void | Promise<void>;
  /**
   * Optional function for cleanup.
   * @param api The API to access the application.
   */
  teardown?(api: TApi): void;
}

export interface GenericPiletExports<TApi> {
  exports: GenericPiletApp<TApi> | undefined;
}

export type GenericPilet<TApi> = GenericPiletApp<TApi> & PiletMetadata;

export interface PiletDependencyFetcher {
  /**
   * Defines how other dependencies are fetched.
   * @param url The URL to the dependency that should be fetched.
   * @returns The promise yielding the dependency's content.
   */
  (url: string): Promise<string>;
}

export interface GenericPiletApiCreator<TApi> {
  /**
   * Creates an API for the given raw pilet.
   * @param target The raw (meta) content of the pilet.
   * @returns The API object to be used with the pilet.
   */
  (target: PiletMetadata): TApi;
}

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

export interface PiletFetcher {
  /**
   * Gets the raw pilets (e.g., from a server) asynchronously.
   */
  (): Promise<Array<PiletMetadata>>;
}

export interface AvailableDependencies {
  [name: string]: any;
}

export interface PiletsLoaded<TApi> {
  (error: Error | undefined, pilets: Array<GenericPilet<TApi>>): void;
}

export interface PiletsLoading<TApi> {
  (error: Error | undefined, pilets: Array<GenericPilet<TApi>>, loaded: boolean): void;
}

export interface PiletLoadingStrategy<TApi> {
  (options: LoadPiletsOptions<TApi>, pilets: PiletsLoaded<TApi>): PromiseLike<void>;
}

export interface LoadPiletsOptions<TApi> {
  /**
   * The callback function for creating an API object.
   * The API object is passed on to a specific pilet.
   */
  createApi: GenericPiletApiCreator<TApi>;
  /**
   * The callback for fetching the dynamic pilets.
   */
  fetchPilets: PiletFetcher;
  /**
   * Optionally, some already existing evaluated pilets, e.g.,
   * helpful when debugging or in SSR scenarios.
   */
  pilets?: Array<GenericPilet<TApi>>;
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
  strategy?: PiletLoadingStrategy<TApi>;
}
