import { withKey, GlobalStateContext, PiletEntries, PiletMetadata } from 'piral-core';
import { PiletUpdateMode } from './types';

function getPiletHash(pilet: PiletMetadata) {
  return {
    name: pilet.name,
    version: pilet.version,
  };
}

function sortPilets(a: { name: string }, b: { name: string }) {
  return a.name.localeCompare(b.name);
}

function computePiletHash(pilets: PiletEntries) {
  return JSON.stringify(pilets.map(getPiletHash).sort(sortPilets));
}

export function rejectUpdate(ctx: GlobalStateContext) {
  ctx.dispatch((state) => ({
    ...state,
    updatability: {
      ...state.updatability,
      target: [],
      active: false,
    },
  }));
}

export function approveUpdate(ctx: GlobalStateContext) {
  const pilets = ctx.readState((s) => s.updatability.target);

  for (const pilet of pilets) {
    ctx.addPilet(pilet);
  }

  ctx.rejectUpdate();
}

export function checkForUpdates(ctx: GlobalStateContext, pilets: PiletEntries) {
  const checkHash = computePiletHash(pilets);
  const lastHash = ctx.readState((s) => s.updatability.lastHash || computePiletHash(s.modules));

  if (checkHash !== lastHash) {
    const currentModes = ctx.readState((s) => s.registry.updatability);
    const piletNames = Object.keys(currentModes);
    const blocked = piletNames.filter((m) => currentModes[m].mode === 'block');
    const ask = piletNames.filter((m) => currentModes[m].mode === 'ask');
    const target = pilets.filter((pilet) => !blocked.includes(pilet.name));
    const active = ask.length > 0;

    ctx.dispatch((state) => {
      // no need to ask for approval
      if (!active) {
        // automatically start the update in the next cycle
        setTimeout(ctx.approveUpdate, 0);
      }

      return {
        ...state,
        updatability: {
          active,
          lastHash: checkHash,
          target,
        },
      };
    });
  }
}

export function setUpdateMode(ctx: GlobalStateContext, piletName: string, mode: PiletUpdateMode) {
  ctx.dispatch((state) => ({
    ...state,
    registry: {
      ...state.registry,
      updatability: withKey(state.registry.updatability, piletName, { mode }),
    },
  }));
}
