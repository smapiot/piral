import * as React from 'react';
import { LoadPiletsOptions, startLoadingPilets, PiletsLoading } from 'piral-base';
import { useAction } from '../hooks';

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
  const initialize = useAction('initialize');
  React.useEffect(() => {
    const { connect, disconnect } = startLoadingPilets(options);
    const notifier: PiletsLoading = (error, pilets, loaded) => {
      initialize(!loaded, error, pilets);
    };
    connect(notifier);
    return () => disconnect(notifier);
  }, []);
  // tslint:disable-next-line:no-null-keyword
  return null;
};
