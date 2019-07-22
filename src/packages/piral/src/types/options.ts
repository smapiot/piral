import { ArbiterModuleMetadata } from 'react-arbiter';
import { PiralStateConfiguration, GlobalState, PiletRequester, Extend } from 'piral-core';
import {
  LocalizationMessages,
  PiralGqlApiQuery,
  PiralFetchApiFetch,
  PiralGqlApiMutate,
  PiralGqlApiSubscribe,
} from 'piral-ext';
import { LayoutBuilder } from './layout';

export interface PiralAttachment<TApi> {
  (api: TApi): void;
}

export type PiletsMetadata = Array<ArbiterModuleMetadata>;

export interface PiletQueryResult {
  pilets: PiletsMetadata;
}

export interface PiralConfig<TApi, TState extends GlobalState = GlobalState, TActions extends {} = {}>
  extends PiralStateConfiguration<TState, TActions> {
  /**
   * Sets the default translations to be available. Alternatively,
   * sets the available languages.
   * @default {}
   */
  translations?: LocalizationMessages | Array<string>;
  /**
   * Attaches a single static module to the application.
   */
  attach?: PiralAttachment<TApi>;
  /**
   * Sets the function for loading the pilets or the loaded pilet (metadata) itself.
   */
  pilets?: PiletRequester | PiletsMetadata;
  /**
   * Optionally provides a function to extend the API creator with some additional
   * functionality.
   */
  extendApi?: Extend<TApi>;
}

export interface PiralLoaderOptions {
  query: PiralGqlApiQuery;
  fetch: PiralFetchApiFetch;
  mutate: PiralGqlApiMutate;
  subscribe: PiralGqlApiSubscribe;
}

export interface PiralLoader<TApi, TState extends GlobalState = GlobalState, TActions extends {} = {}> {
  (options: PiralLoaderOptions): Promise<PiralConfig<TApi, TState, TActions> | undefined>;
}

/**
 * Defines the options for rendering a Piral instance.
 */
export interface PiralOptions<TApi, TState extends GlobalState = GlobalState, TActions extends {} = {}> {
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
  config?: PiralConfig<TApi, TState, TActions>;
  /**
   * Defines some optional initial configuration loading.
   */
  loader?: PiralLoader<TApi, TState, TActions>;
  /**
   * Gets the layout builder to construct the design to display.
   */
  layout: LayoutBuilder;
}
