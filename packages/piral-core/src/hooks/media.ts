import { useState, useEffect } from 'react';
import { getCurrentLayout } from '../utils/media';

export function useMedia<T>(queries: Array<string>, values: Array<T>, defaultValue: T) {
  const match = () => getCurrentLayout(queries, values, defaultValue);
  const [value, update] = useState(match);

  useEffect(() => {
    const handler = () => update(match);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return value;
}
