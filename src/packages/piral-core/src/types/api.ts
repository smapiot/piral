import { ReactNode, ComponentType } from 'react';
import { MenuSettings } from './menu';
import { TilePreferences } from './tile';
import { NotificationOptions } from './notifications';
import { SharedData, DataStoreOptions } from './data';
import { ContainerOptions, ContainerConnector } from './container';
import { FeedResolver, FeedConnector, FeedConnectorOptions } from './feed';
import { InputFormOptions, FormCreator } from './form';
import { Disposable, EventEmitter } from './utils';
import { SearchProvider, SearchSettings } from './search';
import {
  ForeignComponent,
  ModalComponentProps,
  PageComponentProps,
  TileComponentProps,
  ExtensionComponentProps,
  AnyComponent,
  MenuComponentProps,
} from './components';

/**
 * Defines the metadata used to describe a pilet.
 */
export interface PiletMetadata {
  /**
   * The name of the pilet.
   */
  name: string;
  /**
   * The version of the pilet.
   */
  version: string;
  /**
   * The dependencies of the pilet.
   */
  dependencies: Record<string, string>;
  /**
   * The hashcode of the pilet.
   */
  hash: string;
  /**
   * The link to the root module of the pilet.
   */
  link: string;
}

/**
 * Alias for an extensible Pilet API given from piral-core.
 */
export type PiralApi<TExtraApi = {}> = PiralCoreApi<TExtraApi> & TExtraApi;

/**
 * Defines the Pilet API from piral-core.
 */
