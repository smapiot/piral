import { runPilet } from 'piral-base';
import { withKey, GlobalStateContext, PiletEntries, PiletEntry } from 'piral-core';
import { PiletUpdateMode } from './types';

function getPiletHash(pilet: PiletEntry) {
  if ('link' in pilet) {
    return {
      name: pilet.name || '',
      link: pilet.link || '',
    };
  } else if ('hash' in pilet) {
    return {
      name: pilet.name || '',
      hash: pilet.hash || '',
    };
  } else if ('version' in pilet) {
    return {
      name: pilet.name || '',
      version: pilet.version || '',
    };
  } else {
    return {
      name: pilet['name'] || '',
    };
  }
}

function computePiletHash(pilets: PiletEntries) {
  return JSON.stringify(pilets.map(getPiletHash).sort((a, b) => a.name.localeCompare(b.name)));
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

  for (const meta of pilets) {
    ctx.options.loadPilet(meta).then((pilet) => {
      try {
        ctx.injectPilet(pilet);
        runPilet(ctx.options.createApi, pilet, ctx.options.hooks);
      } catch (error) {
        console.error(error);
      }
    });
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
