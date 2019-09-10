import { ArbiterModuleMetadata } from 'react-arbiter';
import { LocalizationMessages, FetchConfig, GqlConfig, LocaleConfig } from 'piral-ext';
import { PiralStateConfiguration, PiletRequester, Extend, PiletApi } from 'piral-core';
import { PiralGqlApiQuery, PiralFetchApiFetch, PiralGqlApiMutate, PiralGqlApiSubscribe } from 'piral-ext';
import { LayoutBuilder } from './layout';

export interface PiralAttachment {
  (api: PiletApi): void;
}

export type PiletsMetadata = Array<ArbiterModuleMetadata>;

export interface PiletQueryResult {
  pilets: PiletsMetadata;
}

export interface PiralConfig extends PiralStateConfiguration {
  /**
   * Sets the default translations to be available. Alternatively,
   * sets the available languages.
   * @default {}
   */
  translations?: LocalizationMessages | Array<string>;
  /**
   * Attaches a single static module to the application.
   */
  attach?: PiralAttachment;
  /**
   * Sets the function for loading the pilets or the loaded pilet (metadata) itself.
   */
  pilets?: PiletRequester | PiletsMetadata;
  /**
   * Optionally provides a function to extend the API creator with some additional
   * functionality.
   */
  extendApi?: Extend;
  /**
   * Sets up the configuration for fetch.
   */
  fetch?: FetchConfig;
  /**
   * Sets up the configuration for localization.
   */
  locale?: LocaleConfig;
}

export interface PiralLoaderOptions {
  query: PiralGqlApiQuery;
  fetch: PiralFetchApiFetch;
  mutate: PiralGqlApiMutate;
  subscribe: PiralGqlApiSubscribe;
}

export interface PiralLoader {
  (options: PiralLoaderOptions): Promise<PiralConfig | undefined>;
}

/**
 * Defines the options for rendering a Piral instance.
 */
export interface PiralOptions {
  /**
   * Sets the selector of the element to render into.
   * @default '#app'
   */
  selector?: string | Element;
  /**
   * Sets the URL of the portal gateway to the backend.
   * @default document.location.origin,
   */
  gatewayUrl?: string;
  /**
   * Sets the URL of the GraphQL subscription or prevents
   * creating a subscription.
   * @default gatewayUrl,
   */
  subscriptionUrl?: false | string;
  /**
   * Gets the optional initial configuration.
   */
  config?: PiralConfig;
  /**
   * Defines some optional initial configuration loading.
   */
  loader?: PiralLoader;
  /**
   * Gets the layout builder to construct the design to display.
   */
  layout: LayoutBuilder;
  /**
   * Sets up the configuration for GraphQL.
   */
  gql?: GqlConfig;
}
