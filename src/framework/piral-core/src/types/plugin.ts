import type { PiletApiExtender } from 'piral-base';
import type { PiletApi } from './api';
import type { GlobalStateContext } from './state';

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
