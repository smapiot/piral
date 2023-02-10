import { withKey, withoutKey, GlobalStateContext } from 'piral-core';
import { TrackerRegistration } from './types';

export function registerTracker(ctx: GlobalStateContext, name: string, value: TrackerRegistration) {
  ctx.dispatch((state) => ({
    ...state,
    registry: {
      ...state.registry,
      trackers: withKey(state.registry.trackers, name, value),
    },
  }));
}

export function unregisterTracker(ctx: GlobalStateContext, name: string) {
  ctx.dispatch((state) => ({
    ...state,
    registry: {
      ...state.registry,
      trackers: withoutKey(state.registry.trackers, name),
    },
  }));
}
