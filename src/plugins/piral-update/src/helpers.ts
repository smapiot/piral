import { ListenCallback } from './types';

export interface CheckPeriodicallyFactoryOptions {
  /**
   * The time [in ms] between two checks for updates.
   * By default 5 minutes.
   * @default 300000
   */
  period?: number;
}

/**
 * Creates a listener which periodicially checks the API.
 * @param options The options to create the listener.
 */
export function checkPeriodically(options: CheckPeriodicallyFactoryOptions = {}): ListenCallback {
  const { period = 5 * 60 * 1000 } = options;

  return (notify, context) => {
    setInterval(() => {
      context.options.fetchPilets().then(notify);
    }, period);
  };
}

export interface CheckWebSocketFactoryOptions {
  /**
   * The fully qualified URL for the WebSocket endpoint.
   */
  url: string;
  /**
   * A function that is used to determine if the current message indicates an update.
   * @param data The data of the message. This is the string.
   * @param raw The raw WebSocket message event.
   */
  available(data: string, raw: MessageEvent<any>): boolean;
}

/**
 * Creates a listener connecting to a WebSocket.
 * @param options The options to create the listener.
 */
export function checkWebSocket(options: CheckWebSocketFactoryOptions): ListenCallback {
  const { url, available } = options;

  return (notify, context) => {
    const ws = new WebSocket(url);
    ws.onmessage = (e) => {
      if (available(e.data, e)) {
        context.options.fetchPilets().then(notify);
      }
    };
  };
}

export interface CheckServerSentEventsFactoryOptions {
  /**
   * The fully qualified URL for the Server-Side-Events endpoint.
   */
  url: string;
  /**
   * The name of the event announcing updates to a pilet.
   */
  name: string;
  /**
   * An optional function that is used to determine if the current event indicates an update.
   * @param raw The raw message event.
   */
  available?(raw: Event): boolean;
}

/**
 * Creates a listener connecting to an EventSource.
 * @param options The options to create the listener.
 */
export function checkServerSentEvents(options: CheckServerSentEventsFactoryOptions): ListenCallback {
  const { url, name, available = () => true } = options;

  return (notify, context) => {
    const sse = new EventSource(url);
    sse.addEventListener(name, (e) => {
      if (available(e)) {
        context.options.fetchPilets().then(notify);
      }
    });
  };
}

export interface CheckPiralEventFactoryOptions {
  /**
   * The name of the event announcing updates to a pilet.
   */
  name: string;
  /**
   * An optional function that is used to determine if the current event indicates an update.
   * @param e The event data.
   */
  available?(e: any): boolean;
}

/**
 * Creates a listener relying on a Piral event.
 * @param options The options to create the listener.
 */
export function checkPiralEvent(options: CheckPiralEventFactoryOptions): ListenCallback {
  const { name, available = () => true } = options;

  return (notify, context) => {
    context.on(name, (e) => {
      if (available(e)) {
        context.options.fetchPilets().then(notify);
      }
    });
  };
}
