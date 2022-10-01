import { LoadPiletsOptions } from 'piral-base';
import { installPiletEmulator } from 'piral-debug-utils';
import { GlobalStateContext } from '../types';

export function integrateEmulator(context: GlobalStateContext, options: LoadPiletsOptions) {
  installPiletEmulator(options.fetchPilets, {
    addPilet: context.addPilet,
    removePilet: context.removePilet,
    integrate(requester) {
      options.fetchPilets = requester;
    },
  });
}
