import { useEffect, RefObject } from 'react';

/**
 * Hook that detects if a click outside the given reference
 * has been performed.
 * @param ref The reference to the element.
 * @param handler The callback to invoke when an outside click happened.
 */
export function useOnClickOutside<T extends HTMLElement>(ref: RefObject<T>, handler: (event: MouseEvent) => void) {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler(event);
      }
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler]);
}
