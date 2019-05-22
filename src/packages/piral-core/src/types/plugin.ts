import { ArbiterModule, ArbiterModuleMetadata, DependencyGetter } from 'react-arbiter';
import { PiralApi, PiralCoreApi } from './api';
import { EventEmitter } from './utils';
import { GlobalStateContext } from './state';

export interface Extend<TApi> {
  /**
   * Extends the base API with a custom set of functionality to be used by modules.
   * @param api The API created by the base layer.
   * @param target The target the API is created for.
   * @returns The extended API.
   */
  (api: PiralCoreApi<TApi>, target: ArbiterModuleMetadata): PiralApi<TApi>;
}

export interface ModuleRequester {
  (): Promise<Array<ArbiterModuleMetadata>>;
}

export interface PiralContainer<TApi> {
  context: GlobalStateContext;
  events: EventEmitter;
  getDependencies: DependencyGetter;
  requestModules: ModuleRequester;
  availableModules: Array<ArbiterModule<PiralApi<TApi>>>;
  extendApi: Extend<TApi>;
}

export interface ScaffoldPlugin {
  <TApi>(container: PiralContainer<TApi>): PiralContainer<TApi>;
}
