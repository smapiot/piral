import { PiletApi } from './api';
import { PiletMetadata } from './meta';
import { GlobalStateContext } from './state';

export interface Extend {
  /**
   * Extends the base API with a custom set of functionality to be used by modules.
   * @param api The API created by the base layer.
   * @param target The target the API is created for.
   * @returns The extended API.
   */
  (api: PiletApi, target: PiletMetadata, context: GlobalStateContext): Partial<PiletApi>;
}

export interface PiletRequester {
  (): Promise<Array<PiletMetadata>>;
}
