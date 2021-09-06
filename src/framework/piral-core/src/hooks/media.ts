import { useState, useEffect } from 'react';
import { none } from '../utils/helpers';
import { getCurrentLayout } from '../utils/media';

/**
 * Hook to detect layout changes (e.g., which UI breakpoint was hit).
 * @param queries The available queries matching the breakpoints.
 * @param values The values mapping to the breakpoints
 * @param defaultValue The default value.
 */
export function useMedia<T>(queries: Array<string>, values: Array<T>, defaultValue: T) {
  const match = () => getCurrentLayout(queries, values, defaultValue);
  const [value, update] = useState(match);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const handler = () => update(match);
      window.addEventListener('resize', handler);
      return () => window.removeEventListener('resize', handler);
    }
  }, none);

  return value;
}