export interface PiralCoreApi<TExtraApi> extends EventEmitter {
  /**
   * Gets the metadata of the current pilet.
   */
  meta: PiletMetadata;
  /**
   * Creates a connector for wrapping components with data relations.
   * @param resolver The resolver for the initial data set.
   */
  createConnector<T>(resolver: FeedResolver<T>): FeedConnector<T>;
  /**
   * Creates a connector for wrapping components with data relations.
   * @param options The options for creating the connector.
   */
  createConnector<TData, TItem>(options: FeedConnectorOptions<TData, TItem>): FeedConnector<TData>;
  /**
   * Creates a state container for persisting some global state.
   * @param options The options for creating the state container.
   */
  createContainer<TState, TAction>(options: ContainerOptions<TState, TAction>): ContainerConnector<TState, TAction>;
  /**
   * Creates an input form for tracking user input intelligently.
   * @param options The options for creating the form.
   */
  createForm<TFormData, TProps = any>(options: InputFormOptions<TFormData, TProps>): FormCreator<TFormData, TProps>;
  /**
   * Gets a shared data value.
   * @param name The name of the data to retrieve.
   */
  getData<TKey extends string>(name: TKey): SharedData[TKey];
  /**
   * Sets the data using a given name. The name needs to be used exclusively by the current pilet.
   * Using the name occupied by another pilet will result in no change.
   * @param name The name of the data to store.
   * @param value The value of the data to store.
   * @param options The optional configuration for storing this piece of data.
   * @returns True if the data could be set, otherwise false.
   */
  setData<TKey extends string>(name: TKey, value: SharedData[TKey], options?: DataStoreOptions): boolean;
  /**
   * Shows a notification in the determined spot using the provided content.
   * @param content The content to display. Normally, a string would be sufficient.
   * @param options The options to consider for showing the notification.
   * @returns A callback to trigger closing the notification.
   */
  showNotification(content: ReactNode | HTMLElement, options?: NotificationOptions): Disposable;
  /**
   * Shows a modal dialog with the given name.
   * The modal can be optionally programmatically closed using the returned callback.
   * @param name The name of the registered modal.
   * @param options Optional arguments for creating the modal.
   * @returns A callback to trigger closing the modal.
   */
  showModal<TOpts = any>(name: string, options?: TOpts): Disposable;
  /**
   * Registers a modal dialog using a generic rendering function.
   * The name needs to be unique to be used without the pilet's name.
   * @param name The name of the modal to register.
   * @param render The function that is being called once rendering begins.
   * @param defaults Optionally, sets the default values for the inserted options.
   */
  registerModalX<TOpts>(
    name: string,
    render: ForeignComponent<ModalComponentProps<PiralApi<TExtraApi>, TOpts>>,
    defaults?: TOpts,
  ): void;
  /**
   * Registers a modal dialog using a React component.
   * The name needs to be unique to be used without the pilet's name.
   * @param name The name of the modal to register.
   * @param Component The component to render the page.
   * @param defaults Optionally, sets the default values for the inserted options.
   */
  registerModal<TOpts>(
    name: string,
    Component: ComponentType<ModalComponentProps<PiralApi<TExtraApi>, TOpts>>,
    defaults?: TOpts,
  ): void;
  /**
   * Unregisters a modal by its name.
   * @param name The name that was previously registered.
   */
  unregisterModal(name: string): void;
  /**
   * Registers a route for general component.
   * The route needs to be unique and can contain params.
   * Params are following the path-to-regexp notation, e.g., :id for an id parameter.
   * @param route The route to register.
   * @param render The function that is being called once rendering begins.
   */
  registerPageX(route: string, render: ForeignComponent<PageComponentProps<PiralApi<TExtraApi>>>): void;
  /**
   * Registers a route for React component.
   * The route needs to be unique and can contain params.
   * Params are following the path-to-regexp notation, e.g., :id for an id parameter.
   * @param route The route to register.
   * @param Component The component to render the page.
   */
  registerPage(route: string, Component: ComponentType<PageComponentProps<PiralApi<TExtraApi>>>): void;
  /**
   * Unregisters the page identified by the given route.
   * @param route The route that was previously registered.
   */
  unregisterPage(route: string): void;
  /**
   * Registers a tile for general components.
   * The name has to be unique within the current pilet.
   * @param name The name of the tile.
   * @param render The function that is being called once rendering begins.
   * @param preferences The optional preferences to be supplied to the Dashboard for the tile.
   */
  registerTileX(
    name: string,
    render: ForeignComponent<TileComponentProps<PiralApi<TExtraApi>>>,
    preferences?: TilePreferences,
  ): void;
  /**
   * Registers a tile for React components.
   * The name has to be unique within the current pilet.
   * @param name The name of the tile.
   * @param Component The component to be rendered within the Dashboard.
   * @param preferences The optional preferences to be supplied to the Dashboard for the tile.
   */
  registerTile(
    name: string,
    Component: ComponentType<TileComponentProps<PiralApi<TExtraApi>>>,
    preferences?: TilePreferences,
  ): void;
  /**
   * Unregisters a tile known by the given name.
   * Only previously registered tiles can be unregistered.
   * @param name The name of the tile to unregister.
   */
  unregisterTile(name: string): void;
  /**
   * Registers an extension component with a general components.
   * The name must refer to the extension slot.
   * @param name The global name of the extension slot.
   * @param render The function that is being called once rendering begins.
   * @param defaults Optionally, sets the default values for the expected data.
   */
  registerExtensionX<T>(
    name: string,
    render: ForeignComponent<ExtensionComponentProps<PiralApi<TExtraApi>, T>>,
    defaults?: T,
  ): void;
  /**
   * Registers an extension component with a React component.
   * The name must refer to the extension slot.
   * @param name The global name of the extension slot.
   * @param Component The component to be rendered.
   * @param defaults Optionally, sets the default values for the expected data.
   */
  registerExtension<T>(
    name: string,
    Component: ComponentType<ExtensionComponentProps<PiralApi<TExtraApi>, T>>,
    defaults?: T,
  ): void;
  /**
   * Unregisters a global extension component.
   * Only previously registered extension components can be unregistered.
   * @param name The name of the extension slot to unregister from.
   * @param hook The registered extension component to unregister.
   */
  unregisterExtension<T>(name: string, hook: AnyComponent<ExtensionComponentProps<PiralApi<TExtraApi>, T>>): void;
  /**
   * Registers a menu item for general components.
   * The name has to be unique within the current pilet.
   * @param name The name of the menu item.
   * @param render The function that is being called once rendering begins.
   * @param settings The optional configuration for the menu item.
   */
  registerMenuX(
    name: string,
    render: ForeignComponent<MenuComponentProps<PiralApi<TExtraApi>>>,
    settings?: MenuSettings,
  ): void;
  /**
   * Registers a menu item for React components.
   * The name has to be unique within the current pilet.
   * @param name The name of the menu item.
   * @param Component The component to be rendered within the menu.
   * @param settings The optional configuration for the menu item.
   */
  registerMenu(
    name: string,
    Component: ComponentType<MenuComponentProps<PiralApi<TExtraApi>>>,
    settings?: MenuSettings,
  ): void;
  /**
   * Unregisters a menu item known by the given name.
   * Only previously registered menu items can be unregistered.
   * @param name The name of the menu item to unregister.
   */
  unregisterMenu(name: string): void;
  /**
   * Registers a search provider to respond to search queries.
   * The name has to be unique within the current pilet.
   * @param name The name of the search provider.
   * @param provider The callback to be used for searching.
   * @param settings The optional settings for the search provider.
   */
  registerSearchProvider(name: string, provider: SearchProvider<PiralApi<TExtraApi>>, settings?: SearchSettings): void;
  /**
   * Unregisters a search provider known by the given name.
   * Only previously registered search providers can be unregistered.
   * @param name The name of the search provider to unregister.
   */
  unregisterSearchProvider(name: string): void;
}
