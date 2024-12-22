import { useState } from 'react';
import { useGlobalStateContext } from './globalState';

/**
 * Uses the global state context to retrieve the pilet API stored
 * for the root pilet. This allows interaction with the pilet API
 * from the app shell.
 * @returns The pilet API object of the root pilet.
 */
export function usePiletApi() {
  const context = useGlobalStateContext();
  const [api] = useState(() => Object.values(context.apis).shift());
  return api;
}
