import * as Stickyfill from 'stickyfilljs';
import { useRef, useEffect } from 'react';
import ScrollSpy from 'vanillajs-scrollspy';

export function useStickySidebar() {
  const container = useRef(undefined);
  useEffect(() => {
    const spy = new ScrollSpy(container.current);
    const handler = () => spy.menuControl();
    Stickyfill.add(container.current);
    spy.animated();
    setTimeout(handler, 0);
    document.addEventListener('scroll', handler);
    return () => document.removeEventListener('scroll', handler);
  }, [container.current]);
  return container;
}
