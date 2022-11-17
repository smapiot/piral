import { useEffect } from 'react';
import type { History, Location } from 'history';

/**
 * Hook to notify the user in case of potential data loss when
 * performing a page transition (internal or external).
 * @param active True if the prompt should be shown, otherwise false.
 * @param history The history of the currently used router.
 * @param message The message to display when the prompt is shown.
 */
 export function usePrompt(
  active: boolean,
  history: History,
  message: string,
  onTransition?: (location: Location) => void
) {
  useEffect(() => {
    if (active) {
      const beforeUnload = (ev: BeforeUnloadEvent) => {
        ev.returnValue = message;
        return message;
      };
      const unlisten = onTransition && history.listen(onTransition);
      const unblock = message && history.block(message);
      window.addEventListener('beforeunload', beforeUnload);
      return () => {
        unlisten && unlisten();
        unblock && unblock();
        window.removeEventListener('beforeunload', beforeUnload);
      };
    }

    return () => {};
  }, [active, message]);
}
