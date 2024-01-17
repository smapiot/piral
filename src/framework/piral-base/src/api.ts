import type { PiletMetadata, EventEmitter, PiletApi, PiletApiExtender } from './types';

export function initializeApi(target: PiletMetadata, events: EventEmitter): PiletApi {
  return {
    on: events.on,
    once: events.once,
    off: events.off,
    emit: events.emit,
    meta: Object.assign({}, target),
  };
}

export function mergeApis(api: PiletApi, extenders: Array<PiletApiExtender<Partial<PiletApi>>>, target: PiletMetadata) {
  const frags = extenders.map((extender) => extender(api, target));
  Object.assign(api, ...frags);
  return api;
}
