import { LoadPiletsOptions } from 'piral-base';
import { withEmulatorPilets } from 'piral-debug-utils';
import { GlobalStateContext } from './types';

export function integrate(context: GlobalStateContext, options: LoadPiletsOptions) {
  options.fetchPilets = withEmulatorPilets(options.fetchPilets, {
    addPilet: context.addPilet,
    removePilet: context.removePilet,
  });
}
