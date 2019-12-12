import { standardStrategy } from './strategies';
import { LoadPiletsOptions, GenericPilet, PiletsLoading } from './types';

export function startLoadingPilets<TApi>(options: LoadPiletsOptions<TApi>) {
  const state = {
    loaded: false,
    pilets: [],
    error: undefined,
  };
  const notifiers: Array<PiletsLoading<TApi>> = [];
  const notify = () => notifiers.forEach(notifier => notifier(state.error, state.pilets, state.loaded));
  const setPilets = (error: Error, pilets: Array<GenericPilet<TApi>>) => {
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
    connect(notifier: PiletsLoading<TApi>) {
      notifiers.push(notifier);
    },
    disconnect(notifier: PiletsLoading<TApi>) {
      const index = notifiers.indexOf(notifier);
      index !== -1 && notifiers.splice(index, 1);
    },
  };
}
