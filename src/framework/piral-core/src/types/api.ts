import type { ReactElement, ReactNode } from 'react';
import type { RouteComponentProps } from 'react-router';
import type {
  PiletApi,
  Pilet,
  PiletEntry,
  PiletEntries,
  PiletMetadata,
  EventEmitter,
  PiletLoader,
  PiletLoadingStrategy,
} from 'piral-base';
import type {} from 'piral-debug-utils';
import type { PiletCustomApi } from './custom';
import type { AnyComponent, PiralPageMeta } from './components';
import type { ExtensionParams, ExtensionSlotProps, PiralExtensionSlotMap } from './extension';
import type { SharedData, DataStoreOptions } from './data';
import type { Disposable } from './utils';

export { PiletApi, Pilet, PiletMetadata, EventEmitter, PiletEntry, PiletEntries, PiletLoader, PiletLoadingStrategy };

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
 * The shape of an implicit unregister function.
 */
export interface RegistrationDisposer {
  /**
   * Cleans up the previous registration.
   */
  (): void;
}

/**
 * The props of an extension component.
 */
export interface ExtensionComponentProps<T> extends BaseComponentProps {
  /**
   * The provided parameters for showing the extension.
   */
  params: T extends keyof PiralExtensionSlotMap ? PiralExtensionSlotMap[T] : T extends string ? any : T;
  /**
   * The optional children to receive, if any.
   */
  children?: ReactNode;
}

/**
 * The props that every registered page component obtains.
 */
export interface RouteBaseProps<UrlParams extends { [K in keyof UrlParams]?: string } = {}, UrlState = any>
  extends RouteComponentProps<UrlParams, {}, UrlState>,
    BaseComponentProps {}

/**
 * The props used by a page component.
 */
export interface PageComponentProps<T extends { [K in keyof T]?: string } = {}, S = any> extends RouteBaseProps<T, S> {
  /**
   * The meta data registered with the page.
   */
  meta: PiralPageMeta;
  /**
   * The children of the page.
   */
  children: ReactNode;
}

/**
 * Shorthand for the definition of an extension component.
 */
export type AnyExtensionComponent<TName> = TName extends keyof PiralExtensionSlotMap
  ? AnyComponent<ExtensionComponentProps<TName>>
  : TName extends string
  ? AnyComponent<ExtensionComponentProps<any>>
  : AnyComponent<ExtensionComponentProps<TName>>;

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
  registerPage(route: string, Component: AnyComponent<PageComponentProps>, meta?: PiralPageMeta): RegistrationDisposer;
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
    Component: AnyExtensionComponent<TName>,
    defaults?: Partial<ExtensionParams<TName>>,
  ): RegistrationDisposer;
  /**
   * Unregisters a global extension component.
   * Only previously registered extension components can be unregistered.
   * @param name The name of the extension slot to unregister from.
   * @param Component The registered extension component to unregister.
   */
  unregisterExtension<TName>(
    name: TName extends string ? TName : string,
    Component: AnyExtensionComponent<TName>,
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
   * @return The disposer to clear the extension.
   */
  renderHtmlExtension<TName>(element: HTMLElement | ShadowRoot, props: ExtensionSlotProps<TName>): Disposable;
}

declare module 'piral-base/lib/types/runtime' {
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
