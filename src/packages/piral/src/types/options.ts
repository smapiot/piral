import { PiralConfiguration } from 'piral-core';
import { LocalizationMessages } from 'piral-ext';
import { PiletApi } from './api';
import { LayoutBuilder } from './layout';

export interface PiralAttachment {
  (api: PiletApi): void;
}

/**
 * Defines the options for rendering a Piral instance.
 */
export interface PiralOptions extends PiralConfiguration<PiletApi> {
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
   * Sets the default translations to be available.
   * @default {}
   */
  translations?: LocalizationMessages;
  /**
   * Attaches a single static module to the application.
   */
  attach?: PiralAttachment;
  /**
   * Gets the layout builder to construct the design to display.
   */
  layout: LayoutBuilder;
}
