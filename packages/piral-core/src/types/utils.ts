export interface PortalStorage {
  setItem(name: string, data: string, expires?: string): void;
  getItem(name: string): string | null;
  removeItem(name: string): void;
}

export interface LocalizationMessages {
  [lang: string]: {
    [tag: string]: string;
  };
}

export interface Dict<T> {
  [name: string]: T;
}

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

export interface StoreDataPortalEvent {
  name: string;
  target: string;
  value: any;
  owner: string;
  expires: number;
}

export interface TrackEventPortalEvent {
  type: 'event';
  name: string;
  properties: any;
  measurements: any;
}

export interface TrackErrorPortalEvent {
  type: 'error';
  error: any;
  properties: any;
  measurements: any;
  severityLevel: SeverityLevel;
}

export interface TrackStartFramePortalEvent {
  type: 'start-frame';
  name: string;
}

export interface TrackEndFramePortalEvent {
  type: 'end-frame';
  name: string;
  properties: any;
  measurements: any;
}

export type TrackPortalEvent =
  | TrackEventPortalEvent
  | TrackErrorPortalEvent
  | TrackStartFramePortalEvent
  | TrackEndFramePortalEvent;

export interface PortalEventMap {
  store: StoreDataPortalEvent;
  track: TrackPortalEvent;
  [custom: string]: any;
}

export interface EventEmitter {
  /**
   * Attaches a new event listener.
   * @param type The type of the event to listen for.
   * @param callback The callback to trigger.
   */
  on<K extends keyof PortalEventMap>(type: K, callback: Listener<PortalEventMap[K]>): EventEmitter;
  /**
   * Detaches an existing event listener.
   * @param type The type of the event to listen for.
   * @param callback The callback to trigger.
   */
  off<K extends keyof PortalEventMap>(type: K, callback: Listener<PortalEventMap[K]>): EventEmitter;
  /**
   * Emits a new event with the given type.
   * @param type The type of the event to emit.
   * @param arg The payload of the event.
   */
  emit<K extends keyof PortalEventMap>(type: K, arg: PortalEventMap[K]): EventEmitter;
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
