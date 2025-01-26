import { LoadPiletsOptions } from 'piral-base';
import { DebuggerExtensionOptions, installPiletEmulator } from 'piral-debug-utils';
import { GlobalStateContext } from '../types';

export function integrateEmulator(
  context: GlobalStateContext,
  options: LoadPiletsOptions,
  debug: DebuggerExtensionOptions = {},
) {
  installPiletEmulator(options.fetchPilets, {
    defaultFeedUrl: debug.defaultFeedUrl,
    addPilet: context.addPilet,
    removePilet: context.removePilet,
    integrate(requester) {
      options.fetchPilets = requester;
    },
  });
}
