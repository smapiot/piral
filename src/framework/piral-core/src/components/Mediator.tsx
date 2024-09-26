import * as React from 'react';
import { LoadPiletsOptions, startLoadingPilets, PiletsLoading } from 'piral-base';
import { useGlobalStateContext } from '../hooks';
import { none } from '../utils';

/**
 * The props of the Mediator component.
 */
export interface MediatorProps {
  /**
   * The options for loading the pilets.
   */
  options: LoadPiletsOptions;
}

/**
 * The Mediator component for interfacing with pilets loading.
 */
export const Mediator: React.FC<MediatorProps> = ({ options }) => {
  const { initialize, readState, emit } = useGlobalStateContext();

  React.useEffect(() => {
    const shouldLoad = readState((s) => s.app.loading);

    if (shouldLoad) {
      const { connect, disconnect } = startLoadingPilets(options);

      emit('loading-pilets', { options });

      const notifier: PiletsLoading = (error, pilets, loaded) => {
        initialize(!loaded, error, pilets);

        if (loaded) {
          emit('loaded-pilets', { pilets, error });
        }
      };
      connect(notifier);
      return () => disconnect(notifier);
    }
  }, none);

  // tslint:disable-next-line:no-null-keyword
  return null;
};
