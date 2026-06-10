import { ReactPortal } from 'react';
import { withoutKey, withKey, includeItem, excludeItem, replaceOrAddItem } from '../utils';
import { GlobalStateContext } from '../types';

type PortalWithContainer = ReactPortal & {
  containerInfo?: unknown;
};

function getPortalContainer(portal: ReactPortal) {
  return (portal as PortalWithContainer).containerInfo;
}

export function destroyPortal(ctx: GlobalStateContext, id: string) {
  ctx.dispatch((state) => ({
    ...state,
    portals: withoutKey(state.portals, id),
  }));
}

export function hidePortal(ctx: GlobalStateContext, id: string, entry: ReactPortal) {
  ctx.dispatch((state) => ({
    ...state,
    portals: withKey(state.portals, id, excludeItem(state.portals[id], entry)),
  }));
}

function isSamePortal(current: ReactPortal, candidate: ReactPortal) {
  const currentContainer = getPortalContainer(current);
  const candidateContainer = getPortalContainer(candidate);

  return candidate === current || (!!currentContainer && currentContainer === candidateContainer);
}

export function updatePortal(ctx: GlobalStateContext, id: string, current: ReactPortal, next: ReactPortal) {
  ctx.dispatch((state) => ({
    ...state,
    portals: withKey(
      state.portals,
      id,
      replaceOrAddItem(state.portals[id], next, (m) => isSamePortal(current, m)),
    ),
  }));
}

export function showPortal(ctx: GlobalStateContext, id: string, entry: ReactPortal) {
  ctx.dispatch((state) => ({
    ...state,
    portals: withKey(state.portals, id, includeItem(state.portals[id], entry)),
  }));
}
