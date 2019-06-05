import { ComponentType, ReactChild } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Atom } from '@dbeining/react-atom';
import { LayoutType, LayoutBreakpoints } from './layout';
import { UserInfo, UserFeatures, UserPermissions } from './user';
import { ConnectorDetails } from './feed';
import { TilePreferences } from './tile';
import { MenuSettings } from './menu';
import { SearchHandler } from './search';
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

export interface MenuItemRegistration {
  component: WrappedComponent<MenuComponentProps<any>>;
  settings: MenuSettings;
}

export interface ExtensionRegistration {
  component: WrappedComponent<ExtensionComponentProps<any>>;
  reference: any;
}

export interface SearchProviderRegistration {
  search: SearchHandler;
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
    /**
     * A collection of custom components.
     */
    custom: Record<string, ComponentType<any>>;
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
   * The used (exact) application routes.
   */
  routes: Dict<ComponentType<RouteComponentProps>>;
  /**
   * The used application trackers.
   */
  trackers: Array<ComponentType<RouteComponentProps>>;
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
  menuItems: Dict<MenuItemRegistration>;
  /**
   * The registered extension components for extension slots.
   */
  extensions: Dict<Array<ExtensionRegistration>>;
  /**
   * The registered search providers for context aware search.
   */
  searchProviders: Dict<SearchProviderRegistration>;
}

export interface FeedDataState {
  /**
   * Determines if the feed data is currently loading.
   */
  loading: boolean;
  /**
   * Indicates if the feed data was already loaded and is active.
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
}

export interface FeedsState {
  /**
   * Gets the state of the available data feeds.
   */
  [id: string]: FeedDataState;
}

export interface FormDataState {
  /**
   * Gets the usage status of the form - true means
   * the form is actively being used, false is the
   * status for forms that are not used any more.
   */
  active: boolean;
  /**
   * Indicates that the form is currently submitting.
   */
  submitting: boolean;
  /**
   * Stores the potential error of the form.
   */
  error: any;
  /**
   * The initial data to use.
   */
  initialData: any;
  /**
   * The current data that has been submitted.
   */
  currentData: any;
  /**
   * Gets or sets if th current data is different from
   * the initial data.
   */
  changed: boolean;
}

export interface FormsState {
  /**
   * Gets the state of forms that are currently not actively used.
   */
  [id: string]: FormDataState;
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

export interface SearchState {
  /**
   * Gets the current input value.
   */
  input: string;
  /**
   * Gets weather the search is still loading.
   */
  loading: boolean;
  /**
   * The results to display for the current search.
   */
  results: Array<ReactChild>;
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
   * The relevant state for the active forms.
   */
  forms: FormsState;
  /**
   * The relevant state for the current user.
   */
  user: UserState;
  /**
   * The relevant state for the in-site search.
   */
  search: SearchState;
}

export interface StateActions {
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
   * Adds another language to the available languages.
   * @param language The language to add.
   */
  addLanguage(language: string): void;
  /**
   * Remnoves an existing language from the available languages.
   * @param language The language to remove.
   */
  removeLanguage(language: string): void;
  /**
   * Creates a new (empty) feed.
   * @param id The id of the feed.
   */
  createFeed(id: string): void;
  /**
   * Destroys an existing feed.
   * @param id The id of the feed.
   */
  destroyFeed(id: string): void;
  /**
   * Loads the feed via the provided details.
   * @param feed The feed details to use for loading.
   */
  loadFeed<TData, TItem>(feed: ConnectorDetails<TData, TItem>): void;
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
   * Registers a new search provider.
   * @param name The name of the search provider.
   * @param value The value representing the provider.
   */
  registerSearchProvider(name: string, value: SearchProviderRegistration): void;
  /**
   * Unregisters an existing search provider.
   * @param name The name of the search provider.
   */
  unregisterSearchProvider(name: string): void;
  /**
   * Sets the current search input.
   * @param input The input to set.
   */
  setSearchInput(input: string): void;
  /**
   * Sets the form data from the provided original state and patch data.
   * @param id The id of the form.
   * @param original The initial state of the form.
   * @param patch The provided patch.
   */
  updateFormState(id: string, original: FormDataState, patch: Partial<FormDataState>): void;
  /**
   * Resets the search results.
   * @param loading Determines if further results are currently loading.
   */
  resetSearchResults(loading: boolean): void;
  /**
   * Appends more results to the existing results.
   * @param items The items to append.
   * @param done Determines if more results are pending.
   */
  appendSearchResults(items: Array<ReactChild>, done: boolean): void;
  /**
   * Prepends more results to the existing results.
   * @param items The items to prepend.
   * @param done Determines if more results are pending.
   */
  prependSearchResults(items: Array<ReactChild>, done: boolean): void;
}

export interface GlobalStateContext extends StateActions {
  /**
   * The global state context atom.
   */
  state: Atom<GlobalState>;
}
