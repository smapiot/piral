import { __assign } from 'tslib';
import type { PiletMetadata, EventEmitter, PiletApi, PiletApiExtender } from './types';

export function initializeApi(target: PiletMetadata, events: EventEmitter) {
  return {
    on: events.on,
    off: events.off,
    emit: events.emit,
    meta: {
      ...target,
    },
  } as PiletApi;
}

export function mergeApis(api: PiletApi, extenders: Array<PiletApiExtender<Partial<PiletApi>>>, target: PiletMetadata) {
  const frags = extenders.map((extender) => extender(api, target));
  __assign(api, ...frags);
  return api;
}
