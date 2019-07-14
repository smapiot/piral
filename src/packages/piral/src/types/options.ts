import { ArbiterModuleMetadata } from 'react-arbiter';
import { PiralStateConfiguration, GlobalState, PiletRequester, Extend } from 'piral-core';
import { LocalizationMessages, PiralGqlApiQuery, PiralFetchApiFetch } from 'piral-ext';
import { PiletApi } from './api';
import { LayoutBuilder } from './layout';

export interface PiralAttachment<TApi = PiletApi> {
  (api: TApi): void;
}

export type PiletsMetadata = Array<ArbiterModuleMetadata>;

export interface PiletQueryResult {
  pilets: PiletsMetadata;
}

export interface PiralConfig<TApi = PiletApi, TState extends GlobalState = GlobalState>
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
  extendApi?: Extend<PiletApi, TApi>;
}

export interface PiralLoader<TApi = PiletApi, TState extends GlobalState = GlobalState> {
  (options: { query: PiralGqlApiQuery; fetch: PiralFetchApiFetch }): Promise<PiralConfig<TApi, TState> | undefined>;
}

/**
 * Defines the options for rendering a Piral instance.
 */
export interface PiralOptions<TApi = PiletApi, TState extends GlobalState = GlobalState> {
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
   * Defines some optional initial data loading.
   */
  loader?: PiralConfig<TApi, TState> | PiralLoader<TApi, TState>;
  /**
   * Gets the layout builder to construct the design to display.
   */
  layout: LayoutBuilder;
}
