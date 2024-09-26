import type { Pilet, LoadPiletsOptions } from 'piral-base';
import type { PiralCustomEventMap } from './custom';

/**
 * A key value store that can be abstracted onto a storage solution (e.g. cookie).
 */
export interface PiralStorage {
  /**
   * Sets the value of an item.
   * @param name The name of the item to set.
   * @param data The new value of the item.
   * @param expires Optional expiration information.
   */
  setItem(name: string, data: string, expires?: string): void;
  /**
   * Gets the value of an item.
   * @param name The name of the item to look for.
   */
  getItem(name: string): string | null;
  /**
   * Removes an item from the storage.
   * @param name The name of the item to remove.
   */
  removeItem(name: string): void;
}

/**
 * Can be implemented by functions to be used for disposal purposes.
 */
export interface Disposable {
  /**
   * Disposes the created resource.
   */
  (): void;
}

/**
 * Gets fired when a data item gets stored in piral.
 */
export interface PiralStoreDataEvent<TValue = any> {
  /**
   * The name of the item that was stored.
   */
  name: string;
  /**
   * The storage target of the item.
   */
  target: string;
  /**
   * The value that was stored.
   */
  value: TValue;
  /**
   * The owner of the item.
   */
  owner: string;
  /**
   * The expiration of the item.
   */
  expires: number;
}

/**
 * Gets fired when an unhandled error in a component has been prevented.
 */
export interface PiralUnhandledErrorEvent {
  /**
   * The container showing the error / containing the component.
   */
  container: any;
  /**
   * The type of the error, i.e., the type of component that crashed.
   */
  errorType: string;
  /**
   * The actual error that was emitted.
   */
  error: Error;
  /**
   * The name of the pilet containing the problematic component.
   */
  pilet: string;
}

/**
 * Gets fired when all pilets have been loaded.
 */
export interface PiralLoadedPiletsEvent {
  /**
   * The pilets that have been loaded.
   */
  pilets: Array<Pilet>;
  /**
   * The loading error, if any.
   */
  error?: Error;
}

/**
 * Gets fired when the loading of pilets is triggered.
 */
export interface PiralLoadingPiletsEvent {
  /**
   * The options that have been supplied for loading the pilets.
   */
  options: LoadPiletsOptions;
}

declare module 'piral-base/lib/types/api' {
  interface PiralEventMap extends PiralCustomEventMap {
    'store-data': PiralStoreDataEvent;
    'unhandled-error': PiralUnhandledErrorEvent;
    'loading-pilets': PiralLoadingPiletsEvent;
    'loaded-pilets': PiralLoadedPiletsEvent;
  }
}
