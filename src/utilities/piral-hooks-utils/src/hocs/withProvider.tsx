import * as React from 'react';
import { PiletApiProvider } from '../contexts';

interface BaseComponentProps {
  /**
   * The currently used pilet API.
   */
  piral: any;
}

/**
 * Wraps the component in a Pilet API provider allowing to make use of
 * the `usePilet` hook.
 * @param Component The component that should be wrapped in a provider.
 * @returns The wrapped component.
 */
export function withPiletApi<T>(Component: React.FC<T>): React.FC<T & BaseComponentProps> {
  return (props) => (
    <PiletApiProvider.Provider value={props.piral}>
      <Component {...props} />
    </PiletApiProvider.Provider>
  );
}
