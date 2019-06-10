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

export type Dict<T> = Record<string, T>;

export type Without<T, K> = Pick<T, Exclude<keyof T, K>>;

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

export interface PiralTrackEventEvent {
  type: 'event';
  name: string;
  properties: any;
  measurements: any;
}

export interface PiralTrackErrorEvent {
  type: 'error';
  error: any;
  properties: any;
  measurements: any;
  severityLevel: SeverityLevel;
}

export interface PiralTrackStartFrameEvent {
  type: 'start-frame';
  name: string;
}

export interface PiralTrackEndFrameEvent {
  type: 'end-frame';
  name: string;
  properties: any;
  measurements: any;
}

export type PiralTrackEvent =
  | PiralTrackEventEvent
  | PiralTrackErrorEvent
  | PiralTrackStartFrameEvent
  | PiralTrackEndFrameEvent;

export interface PiralEventMap {
  store: PiralStoreDataEvent;
  track: PiralTrackEvent;
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

export const enum SeverityLevel {
  /**
   * Verbose severity level.
   */
  Verbose = 0,
  /**
   * Information severity level.
   */
  Information = 1,
  /**
   * Warning severity level.
   */
  Warning = 2,
  /**
   * Error severity level.
   */
  Error = 3,
  /**
   * Critical severity level.
   */
  Critical = 4,
}
