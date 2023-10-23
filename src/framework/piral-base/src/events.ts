import type { EventEmitter } from './types';

export type EventListeners = Array<[any, any]>;

function nameOf(type: string | number) {
  return `piral-${type}`;
}

/**
 * Creates a new Piral app shell event emitter.
 * Uses a custom event dispatcher with a state for usage control.
 * @param state The optional state object to identify the instance.
 * @returns The event emitter.
 */
export function createListener(state: any = {}): EventEmitter {
  const eventListeners: EventListeners = [];

  return {
    on(type, callback) {
      const listener = ({ detail }: CustomEvent) => detail && detail.state === state && callback(detail.arg);
      document.body.addEventListener(nameOf(type), listener);
      eventListeners.push([callback, listener]);
      return this;
    },
    once(type, callback) {
      const cb = (ev: any) => {
        this.off(type, cb);
        callback(ev);
      };
      return this.on(type, cb);
    },
    off(type, callback) {
      const [listener] = eventListeners.filter((m) => m[0] === callback);

      if (listener) {
        document.body.removeEventListener(nameOf(type), listener[1]);
        eventListeners.splice(eventListeners.indexOf(listener), 1);
      }

      return this;
    },
    emit(type, arg) {
      document.body.dispatchEvent(
        new CustomEvent(nameOf(type), {
          bubbles: false,
          cancelable: false,
          detail: {
            arg,
            state,
          },
        }),
      );
      return this;
    },
  };
}
