import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useHash(current: HTMLElement) {
  const { hash } = useLocation();

  useEffect(() => {
    const tid = setTimeout(() => {
      const element = document.getElementById(hash.substr(1));
      element?.scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
    }, 10);
    return () => clearTimeout(tid);
  }, [hash, current]);

  return hash;
}
