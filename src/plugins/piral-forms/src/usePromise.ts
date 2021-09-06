import { useState, useEffect } from 'react';

/**
 * The currently captured Promise state.
 */
export interface UsePromiseResult<T> {
  loading: boolean;
  data: T;
  error: any;
}

/**
 * Hook for introducing a complete local loading state for a promise.
 * @param promise The callback for the promise to wait for.
 */
export function usePromise<T>(promise: () => Promise<T>) {
  const [result, setResult] = useState<UsePromiseResult<T>>({
    loading: true,
    data: undefined,
    error: undefined,
  });
  useEffect(() => {
    let cancelled = false;

    promise().then(
      (data) => !cancelled && setResult({ data, error: undefined, loading: false }),
      (error) => !cancelled && setResult({ data: undefined, error, loading: false }),
    );

    return () => {
      cancelled = true;
    };
  }, []);
  return result;
}
