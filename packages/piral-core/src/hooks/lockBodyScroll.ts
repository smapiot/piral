import { useLayoutEffect } from 'react';

export function useLockBodyScroll() {
  useLayoutEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = 'visible');
  }, []);
}
