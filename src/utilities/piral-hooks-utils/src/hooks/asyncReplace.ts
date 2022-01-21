import { useState, useEffect } from 'react';

/**
 * Gives a full async lifecycle in a hook.
 * @param action The lazy loader.
 * @param resolve The resolve function getting the result from the promise.
 * @returns The current executing state, and the trigger to start the async operation.
 */
export function useAsyncReplace<T = void>(
  action: () => Promise<T>,
  resolve: (result: T) => void = () => {},
): [boolean, () => void, Error | undefined] {
  const [executing, setExecuting] = useState<boolean | Error>(false);
  const error = executing instanceof Error ? executing : undefined;

  useEffect(() => {
    if (executing === true) {
      let active = true;

      action().then(
        (result) => active && resolve(result),
        (err) => active && setExecuting(err),
      );

      return () => (active = false);
    }

    return () => {};
  }, [executing]);

  return [executing === true, () => setExecuting(true), error];
}
