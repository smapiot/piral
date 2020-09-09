import { isfunc } from './utils';
import { standardStrategy } from './strategies';
import type { LoadPiletsOptions, Pilet, PiletsLoading } from './types';

export function startLoadingPilets(options: LoadPiletsOptions) {
  const state = {
    loaded: false,
    pilets: [],
    error: undefined,
  };
  const notifiers: Array<PiletsLoading> = [];
  const call = (notifier: PiletsLoading) => notifier(state.error, state.pilets, state.loaded);
  const notify = () => notifiers.forEach(call);
  const setPilets = (error: Error, pilets: Array<Pilet>) => {
    state.error = error;
    state.pilets = pilets;
    notify();
  };
  const setLoaded = () => {
    state.loaded = true;
    notify();
  };
  const { strategy = standardStrategy } = options;
  strategy(options, setPilets).then(setLoaded, setLoaded);
  return {
    connect(notifier: PiletsLoading) {
      if (isfunc(notifier)) {
        notifiers.push(notifier);
        call(notifier);
      }
    },
    disconnect(notifier: PiletsLoading) {
      const index = notifiers.indexOf(notifier);
      index !== -1 && notifiers.splice(index, 1);
    },
  };
}
