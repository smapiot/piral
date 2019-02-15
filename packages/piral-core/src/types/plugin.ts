import { ArbiterModule, ArbiterModuleMetadata, DependencyGetter } from 'react-arbiter';
import { PortalApi, PortalBaseApi } from './api';
import { EventEmitter } from './utils';
import { GlobalStateContext } from './state';

export interface Extend<TApi> {
  /**
   * Extends the base API with a custom set of functionality to be used by modules.
   * @param api The API created by the base layer.
   * @param target The target the API is created for.
   * @returns The extended API.
   */
  (api: PortalBaseApi<TApi>, target: ArbiterModuleMetadata): PortalApi<TApi>;
}

export interface ModuleRequester {
  (): Promise<Array<ArbiterModuleMetadata>>;
}

export interface PortalContainer<TApi> {
  context: GlobalStateContext;
  events: EventEmitter;
  getDependencies: DependencyGetter;
  requestModules: ModuleRequester;
  availableModules: Array<ArbiterModule<PortalApi<TApi>>>;
  extendApi: Extend<TApi>;
}

export interface ScaffoldPlugin {
  <TApi>(container: PortalContainer<TApi>): PortalContainer<TApi>;
}
