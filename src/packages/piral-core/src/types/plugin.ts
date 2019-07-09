import { ArbiterModuleMetadata } from 'react-arbiter';
import { PiralApi, PiralCoreApi } from './api';
import { EventEmitter } from './utils';
import { GlobalStateContext, GlobalState } from './state';

export interface Setup<TState extends GlobalState, TUser = {}> {
  /**
   * Initializes the given global state, potentially extending it.
   * @param state The global state created by the base layer.
   * @returns The initialized state.
   */
  (state: GlobalState<TUser>): TState;
}

export interface Extend<TSource, TTarget> {
  /**
   * Extends the base API with a custom set of functionality to be used by modules.
   * @param api The API created by the base layer.
   * @param target The target the API is created for.
   * @returns The extended API.
   */
  (api: TSource, target: ArbiterModuleMetadata): TTarget;
}

export interface PiletRequester {
  (): Promise<Array<ArbiterModuleMetadata>>;
}

export interface PiralContainer<TApi> {
  context: GlobalStateContext;
  events: EventEmitter;
  extendApi: Extend<PiralCoreApi<TApi>, PiralApi<TApi>>;
}
