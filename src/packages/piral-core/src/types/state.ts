import { History } from 'history';
import { ComponentType } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Atom } from '@dbeining/react-atom';
import { PiletMetadata } from './meta';
import { EventEmitter } from './utils';
import { Dict, Without } from './common';
import { LayoutType, LayoutBreakpoints } from './layout';
import { SharedDataItem, DataStoreTarget } from './data';
import { ErrorInfoProps, LoaderProps, ComponentConverters } from './components';
import { PiralCustomActions, PiralCustomState, PiralCustomComponentsState } from './custom';
import { BaseComponentProps, PageComponentProps, ExtensionComponentProps, PiletsBag } from './api';

export interface StateDispatcher<TState> {
  (state: TState): Partial<TState>;
}

export type WrappedComponent<TProps> = ComponentType<Without<TProps, keyof BaseComponentProps>>;

export interface PageRegistration {
  component: WrappedComponent<PageComponentProps>;
}

export interface ExtensionRegistration {
  component: WrappedComponent<ExtensionComponentProps<any>>;
  reference: any;
  defaults: any;
}

export interface GlobalStateOptions extends Partial<AppComponents> {
  /**
   * Sets the additional / initial routes to register.
   */
  routes?: Record<string, ComponentType<RouteComponentProps>>;
  /**
   * Sets the available trackers to register.
   */
  trackers?: Array<ComponentType<RouteComponentProps>>;
  /**
   * Sets the available layout breakpoints.
   */
  breakpoints?: LayoutBreakpoints;
  /**
   * Sets the history to use for the router.
   */
  history?: History;
}

export interface AppComponents {
  /**
   * The progress indicator renderer.
   */
  Loader: ComponentType<LoaderProps>;
  /**
   * The error renderer.
   */
  ErrorInfo: ComponentType<ErrorInfoProps>;
  /**
   * The history management instance.
   */
  history: History;
}

export interface AppState {
  /**
   * Information for the layout computation.
   */
  layout: {
    /**
     * The currently active layout.
     */
    current: LayoutType;
    /**
     * The different layout breakpoints.
     */
    breakpoints: LayoutBreakpoints;
  };
  /**
   * Gets if the application is currently performing a background loading
   * activity, e.g., for loading modules asynchronously or fetching
   * translations.
   */
  loading: boolean;
  /**
   * Components relevant for rendering parts of the app.
   */
  components: AppComponents;
  /**
   * The application's shared data.
   */
  data: Dict<SharedDataItem>;
  /**
   * The used (exact) application routes.
   */
  routes: Dict<ComponentType<RouteComponentProps>>;
  /**
   * The used application trackers.
   */
  trackers: Array<ComponentType<RouteComponentProps>>;
}

export interface ComponentsState extends PiralCustomComponentsState {
  /**
   * The registered page components for the router.
   */
  pages: Dict<PageRegistration>;
  /**
   * The registered extension components for extension slots.
   */
  extensions: Dict<Array<ExtensionRegistration>>;
}

export interface GlobalState extends PiralCustomState {
  /**
   * The relevant state for the app itself.
   */
  app: AppState;
  /**
   * The relevant state for the registered components.
   */
  components: ComponentsState;
  /**
   * Gets the loaded modules.
   */
  modules: Array<PiletMetadata>;
}

export interface PiralAction<T extends (...args: any) => any> {
  (this: GlobalStateContext, ctx: Atom<GlobalState>, ...args: Parameters<T>): ReturnType<T>;
}

export interface PiralActions extends PiralCustomActions {
  /**
   * Defines a single action for Piral.
   * @param actionName The name of the action to define.
   * @param action The action to include.
   */
  withAction<T extends keyof PiralActions>(actionName: T, action: PiralAction<PiralActions[T]>): void;
  /**
   * Defines a set of actions for Piral.
   * @param actions The actions to define.
   */
  withActions(actions: Partial<{ [P in keyof PiralActions]: PiralAction<PiralActions[P]> }>): void;
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
   * Sets the loading state of the application, which can be helpful for indicating loading of
   * required data.
   * @param loading The current loading state.
   */
  setLoading(loading: boolean): void;
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
