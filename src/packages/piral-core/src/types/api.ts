import { ComponentType } from 'react';
import { ArbiterModule } from 'react-arbiter';
import { RouteComponentProps } from 'react-router-dom';
import { Dict } from './common';
import { PiletMetadata } from './meta';
import { PiletCustomApi } from './custom';
import { EventEmitter } from './utils';
import { SharedData, DataStoreOptions } from './data';
import { ForeignComponent, AnyComponent } from './components';

export interface BaseComponentProps {
  /**
   * The currently used pilet API.
   */
  piral: PiletApi;
}

export interface ExtensionComponentProps<T = Dict<any>> extends BaseComponentProps {
  /**
   * The provided parameters for showing the extension.
   */
  params: T;
}

export interface RouteBaseProps<UrlParams = any, UrlState = any>
  extends RouteComponentProps<UrlParams, {}, UrlState>,
    BaseComponentProps {}

export interface PageComponentProps<T = any, S = any> extends RouteBaseProps<T, S> {}

export type Pilet = ArbiterModule<PiletApi>;

/**
 * Defines the Pilet API from piral-core.
 */
export interface PiletApi extends PiletCustomApi, EventEmitter {
  /**
   * Gets the metadata of the current pilet.
   */
  meta: PiletMetadata;
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
   * Registers a route for general component.
   * The route needs to be unique and can contain params.
   * Params are following the path-to-regexp notation, e.g., :id for an id parameter.
   * @param route The route to register.
   * @param render The function that is being called once rendering begins.
   */
  registerPageX(route: string, render: ForeignComponent<PageComponentProps>): void;
  /**
   * Registers a route for React component.
   * The route needs to be unique and can contain params.
   * Params are following the path-to-regexp notation, e.g., :id for an id parameter.
   * @param route The route to register.
   * @param Component The component to render the page.
   */
  registerPage(route: string, Component: ComponentType<PageComponentProps>): void;
  /**
   * Unregisters the page identified by the given route.
   * @param route The route that was previously registered.
   */
  unregisterPage(route: string): void;
  /**
   * Registers an extension component with a general components.
   * The name must refer to the extension slot.
   * @param name The global name of the extension slot.
   * @param render The function that is being called once rendering begins.
   * @param defaults Optionally, sets the default values for the expected data.
   */
  registerExtensionX<T>(name: string, render: ForeignComponent<ExtensionComponentProps<T>>, defaults?: T): void;
  /**
   * Registers an extension component with a React component.
   * The name must refer to the extension slot.
   * @param name The global name of the extension slot.
   * @param Component The component to be rendered.
   * @param defaults Optionally, sets the default values for the expected data.
   */
  registerExtension<T>(name: string, Component: ComponentType<ExtensionComponentProps<T>>, defaults?: T): void;
  /**
   * Unregisters a global extension component.
   * Only previously registered extension components can be unregistered.
   * @param name The name of the extension slot to unregister from.
   * @param hook The registered extension component to unregister.
   */
  unregisterExtension<T>(name: string, hook: AnyComponent<ExtensionComponentProps<T>>): void;
}
