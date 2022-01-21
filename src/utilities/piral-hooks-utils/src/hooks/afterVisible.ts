import { useState, useEffect, useRef } from 'react';

/**
 * A hook to indicate something was suddenly visible.
 * @param time The time after which it should be triggered.
 * @param cb The callback to use when the part was visible.
 * @returns The reference to the element which should be watched.
 */
export function useAfterVisible(time: number, cb: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const [intersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((ev) => {
      setIntersecting(ev.some((m) => m.isIntersecting));
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref.current]);

  useEffect(() => {
    if (intersecting) {
      const tid = setTimeout(cb, time);
      return () => clearTimeout(tid);
    }
  }, [intersecting, cb]);

  return ref;
}
