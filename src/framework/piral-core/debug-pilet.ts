import { LoadPiletsOptions } from 'piral-base';
import { installPiletsEmulator } from 'piral-debug-utils';
import { GlobalStateContext } from './lib/types';

export function integrate(context: GlobalStateContext, options: LoadPiletsOptions) {
  installPiletsEmulator(options.fetchPilets, {
    injectPilet: context.injectPilet,
    createApi: options.createApi,
    loadPilet: options.loadPilet,
    integrate(emulator) {
      context.dispatch((s) => ({
        ...s,
        components: {
          ...s.components,
          ...emulator.components,
        },
      }));

      options.fetchPilets = emulator.requester;
    },
  });
}
