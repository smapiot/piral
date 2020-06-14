import {
  PiletRequester,
  PiletDependencyFetcher,
  PiletDependencyGetter,
  PiletLoadingStrategy,
  PiletLoader,
  Pilet,
  AvailableDependencies,
} from 'piral-base';
import { NestedPartial } from './common';
import { Extend } from './plugin';
import { GlobalState, PiralDefineActions } from './state';

export { PiletLoadingStrategy, PiletDependencyFetcher, PiletDependencyGetter, PiletRequester, AvailableDependencies };

export interface PiralPiletConfiguration {
  /**
   * The callback for defining how a dependency will be fetched.
   */
  fetchDependency?: PiletDependencyFetcher;
  /**
   * Function to get the dependencies for a given module.
   */
  getDependencies?: PiletDependencyGetter;
  /**
   * Function to load the modules asynchronously, e.g., from a server 🚚.
   */
  requestPilets?: PiletRequester;
  /**
   * Function to define how to load a pilet given its metadata.
   */
  loadPilet?: PiletLoader;
  /**
   * Determines that pilets are loaded asynchronously, essentially showing the
   * app right away without waiting for the pilets to load and evaluate.
   */
  async?: boolean | PiletLoadingStrategy;
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
   * Optionally, sets up the initial state of the application 📦.
   */
  state?: NestedPartial<GlobalState>;
  /**
   * Optionally, sets up some initial custom actions ⚡️.
   */
  actions?: PiralDefineActions;
}

export type PiralConfiguration = PiralPiletConfiguration & PiralStateConfiguration;
