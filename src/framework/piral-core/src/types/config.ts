import type {
  PiletRequester,
  PiletLoadingStrategy,
  PiletLoader,
  Pilet,
  AvailableDependencies,
  CustomSpecLoaders,
  DefaultLoaderConfig,
  PiletApiCreator,
} from 'piral-base';
import { DebuggerExtensionOptions } from 'piral-debug-utils';
import type { NestedPartial } from './common';
import type { PiralPlugin } from './plugin';
import type { GlobalState, GlobalStateContext, PiralDefineActions } from './state';

export { PiletLoadingStrategy, PiletRequester, AvailableDependencies };

/**
 * Definition for customizing the shared dependencies.
 */
export interface DependencySelector {
  /**
   * Selects the dependencies to share from the currently available dependencies.
   * @param currentDependencies The currently available dependencies.
   * @default currentDependencies All current dependencies are shared
   * @returns The dependencies selected to be shared.
   */
  (currentDependencies: AvailableDependencies): AvailableDependencies;
}

/**
 * The configuration for loading the pilets of the Piral instance.
 */
export interface PiralPiletConfiguration {
  /**
   * Function to load the modules asynchronously, e.g., from a server 🚚.
   */
  requestPilets?: PiletRequester;
  /**
   * Function to define how to load a pilet given its metadata.
   */
  loadPilet?: PiletLoader;
  /**
   * Optionally, defines loaders for custom specifications.
   */
  loaders?: CustomSpecLoaders;
  /**
   * Optionally, configures the default loader.
   */
  loaderConfig?: DefaultLoaderConfig;
  /**
   * Optionally, configures explicitly what dependencies are shared.
   */
  shareDependencies?: DependencySelector;
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
   * Extends the Piral instance with additional capabilities.
   */
  plugins?: PiralPlugin | Array<PiralPlugin>;
  /**
   * Optionally overrides the API factory. By default the `defaultApiFactory`
   * function is used.
   */
  apiFactory?: PiletApiFactory;
}

/**
 * Defines an API creation factory.
 */
export interface PiletApiFactory {
  /**
   * @param context The global state context.
   * @param apis The different APIs to consider.
   */
  (context: GlobalStateContext, apis: Array<PiralPlugin>): PiletApiCreator;
}

/**
 * The initial configuration of Piral's state container.
 */
export interface PiralStateConfiguration {
  /**
   * Optionally, sets up the initial state of the application 📦.
   */
  state?: NestedPartial<GlobalState>;
  /**
   * Optionally, sets up some initial custom actions ⚡️.
   */
  actions?: PiralDefineActions;
  /**
   * Optionally, sets up additional configuration for the debug tooling 🤖.
   */
  debug?: DebuggerExtensionOptions;
}

/**
 * The configuration to be used in the Piral instance.
 */
export type PiralConfiguration = PiralPiletConfiguration & PiralStateConfiguration;
