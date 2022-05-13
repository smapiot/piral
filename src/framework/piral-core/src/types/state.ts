import type { ComponentType, ReactPortal } from 'react';
import type { RouteComponentProps } from 'react-router';
import type { Atom } from '@dbeining/react-atom';
import type { LoadPiletsOptions } from 'piral-base';
import type { Dict, Without } from './common';
import type { LayoutType } from './layout';
import type { SharedDataItem, DataStoreTarget } from './data';
import type {
  PiralCustomActions,
  PiralCustomState,
  PiralCustomRegistryState,
  PiralCustomComponentsState,
} from './custom';
import type {
  PiletMetadata,
  EventEmitter,
  Pilet,
  BaseComponentProps,
  PageComponentProps,
  ExtensionComponentProps,
  PiletsBag,
  PiralPageMeta,
} from './api';
import type {
  ComponentConverters,
  LoadingIndicatorProps,
  ErrorInfoProps,
  RouterProps,
  LayoutProps,
  Errors,
  RouteSwitchProps,
} from './components';

export interface StateDispatcher<TState> {
  (state: TState): Partial<TState>;
}

declare module './components' {
  interface ComponentContext {
    state: Atom<GlobalState>;
    readState: PiralActions['readState'];
  }
}

export type WrappedComponent<TProps> = ComponentType<Without<TProps, keyof BaseComponentProps>>;

/**
 * The base type for pilet component registration in the global state context.
 */
export interface BaseRegistration {
  /**
   * The pilet registering the component.
   */
  pilet: string;
}

/**
 * The interface modeling the registration of a pilet page component.
 */
export interface PageRegistration extends BaseRegistration {
  /**
   * The registered page component.
   */
  component: WrappedComponent<PageComponentProps>;
  /**
   * The page's associated metadata.
   */
  meta: PiralPageMeta;
}

/**
 * The interface modeling the registration of a pilet extension component.
 */
export interface ExtensionRegistration extends BaseRegistration {
  /**
   * The wrapped registered extension component.
   */
  component: WrappedComponent<ExtensionComponentProps<string>>;
  /**
   * The original extension component that has been registered.
   */
  reference: any;
  /**
   * The default params (i.e., meta) of the extension.
   */
  defaults: any;
}

/**
 * The Piral global app sub-state container for shared components.
 */
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
  /**
   * The route switch used for determining the route registration.
   */
  RouteSwitch: ComponentType<RouteSwitchProps>;
  /**
   * A component that can be used for debugging purposes.
   */
  Debug?: ComponentType;
}

/**
 * The Piral global app sub-state container for app information.
 */
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
  /**
   * Gets the public path of the application.
   */
  publicPath: string;
}

/**
 * The Piral global app sub-state container for component registrations.
 */
export interface RegistryState extends PiralCustomRegistryState {
  /**
   * The registered page components for the router.
   */
  pages: Dict<PageRegistration>;
  /**
   * The registered extension components for extension slots.
   */
  extensions: Dict<Array<ExtensionRegistration>>;
  /**
   * The registered wrappers for any component.
   */
  wrappers: Dict<ComponentType<any>>;
}

export type ErrorComponentsState = {
  [P in keyof Errors]?: ComponentType<Errors[P]>;
};

/**
 * The Piral global app state container.
 */
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
  provider?: ComponentType;
}

/**
 * The shape of an app action in Piral.
 */
export interface PiralAction<T extends (...args: any) => any> {
  (ctx: GlobalStateContext, ...args: Parameters<T>): ReturnType<T>;
}

/**
 * A subset of the available app actions in Piral.
 */
export type PiralDefineActions = Partial<{ [P in keyof PiralActions]: PiralAction<PiralActions[P]> }>;

/**
 * The globally defined actions.
 */
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
  defineActions(actions: PiralDefineActions): void;
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
  /**
   * Hides the provided portal in the rendering pipeline.
   * @param id The id of the portal to use.
   * @param entry The child to remove.
   */
  hidePortal(id: string, entry: ReactPortal): void;
  /**
   * Updates the provided portal in the rendering pipeline.
   * @param id The id of the portal to use.
   * @param current The currently displayed child.
   * @param next The updated child that should be displayed.
   */
  updatePortal(id: string, current: ReactPortal, next: ReactPortal): void;
  /**
   * Dispatches a state change.
   * @param update The update function creating a new state.
   */
  dispatch(update: (state: GlobalState) => GlobalState): void;
  /**
   * Reads the selected part of the global state.
   * @param select The selector for getting the desired part.
   * @returns The desired part.
   */
  readState<S>(select: (state: GlobalState) => S): S;
}

/**
 * The Piral app instance context.
 */
export interface GlobalStateContext extends PiralActions, EventEmitter {
  /**
   * The global state context atom.
   * Changes to the state should always be dispatched via the `dispatch` action.
   */
  state: Atom<GlobalState>;
  /**
   * The API objects created for the loaded pilets.
   */
  apis: PiletsBag;
  /**
   * The available component converters.
   */
  converters: ComponentConverters<any>;
  /**
   * The initial options.
   */
  options: LoadPiletsOptions;
}
