import { ReactElement } from 'react';
import { RouteComponentProps } from 'react-router';
import { PiletApi, Pilet, PiletMetadata, EventEmitter } from 'piral-base';
import { PiletCustomApi, PiralCustomPageMeta } from './custom';
import { AnyComponent } from './components';
import { ExtensionSlotProps, PiralExtensionSlotMap } from './extension';
import { SharedData, DataStoreOptions } from './data';

export { PiletApi, Pilet, PiletMetadata, EventEmitter };

/**
 * The props that every registered component obtains.
 */
export interface BaseComponentProps {
  /**
   * The currently used pilet API.
   */
  piral: PiletApi;
}

/**
 * The props of an extension component.
 */
export interface ExtensionComponentProps<T> extends BaseComponentProps {
  /**
   * The provided parameters for showing the extension.
   */
  params: T extends keyof PiralExtensionSlotMap ? PiralExtensionSlotMap[T] : T extends string ? any : T;
}

/**
 * The props that every registered page component obtains.
 */
export interface RouteBaseProps<UrlParams = any, UrlState = any>
  extends RouteComponentProps<UrlParams, {}, UrlState>,
    BaseComponentProps {}

/**
 * The props used by a page component.
 */
export interface PageComponentProps<T = any, S = any> extends RouteBaseProps<T, S> {}

/**
 * The meta data registered for a page.
 */
export interface PiralPageMeta extends PiralCustomPageMeta {}

/**
 * Defines the Pilet API from piral-core.
 * This interface will be consumed by pilet developers so that their pilet can interact with the piral instance.
 */
export interface PiletCoreApi {
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
   * Registers a route for predefined page component.
   * The route needs to be unique and can contain params.
   * Params are following the path-to-regexp notation, e.g., :id for an id parameter.
   * @param route The route to register.
   * @param Component The component to render the page.
   * @param meta The optional metadata to use.
   */
  registerPage(route: string, Component: AnyComponent<PageComponentProps>, meta?: PiralPageMeta): void;
  /**
   * Unregisters the page identified by the given route.
   * @param route The route that was previously registered.
   */
  unregisterPage(route: string): void;
  /**
   * Registers an extension component with a predefined extension component.
   * The name must refer to the extension slot.
   * @param name The global name of the extension slot.
   * @param Component The component to be rendered.
   * @param defaults Optionally, sets the default values for the expected data.
   */
  registerExtension<TName>(
    name: TName extends string ? TName : string,
    Component: AnyComponent<ExtensionComponentProps<TName>>,
    defaults?: TName,
  ): void;
  /**
   * Unregisters a global extension component.
   * Only previously registered extension components can be unregistered.
   * @param name The name of the extension slot to unregister from.
   * @param Component The registered extension component to unregister.
   */
  unregisterExtension<TName>(
    name: TName extends string ? TName : string,
    Component: AnyComponent<ExtensionComponentProps<TName>>,
  ): void;
  /**
   * React component for displaying extensions for a given name.
   * @param props The extension's rendering props.
   * @return The created React element.
   */
  Extension<TName>(props: ExtensionSlotProps<TName>): ReactElement | null;
  /**
   * Renders an extension in a plain DOM component.
   * @param element The DOM element or shadow root as a container for rendering the extension.
   * @param props The extension's rendering props.
   */
  renderHtmlExtension<TName>(element: HTMLElement | ShadowRoot, props: ExtensionSlotProps<TName>): void;
}

declare module 'piral-base/lib/types' {
  interface PiletApi extends PiletCustomApi, PiletCoreApi {}
}

/**
 * Represents the dictionary of the loaded pilets and their APIs.
 */
export interface PiletsBag {
  /**
   * Gets the API of the respective pilet name.
   */
  [name: string]: PiletApi;
}
