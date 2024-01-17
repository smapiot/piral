import type { PiletMetadata, EventEmitter, PiletApi, PiletApiExtender } from './types';

export function initializeApi(target: PiletMetadata, events: EventEmitter): PiletApi {
  return {
    on: events.on.bind(events),
    once: events.once.bind(events),
    off: events.off.bind(events),
    emit: events.emit.bind(events),
    meta: Object.assign({}, target),
  };
}

export function mergeApis(api: PiletApi, extenders: Array<PiletApiExtender<Partial<PiletApi>>>, target: PiletMetadata) {
  const frags = extenders.map((extender) => extender(api, target));
  Object.assign(api, ...frags);
  return api;
}
