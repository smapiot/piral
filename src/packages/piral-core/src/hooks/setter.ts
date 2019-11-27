import { useEffect as useSideEffect } from 'react';

function useMainEffect(cb: () => void) {
  cb();
}

const useEffect = typeof window !== 'undefined' ? useSideEffect : useMainEffect;

export function useSetter(cb: () => void) {
  useEffect(cb, []);
}
