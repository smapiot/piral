import { ReactNode, ComponentType } from 'react';
import { MenuSettings } from './menu';
import { TilePreferences } from './tile';
import { NotificationOptions } from './notifications';
import { SharedData, DataStoreOptions } from './data';
import { FeedResolver, FeedConnector, FeedConnectorOptions } from './feed';
import { InputFormOptions, FormCreator } from './form';
import { Dict, LocalizationMessages, Disposable, SeverityLevel, EventEmitter } from './utils';
import { SearchProvider } from './search';
import {
  ForeignComponent,
  ModalComponentProps,
  PageComponentProps,
  TileComponentProps,
  ExtensionComponentProps,
  AnyComponent,
  MenuComponentProps,
} from './components';

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
  dependencies: Dict<string>;
  /**
   * The hashcode of the pilet.
   */
  hash: string;
}

export interface Tracker {
  /**
   * Finishes the created frame by optionally passing the given properties and measurements.
   */
  (properties?: any, measurements?: any): void;
}

export type PiralApi<TExtraApi = {}> = PiralCoreApi<TExtraApi> & TExtraApi;

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
   */
  setData<TKey extends string>(name: TKey, value: SharedData[TKey], options?: DataStoreOptions): void;
  /**
   * Tracks a simple (singular) event at the current point in time.
   * @param name The name of the event to track.
   * @param properties The optional tracking properties to submit.
   * @param measurements The optional tracking measurements to submit.
   */
  trackEvent(name: string, properties?: any, measurements?: any): void;
  /**
   * Tracks an exception event at the current point in time.
   * @param exception The Error from a catch clause, or the string error message.
   * @param properties The optional tracking properties to submit.
   * @param measurements The optional tracking measurements to submit.
   * @param severityLevel The optional severity level of error.
   */
  trackError(error: Error | string, properties?: any, measurements?: any, severityLevel?: SeverityLevel): void;
  /**
   * Starts tracking an event frame at the current point in time.
   * @param name The name of the event to start tracking.
   * @returns The method to use for ending the current event frame.
   */
  trackFrame(name: string): Tracker;
  /**
   * Translates the given tag (using the optional variables) into a string using the current language.
   * The used template can contain placeholders in form of `{{variableName}}`.
   * @param tag The tag to translate.
   * @param variables The optional variables to fill into the temnplate.
   */
  translate<T = Dict<string>>(tag: string, variables?: T): string;
  /**
   * Provides translations to the application.
   * The translations will be exlusively used for retrieving translations for the pilet.
   * @param messages The messages to use as transslation basis.
   */
  provideTranslations(messages: LocalizationMessages): void;
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
   */
  registerModal<TOpts>(name: string, render: ForeignComponent<ModalComponentProps<PiralApi<TExtraApi>, TOpts>>): void;
  /**
   * Registers a modal dialog using a React component.
   * The name needs to be unique to be used without the pilet's name.
   * @param name The name of the modal to register.
   * @param Component The component to render the page.
   */
  registerModal<TOpts>(name: string, Component: ComponentType<ModalComponentProps<PiralApi<TExtraApi>, TOpts>>): void;
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
  registerPage(route: string, render: ForeignComponent<PageComponentProps<PiralApi<TExtraApi>>>): void;
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
  registerTile(
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
   */
  registerExtension<T>(name: string, render: ForeignComponent<ExtensionComponentProps<PiralApi<TExtraApi>, T>>): void;
  /**
   * Registers an extension component with a React component.
   * The name must refer to the extension slot.
   * @param name The global name of the extension slot.
   * @param Component The component to be rendered.
   */
  registerExtension<T>(name: string, Component: ComponentType<ExtensionComponentProps<PiralApi<TExtraApi>, T>>): void;
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
  registerMenu(
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
   */
  registerSearchProvider(name: string, provider: SearchProvider<PiralApi<TExtraApi>>): void;
  /**
   * Unregisters a search provider known by the given name.
   * Only previously registered search providers can be unregistered.
   * @param name The name of the search provider to unregister.
   */
  unregisterSearchProvider(name: string): void;
}
