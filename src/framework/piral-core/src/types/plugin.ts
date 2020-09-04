import type { PiletApi } from './api';
import type { GlobalStateContext } from './state';
import type { PiletMetadata } from '../types';

/**
 * Shape to be used by a Pilet API extension that requires other
 * APIs or some metadata to work properly.
 */
export interface PiletApiExtender<T> {
  /**
   * Extends the base API of a module with new functionality.
   * @param api The API created by the base layer.
   * @param target The target the API is created for.
   * @returns The extended API.
   */
  (api: PiletApi, target: PiletMetadata): T;
}

/**
 * Shape to be used by a plugin used in the Piral instance.
 */
export interface PiralPlugin<T = Partial<PiletApi>> {
  /**
   * Extends the base API with a custom set of functionality to be used by modules.
   * @param context The global state context to be used.
   * @returns The extended API or a function to create the extended API for a specific target.
   */
  (context: GlobalStateContext): T | PiletApiExtender<T>;
}
