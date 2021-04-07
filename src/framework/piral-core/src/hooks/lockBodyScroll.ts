import { useLayoutEffect } from 'react';

/**
 * Hook that locks scrolling on the main document.
 * Useful for preventing the standard scrolling in context of
 * a modal dialog.
 */
export function useLockBodyScroll() {
  useLayoutEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, []);
}
