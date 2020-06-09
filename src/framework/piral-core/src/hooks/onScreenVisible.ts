import { useState, useEffect, RefObject } from 'react';

/**
 * Hook that detects if a reference element within the main document is
 * visible.
 * Useful for performing some animation or triggering certain actions (e.g.,
 * loading data for infinity scrolling) when an element appears or is close
 * to appear on screen.
 * @param ref The reference element to be visible.
 * @param rootMargin The tolerance level to the reference element.
 */
export function useOnScreenVisible<T extends HTMLElement>(ref: RefObject<T>, rootMargin = '0px') {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting), {
      rootMargin,
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.unobserve(ref.current);
  }, []);

  return isIntersecting;
}
