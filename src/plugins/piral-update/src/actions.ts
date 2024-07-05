import { withKey, GlobalStateContext, PiletEntries, PiletMetadata, PiletEntry } from 'piral-core';
import { PiletUpdateMode } from './types';

interface HashEntry {
  name: string;
  version: string;
}

function getPiletHash(pilet: PiletMetadata): HashEntry {
  return {
    name: pilet.name,
    version: pilet.version,
  };
}

function sortPilets(a: HashEntry, b: HashEntry) {
  return a.name.localeCompare(b.name);
}

function computePiletHash(pilets: PiletEntries) {
  return JSON.stringify(pilets.map(getPiletHash).sort(sortPilets));
}

function reset(ctx: GlobalStateContext) {
  ctx.dispatch((state) => ({
    ...state,
    updatability: {
      ...state.updatability,
      added: [],
      updated: [],
      removed: [],
      active: false,
    },
  }));
}

async function apply(ctx: GlobalStateContext) {
  const { added, removed, updated } = ctx.readState((s) => s.updatability);

  for (const pilet of removed) {
    await ctx.removePilet(pilet.name);
  }

  for (const pilet of updated) {
    await ctx.removePilet(pilet.name);
    await ctx.addPilet(pilet);
  }

  for (const pilet of added) {
    await ctx.addPilet(pilet);
  }
}

export function rejectUpdate(ctx: GlobalStateContext) {
  reset(ctx);
}

export function approveUpdate(ctx: GlobalStateContext) {
  apply(ctx);
  reset(ctx);
}

export function checkForUpdates(ctx: GlobalStateContext, pilets: PiletEntries) {
  const currentHash = computePiletHash(pilets);
  const currentPilets = ctx.readState((s) => s.modules);
  const previousHash = ctx.readState((s) => s.updatability.lastHash || computePiletHash(currentPilets));

  if (currentHash !== previousHash) {
    const currentModes = ctx.readState((s) => s.registry.updatability);
    const currentPiletNames = currentPilets.map((m) => m.name);
    const isPending = (pilet: PiletEntry) => currentModes[pilet.name]?.mode === 'ask';
    const isNotBlocked = (pilet: PiletEntry) => currentModes[pilet.name]?.mode !== 'block';

    const added = pilets.filter((m) => !currentPiletNames.includes(m.name));
    const removed = currentPilets.filter((m) => !pilets.some((p) => p.name === m.name) && isNotBlocked(m));
    const updated = pilets.filter((pilet) => {
      if ('version' in pilet && isNotBlocked(pilet)) {
        const version = currentPilets.find((m) => m.name)?.version;
        return !!version && version !== pilet.version;
      }

      return false;
    });

    ctx.dispatch((state) => {
      const anyPendingDecision = [...removed, ...updated].some(isPending);

      // no need to ask for approval
      if (!anyPendingDecision) {
        // automatically start the update in the next cycle
        setTimeout(ctx.approveUpdate, 0);
      }

      return {
        ...state,
        updatability: {
          active: anyPendingDecision,
          lastHash: currentHash,
          added,
          removed,
          updated,
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
