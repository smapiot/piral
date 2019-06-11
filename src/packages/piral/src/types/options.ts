import { ComponentType } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { PiletRequester, GlobalState } from 'piral-core';
import { LocalizationMessages } from 'piral-ext';
import { PiletApi } from './api';
import { ComponentOptions } from './components';

export interface PiralAttachment {
  (api: PiletApi): void;
}

export interface PiralInitializer {
  <TState extends GlobalState<TUser>, TUser = {}>(state: GlobalState<TUser>): TState;
}

export interface PiralOptions extends ComponentOptions {
  /**
   * Sets the selector of the element to render into.
   * @default '#app'
   */
  selector?: string | Element;
  /**
   * Sets the function to request the pilets. By default the
   * pilets are requested via the standardized GraphQL resource.
   */
  requestPilets?: PiletRequester;
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
   * Sets additional routes (pages) to be available.
   * @default {}
   */
  routes?: Record<string, ComponentType<RouteComponentProps>>;
  /**
   * Sets additional trackers to be available.
   * @default []
   */
  trackers?: Array<ComponentType<RouteComponentProps>>;
  /**
   * Sets the default translations to be available.
   * @default {}
   */
  translations?: LocalizationMessages;
  /**
   * Attaches a single static module to the application.
   */
  attach?: PiralAttachment;
  /**
   * Initializes the global state container.
   * @param state The proposed initial state.
   */
  initialize?: PiralInitializer;
}
