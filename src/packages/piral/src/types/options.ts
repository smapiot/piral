import { ArbiterModuleMetadata } from 'react-arbiter';
import { PiralStateConfiguration, GlobalState, PiletRequester, Extend, PiralApi } from 'piral-core';
import { LocalizationMessages, PiralGqlApiQuery, PiralFetchApiFetch } from 'piral-ext';
import { PiExtApi } from './api';
import { LayoutBuilder } from './layout';

export interface PiralAttachment<TApi = PiExtApi> {
  (api: PiralApi<TApi>): void;
}

export type PiletsMetadata = Array<ArbiterModuleMetadata>;

export interface PiletQueryResult {
  pilets: PiletsMetadata;
}

export interface PiralConfig<TApi = PiExtApi, TState extends GlobalState = GlobalState>
  extends PiralStateConfiguration<TState> {
  /**
   * Sets the default translations to be available.
   * @default {}
   */
  translations?: LocalizationMessages;
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

export interface PiralLoader<TApi = PiExtApi, TState extends GlobalState = GlobalState> {
  (options: { query: PiralGqlApiQuery; fetch: PiralFetchApiFetch }): Promise<PiralConfig<TApi, TState> | undefined>;
}

/**
 * Defines the options for rendering a Piral instance.
 */
export interface PiralOptions<TApi = PiExtApi, TState extends GlobalState = GlobalState> {
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
  config?: PiralConfig<TApi, TState>;
  /**
   * Defines some optional initial configuration loading.
   */
  loader?: PiralLoader<TApi, TState>;
  /**
   * Gets the layout builder to construct the design to display.
   */
  layout: LayoutBuilder;
}
