import { PiletMetadata } from './meta';
import { PiralCustomEventMap } from './custom';

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

export interface Disposable {
  /**
   * Disposes the created resource.
   */
  (): void;
}

export interface Listener<T> {
  /**
   * Receives an event of type T.
   */
  (arg: T): void;
}

export interface PiralStoreDataEvent {
  name: string;
  target: string;
  value: any;
  owner: string;
  expires: number;
}

export interface PiralChangeLanguageEvent {
  previous: string;
  selected: string;
}

export interface PiralChangeLayoutEvent {
  previous: string;
  current: string;
}

export interface PiralStartLoadEvent {}

export interface PiralEndLoadEvent {
  modules: Array<PiletMetadata>;
}

export interface PiralLoadingEvent {}

export interface PiralEventMap extends PiralCustomEventMap {
  'store-data': PiralStoreDataEvent;
  'change-language': PiralChangeLanguageEvent;
  'change-layout': PiralChangeLayoutEvent;
  'load-start': PiralStartLoadEvent;
  'load-end': PiralEndLoadEvent;
  loading: PiralLoadingEvent;
  [custom: string]: any;
}

export interface EventEmitter {
  /**
   * Attaches a new event listener.
   * @param type The type of the event to listen for.
   * @param callback The callback to trigger.
   */
  on<K extends keyof PiralEventMap>(type: K, callback: Listener<PiralEventMap[K]>): EventEmitter;
  /**
   * Detaches an existing event listener.
   * @param type The type of the event to listen for.
   * @param callback The callback to trigger.
   */
  off<K extends keyof PiralEventMap>(type: K, callback: Listener<PiralEventMap[K]>): EventEmitter;
  /**
   * Emits a new event with the given type.
   * @param type The type of the event to emit.
   * @param arg The payload of the event.
   */
  emit<K extends keyof PiralEventMap>(type: K, arg: PiralEventMap[K]): EventEmitter;
}
