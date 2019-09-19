import { PiletApi } from './api';
import { EventEmitter } from './utils';
import { PiletMetadata } from './meta';
import { GlobalStateContext } from './state';

export interface Extend {
  /**
   * Extends the base API with a custom set of functionality to be used by modules.
   * @param api The API created by the base layer.
   * @param target The target the API is created for.
   * @returns The extended API.
   */
  (api: PiletApi, target: PiletMetadata): PiletApi;
}

export interface Append {
  /**
   * Appends a custom set of functionality to be used by modules.
   * @param api The API created by the base layer.
   * @param target The target the API is created for.
   * @returns The API to append.
   */
  (api: PiletApi, target: PiletMetadata): Partial<PiletApi>;
}

export interface PiletRequester {
  (): Promise<Array<PiletMetadata>>;
}

export interface PiralContainer {
  context: GlobalStateContext;
  events: EventEmitter;
  extendApi: Extend;
}
