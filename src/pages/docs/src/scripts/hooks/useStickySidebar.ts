import * as Stickyfill from 'stickyfilljs';
import { useRef, useEffect } from 'react';

export function useStickySidebar() {
  const container = useRef(undefined);

  useEffect(() => {
    const element = container.current;

    if (element) {
      Stickyfill.add(element);
      return () => Stickyfill.remove(element);
    }

    return () => {};
  }, [container.current]);

  return container;
}
