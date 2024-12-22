import { EventEmitter } from './api';

/**
 * Describes the metadata of a pilet available in its API.
 */
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
   * Provides the version of the specification for this pilet.
   */
  spec: string;
  /**
   * Provides some custom metadata for the pilet.
   */
  custom?: any;
  /**
   * Optionally indicates the global require reference, if any.
   */
  requireRef?: string;
  /**
   * Additional shared dependencies from the pilet.
   */
  dependencies: Record<string, string>;
  /**
   * Provides some configuration to be used in the pilet.
   */
  config: Record<string, any>;
  /**
   * The URL of the main script of the pilet.
   */
  link: string;
  /**
   * The base path to the pilet. Can be used to make resource requests
   * and override the public path.
   */
  basePath: string;
}

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
  /**
   * The referenced stylesheets to load / integrate.
   * This would only be used by v3 pilets.
   */
  styles?: Array<string>;
  /**
   * The referenced WebAssembly binaries to load / integrate.
   * This would only be used by v3 pilets.
   */
  assemblies?: Array<string>;
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
export type SinglePilet = SinglePiletApp & PiletMetadata;

/**
 * An evaluated multi pilet.
 */
export type MultiPilet = MultiPiletApp & PiletMetadata;

/**
 * An evaluated pilet, i.e., a full pilet: functionality and metadata.
 */
export type Pilet = SinglePilet | MultiPilet;
