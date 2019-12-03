import { ComponentType, ReactPortal } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Atom } from '@dbeining/react-atom';
import { PiletMetadata } from './meta';
import { EventEmitter } from './utils';
import { Dict, Without } from './common';
import { LayoutType } from './layout';
import { SharedDataItem, DataStoreTarget } from './data';
import {
  ComponentConverters,
  LoadingIndicatorProps,
  ErrorInfoProps,
  RouterProps,
  LayoutProps,
  Errors,
} from './components';
import { PiralCustomActions, PiralCustomState, PiralCustomRegistryState, PiralCustomComponentsState } from './custom';
import { BaseComponentProps, PageComponentProps, ExtensionComponentProps, PiletsBag, Pilet } from './api';

export interface StateDispatcher<TState> {
  (state: TState): Partial<TState>;
}

export type WrappedComponent<TProps> = ComponentType<Without<TProps, keyof BaseComponentProps>>;

export interface BaseRegistration {
  pilet: string;
}

export interface PageRegistration extends BaseRegistration {
  component: WrappedComponent<PageComponentProps>;
}

export interface ExtensionRegistration extends BaseRegistration {
  component: WrappedComponent<ExtensionComponentProps<any>>;
  reference: any;
  defaults: any;
}

export interface ComponentsState extends PiralCustomComponentsState {
  /**
   * The loading indicator renderer.
   */
  LoadingIndicator: ComponentType<LoadingIndicatorProps>;
  /**
   * The error renderer.
   */
  ErrorInfo: ComponentType<ErrorInfoProps>;
  /**
   * The router context.
   */
  Router: ComponentType<RouterProps>;
  /**
   * The layout used for pages.
   */
  Layout: ComponentType<LayoutProps>;
}

export interface AppState {
  /**
   * Information for the layout computation.
   */
  layout: LayoutType;
  /**
   * Gets if the application is currently performing a background loading
   * activity, e.g., for loading modules asynchronously or fetching
   * translations.
   */
  loading: boolean;
  /**
   * Gets an unrecoverable application error, if any.
   */
  error: Error | undefined;
}

export interface RegistryState extends PiralCustomRegistryState {
  /**
   * The registered page components for the router.
   */
  pages: Dict<PageRegistration>;
  /**
   * The registered extension components for extension slots.
   */
  extensions: Dict<Array<ExtensionRegistration>>;
}

export type ErrorComponentsState = {
  [P in keyof Errors]?: ComponentType<Errors[P]>;
};

export interface GlobalState extends PiralCustomState {
  /**
   * The relevant state for the app itself.
   */
  app: AppState;
  /**
   * The relevant state for rendering errors of the app.
   */
  errorComponents: ErrorComponentsState;
  /**
   * The relevant state for rendering parts of the app.
   */
  components: ComponentsState;
  /**
   * The relevant state for the registered components.
   */
  registry: RegistryState;
  /**
   * Gets the loaded modules.
   */
  modules: Array<PiletMetadata>;
  /**
   * The foreign component portals to render.
   */
  portals: Record<string, Array<ReactPortal>>;
  /**
   * The application's shared data.
   */
  data: Dict<SharedDataItem>;
  /**
   * The used (exact) application routes.
   */
  routes: Dict<ComponentType<RouteComponentProps<any>>>;
  /**
   * The current provider.
   */
  provider?: JSX.Element;
}

export interface PiralAction<T extends (...args: any) => any> {
  (this: GlobalStateContext, ctx: Atom<GlobalState>, ...args: Parameters<T>): ReturnType<T>;
}

export interface PiralActions extends PiralCustomActions {
  /**
   * Initializes the application shell.
   * @param loading The current loading state.
   * @param error The application error, if any.
   * @param modules The loaded pilets.
   */
  initialize(loading: boolean, error: Error | undefined, modules: Array<Pilet>): void;
  /**
   * Injects a pilet at runtime - removes the pilet from registry first if available.
   * @param pilet The pilet to be injected.
   */
  injectPilet(pilet: Pilet): void;
  /**
   * Defines a single action for Piral.
   * @param actionName The name of the action to define.
   * @param action The action to include.
   */
  defineAction<T extends keyof PiralActions>(actionName: T, action: PiralAction<PiralActions[T]>): void;
  /**
   * Defines a set of actions for Piral.
   * @param actions The actions to define.
   */
  defineActions(actions: Partial<{ [P in keyof PiralActions]: PiralAction<PiralActions[P]> }>): void;
  /**
   * Reads the value of a shared data item.
   * @param name The name of the shared item.
   */
  readDataValue(name: string): any;
  /**
   * Tries to write a shared data item. The write access is only
   * possible if the name belongs to the provided owner or has not
   * been taken yet.
   * Setting the value to null will release it.
   * @param name The name of the shared data item.
   * @param value The value of the shared data item.
   * @param owner The owner of the shared data item.
   * @param target The target storage locatation.
   * @param expiration The time for when to dispose the shared item.
   */
  tryWriteDataItem(name: string, value: any, owner: string, target: DataStoreTarget, expiration: number): boolean;
  /**
   * Performs a layout change.
   * @param current The layout to take.
   */
  changeLayout(current: LayoutType): void;
  /**
   * Registers a new route to be resolved.
   * @param route The route to register.
   * @param value The page to be rendered on the route.
   */
  registerPage(route: string, value: PageRegistration): void;
  /**
   * Unregisters an existing route.
   * @param route The route to be removed.
   */
  unregisterPage(route: string): void;
  /**
   * Registers a new extension.
   * @param name The name of the extension category.
   * @param value The extension registration.
   */
  registerExtension(name: string, value: ExtensionRegistration): void;
  /**
   * Unregisters an existing extension.
   * @param name The name of the extension category.
   * @param value The extension that will be removed.
   */
  unregisterExtension(name: string, reference: any): void;
  /**
   * Sets the common component to render.
   * @param name The name of the component.
   * @param component The component to use for rendering.
   */
  setComponent<TKey extends keyof ComponentsState>(name: TKey, component: ComponentsState[TKey]): void;
  /**
   * Sets the error component to render.
   * @param type The type of the error.
   * @param component The component to use for rendering.
   */
  setErrorComponent<TKey extends keyof ErrorComponentsState>(type: TKey, component: ErrorComponentsState[TKey]): void;
  /**
   * Sets the common routes to render.
   * @param path The name of the component.
   * @param component The component to use for rendering.
   */
  setRoute<T = {}>(path: string, component: ComponentType<RouteComponentProps<T>>): void;
  /**
   * Includes a new provider as a sub-provider to the current provider.
   * @param provider The provider to include.
   */
  includeProvider(provider: JSX.Element): void;
  /**
   * Destroys (i.e., resets) the given portal instance.
   * @param id The id of the portal to destroy.
   */
  destroyPortal(id: string): void;
  /**
   * Includes the provided portal in the rendering pipeline.
   * @param id The id of the portal to use.
   * @param entry The child to render.
   */
  showPortal(id: string, entry: ReactPortal): void;
}

export interface GlobalStateContext extends PiralActions, EventEmitter {
  /**
   * The global state context atom.
   */
  state: Atom<GlobalState>;
  /**
   * The available APIs.
   */
  apis: PiletsBag;
  /**
   * The available component converters.
   */
  converters: ComponentConverters<any>;
}
