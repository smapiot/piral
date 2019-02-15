import { ComponentType, ReactChild } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Atom } from '@dbeining/react-atom';
import { LayoutType, LayoutBreakpoints } from './layout';
import { UserInfo, UserFeatures, UserPermissions } from './user';
import { ConnectorDetails } from './feed';
import { TilePreferences } from './tile';
import { MenuSettings } from './menu';
import { SharedDataItem, DataStoreTarget } from './data';
import { NotificationOptions } from './notifications';
import { Dict, Without, LocalizationMessages } from './utils';
import {
  TileComponentProps,
  BaseComponentProps,
  ExtensionComponentProps,
  MenuComponentProps,
  ModalComponentProps,
  PageComponentProps,
  ErrorInfoProps,
  DashboardProps,
  LoaderProps,
} from './components';

export type WrappedComponent<TProps> = ComponentType<Without<TProps, keyof BaseComponentProps<{}>>>;

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
  component: WrappedComponent<TileComponentProps<any>>;
  preferences: TilePreferences;
}

export interface PageRegistration {
  component: WrappedComponent<PageComponentProps<any>>;
}

export interface ModalRegistration {
  component: WrappedComponent<ModalComponentProps<any, any>>;
}

export interface MenuRegistration {
  component: WrappedComponent<MenuComponentProps<any>>;
  settings: MenuSettings;
}

export interface ExtensionRegistration {
  component: WrappedComponent<ExtensionComponentProps<any>>;
  reference: any;
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
    /**
     * The global translations.
     */
    translations: LocalizationMessages;
  };
  /**
   * Components relevant for rendering parts of the app.
   */
  components: {
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
  };
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
   * The used application routes.
   */
  routes: Dict<ComponentType<RouteComponentProps>>;
}

export interface ComponentsState {
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
  menuItems: Dict<MenuRegistration>;
  /**
   * The registered extension components for extension slots.
   */
  extensions: Dict<Array<ExtensionRegistration>>;
}

export interface FeedsState {
  [id: string]: {
    /**
     * Determines if the feed is currently loading.
     */
    loading: boolean;
    /**
     * Indicates if the feed was already loaded and is active.
     */
    loaded: boolean;
    /**
     * Stores the potential error when initializing or loading the feed.
     */
    error: any;
    /**
     * The currently stored feed data.
     */
    data: any;
  };
}

export interface UserState {
  /**
   * The provided features, if any.
   */
  features: UserFeatures;
  /**
   * The given permissions, if any.
   */
  permissions: UserPermissions;
  /**
   * The current user, if available.
   */
  current: UserInfo | undefined;
}

export interface GlobalState {
  /**
   * The relevant state for the app itself.
   */
  app: AppState;
  /**
   * The relevant state for the registered components.
   */
  components: ComponentsState;
  /**
   * The relevant state for the registered feeds.
   */
  feeds: FeedsState;
  /**
   * The relevant state for the current user.
   */
  user: UserState;
}

export interface StateActions {
  readDataValue(name: string): any;
  tryWriteDataItem(name: string, value: any, owner: string, target: DataStoreTarget, expiration: number): boolean;
  changeLayout(current: LayoutType): void;
  selectLanguage(selected: string): void;
  addLanguage(language: string): void;
  removeLanguage(language: string): void;
  createFeed(id: string): void;
  loadFeed<TData, TItem>(feed: ConnectorDetails<TData, TItem>): void;
  openNotification(notification: OpenNotification): void;
  closeNotification(notification: OpenNotification): void;
  openModal(dialog: OpenModalDialog): void;
  closeModal(dialog: OpenModalDialog): void;
  registerPage(route: string, value: PageRegistration): void;
  unregisterPage(route: string): void;
  registerTile(name: string, value: TileRegistration): void;
  unregisterTile(name: string): void;
  registerExtension(name: string, value: ExtensionRegistration): void;
  unregisterExtension(name: string, reference: any): void;
  registerMenuItem(name: string, value: MenuRegistration): void;
  unregisterMenuItem(name: string): void;
  registerModal(name: string, value: ModalRegistration): void;
  unregisterModal(name: string): void;
}

export interface GlobalStateContext extends StateActions {
  state: Atom<GlobalState>;
}
