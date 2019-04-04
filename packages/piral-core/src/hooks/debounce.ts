import { useState, useEffect } from 'react';

/**
 * Hook that returns the debounced (i.e., delayed) value.
 * Useful when user input should not fire immediately, but rather
 * only after a certain timespan without any changes passed.
 * @param value The value to consider.
 * @param delay The timespan to pass before applying the value.
 */
export function useDebounce<T>(value: T, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
