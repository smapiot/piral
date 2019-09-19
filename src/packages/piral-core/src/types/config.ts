import { DependencyGetter } from 'react-arbiter';
import { Pilet } from './api';
import { NestedPartial } from './common';
import { PiralCustomActions } from './custom';
import { PiletRequester, Extend } from './plugin';
import { GlobalState } from './state';

export interface PiralPiletConfiguration {
  /*
   * Function to load the modules asynchronously, e.g., from a server 🚚.
   */
  requestPilets?: PiletRequester;
  /**
   * Determines the modules, which are available already from the start 🚀.
   * The given modules are all already evaluated.
   * This can be used for customization or for debugging purposes.
   */
  availablePilets?: Array<Pilet>;
  /**
   * Optionally provides a function to extend the API creator with some additional
   * functionality.
   */
  extendApi?: Extend | Array<Extend>;
}

export interface PiralStateConfiguration {
  /**
   * Function to get the dependencies for a given module.
   */
  getDependencies?: DependencyGetter;
  /**
   * Determines that pilets are loaded asynchronously, essentially showing the
   * app right away without waiting for the pilets to load and evaluate.
   */
  async?: boolean;
  /**
   * Optionally, sets up the initial state of the application.
   */
  state?: NestedPartial<GlobalState>;
  /**
   * Optionally, sets additional actions to be included.
   */
  actions?: PiralCustomActions;
}

export type PiralConfiguration = PiralPiletConfiguration & PiralStateConfiguration;
