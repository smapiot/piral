import { PiralEventMap } from 'piral-base';
import { PiralCustomEventMap } from './custom';

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
 * Gets fired when a pilet gets unloaded.
 */
export interface PiralUnloadPiletEvent {
  /**
   * The name of the pilet to be unloaded.
   */
  name: string;
}

declare module 'piral-base/lib/types' {
  interface PiralEventMap extends PiralCustomEventMap {
    'store-data': PiralStoreDataEvent;
    'unload-pilet': PiralUnloadPiletEvent;
  }
}
