import { History } from 'history';
import { ComponentType, ReactChild } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Atom } from '@dbeining/react-atom';
import { MenuSettings } from './menu';
import { PiletMetadata } from './meta';
import { TilePreferences } from './tile';
import { Dict, Without } from './common';
import { PiralCustomActions, PiralCustomState, PiralCustomComponentsState } from './custom';
import { NotificationOptions } from './notifications';
import { LayoutType, LayoutBreakpoints } from './layout';
import { SharedDataItem, DataStoreTarget } from './data';
import { ErrorInfoProps, DashboardProps, LoaderProps } from './components';
import {
  BaseComponentProps,
  TileComponentProps,
  PageComponentProps,
  ModalComponentProps,
  MenuComponentProps,
  ExtensionComponentProps,
} from './api';

export interface StateDispatcher<TState> {
  (state: TState): Partial<TState>;
}

export type WrappedComponent<TProps> = ComponentType<Without<TProps, keyof BaseComponentProps>>;

export interface OpenNotification {
  id: string;
  content: ReactChild;
  options: NotificationOptions;
  close(): void;
}

export interface OpenModalDialog {
  name: string;
  options: any;
  close(): void;
}

export interface TileRegistration {
  component: WrappedComponent<TileComponentProps>;
  preferences: TilePreferences;
}

export interface PageRegistration {
  component: WrappedComponent<PageComponentProps>;
}

export interface ModalRegistration {
  component: WrappedComponent<ModalComponentProps<any>>;
  defaults: any;
}

export interface MenuItemRegistration {
  component: WrappedComponent<MenuComponentProps>;
  settings: MenuSettings;
}

export interface ExtensionRegistration {
  component: WrappedComponent<ExtensionComponentProps<any>>;
  reference: any;
  defaults: any;
}

export interface GlobalStateOptions extends Partial<AppComponents> {
  /**
   * Sets the available languages.
   * By default, only the default language is used.
   */
  languages?: Array<string>;
  /**
   * Sets the default language.
   * By default, English is used.
   * @default 'en'
   */
  language?: string;
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
   * The home page renderer.
   */
  Dashboard: ComponentType<DashboardProps>;
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
   * Information for the language display.
   */
  language: {
    /**
     * The selected, i.e., active, language.
     */
    selected: string;
    /**
     * The available languages.
     */
    available: Array<string>;
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
   * The currently open notifications.
   */
  notifications: Array<OpenNotification>;
  /**
   * The currently open modal dialogs.
   */
  modals: Array<OpenModalDialog>;
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
   * The registered tile components for a dashboard.
   */
  tiles: Dict<TileRegistration>;
  /**
   * The registered page components for the router.
   */
  pages: Dict<PageRegistration>;
  /**
   * The registered modal dialog components.
   */
  modals: Dict<ModalRegistration>;
  /**
   * The registered menu items for global display.
   */
  menuItems: Dict<MenuItemRegistration>;
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

export interface PiralActions extends PiralCustomActions {
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
   * Changes the selected language.
   * @param selected The selected language.
   */
  selectLanguage(selected: string): void;
  /**
   * Opens the given notification.
   * @param notification The notification to show.
   */
  openNotification(notification: OpenNotification): void;
  /**
   * Closes the given notification.
   * @param notification The notification to hide.
   */
  closeNotification(notification: OpenNotification): void;
  /**
   * Opens the provided dialog.
   * @param dialog The dialog to show.
   */
  openModal(dialog: OpenModalDialog): void;
  /**
   * Closes the provided dialog.
   * @param dialog The dialog to hide.
   */
  closeModal(dialog: OpenModalDialog): void;
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
   * Registers a new tile.
   * @param name The name of the tile.
   * @param value The tile registration.
   */
  registerTile(name: string, value: TileRegistration): void;
  /**
   * Unregisters an existing tile.
   * @param name The name of the tile to be removed.
   */
  unregisterTile(name: string): void;
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
   * Registers a new menu item.
   * @param name The name of the menu item.
   * @param value The menu registration.
   */
  registerMenuItem(name: string, value: MenuItemRegistration): void;
  /**
   * Unregisters an existing menu item.
   * @param name The name of the menu item to be removed.
   */
  unregisterMenuItem(name: string): void;
  /**
   * Registers a new modal dialog.
   * @param name The name of the modal.
   * @param value The modal registration.
   */
  registerModal(name: string, value: ModalRegistration): void;
  /**
   * Unregisters an existing modal dialog.
   * @param name The name of the modal to be removed.
   */
  unregisterModal(name: string): void;
  /**
   * Sets the loading state of the application, which can be helpful for indicating loading of
   * required data.
   * @param loading The current loading state.
   */
  setLoading(loading: boolean): void;
}

export interface GlobalStateContext extends PiralActions {
  /**
   * The global state context atom.
   */
  state: Atom<GlobalState>;
}
