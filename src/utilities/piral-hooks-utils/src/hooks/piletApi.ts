import { useContext } from 'react';
import { PiletApiProvider } from '../contexts';

/**
 * Retrieves the Pilet API stored in the provider.
 * The component must be somewhat wrapped in the
 * PiletApiProvider, e.g., via withPiletApi wrapper.
 * @returns The Pilet API for this component.
 */
export function usePiletApi<TPiletApi = any>(): TPiletApi {
  return useContext(PiletApiProvider);
}
