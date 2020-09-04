import type { PiletApi, PiletApiCreator, LoadPiletsOptions, EventEmitter } from 'piral-base';
import type { GlobalStateContext } from './state';
import type { LayoutBreakpoints } from './layout';

/**
 * The props of the Piral component.
 */
export interface PortalProps {
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
 * The PiralInstance component, which is an event emitter containing the React
 * functional component as well as some other utilities and helpers.
 */
export interface PiralInstance extends EventEmitter {
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
