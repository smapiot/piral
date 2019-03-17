import { useEffect } from 'react';
import { History } from 'history';
import { PromptMessage } from '../types';

/**
 * Hook to notify the user in case of potential data loss when
 * performing a page transition (internal or external).
 * @param active True if the prompt should be shown, otherwise false.
 * @param history The history of the currently used router.
 * @param message The message to display when the prompt is shown.
 */
export function usePrompt(active: boolean, history: History, message: PromptMessage) {
  useEffect(() => {
    if (active) {
      const beforeUnload = (ev: BeforeUnloadEvent) => {
        const msg = typeof message === 'function' ? message() : message;
        ev.returnValue = msg;
        return msg;
      };
      const unblock = history.block(message);
      window.addEventListener('beforeunload', beforeUnload);
      return () => {
        unblock();
        window.removeEventListener('beforeunload', beforeUnload);
      };
    }

    return () => {};
  }, [active, message]);
}
