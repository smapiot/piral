import { useEffect as useSideEffect } from 'react';

function useMainEffect(cb: () => void) {
  cb();
}

const useEffect = typeof window !== 'undefined' ? useSideEffect : useMainEffect;

/**
 * Hook for running the callback once on mount.
 * @param cb The callback to be invoked on mounting.
 */
export function useSetter(cb: () => void) {
  useEffect(cb, []);
}
