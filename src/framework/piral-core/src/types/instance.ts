import type { PiletApi, PiletApiCreator, LoadPiletsOptions, EventEmitter } from 'piral-base';
import type { GlobalStateContext } from './state';
import type { LayoutBreakpoints } from './layout';
import { PiralConfiguration } from './config';

/**
 * The props of the Piral component.
 */
export interface PiralProps {
  /**
   * The specific Piral instance to be used.
   */
  instance?: PiralInstance;
  /**
   * The custom breakpoints for the different layout modi.
   */
  breakpoints?: LayoutBreakpoints;
}

/**
 * The options for creating a new PiralInstance object.
 */
export interface PiralInstanceOptions extends PiralConfiguration {
  /**
   * Defines the id of this instance. Used in case of multiple instances.
   */
  id?: string;
}

/**
 * The PiralInstance object, which is an event emitter with some other
 * utilities and helper. This object is the source for the React
 * functional component (`Piral`).
 */
export interface PiralInstance extends EventEmitter {
  /**
   * The id of the Piral instance.
   */
  id: string;
  /**
   * The global state context instance.
   */
  context: GlobalStateContext;
  /**
   * The pilet API creator callback.
   */
  createApi: PiletApiCreator;
  /**
   * The used options for loading pilets.
   */
  options: LoadPiletsOptions;
  /**
   * The root pilet for using the pilet API within the Piral instance.
   */
  root: PiletApi;
}
