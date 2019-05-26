import { Listener, EventEmitter } from '../types';
import { appendItem, excludeItem } from '../utils';

export interface EventListeners {
  [event: string]: Array<Listener<any>>;
}

export function createListener(): EventEmitter {
  const eventListeners: EventListeners = {};

  return {
    on(type, callback) {
      eventListeners[type] = appendItem(eventListeners[type], callback);
      return this;
    },
    off(type, callback) {
      eventListeners[type] = excludeItem(eventListeners[type], callback);
      return this;
    },
    emit(type, arg) {
      const callbacks = eventListeners[type] || [];

      for (const callback of callbacks) {
        setTimeout(() => callback.call(this, arg), 0);
      }

      return this;
    },
  };
}
