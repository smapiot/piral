import { useEffect } from 'react';
import { isfunc, NavigationApi, NavigationListener, NavigationBlocker } from 'piral-core';

import type { PromptMessage } from './types';

/**
 * Hook to notify the user in case of potential data loss when
 * performing a page transition (internal or external).
 * @param active True if the prompt should be shown, otherwise false.
 * @param navigation The navigation API.
 * @param message The message to display when the prompt is shown.
 */
export function usePrompt(
  active: boolean,
  navigation: NavigationApi,
  message: PromptMessage,
  onTransition?: NavigationListener,
) {
  useEffect(() => {
    if (active) {
      const beforeUnload = (ev: BeforeUnloadEvent) => {
        const msg = isfunc(message) ? message() : message;
        ev.returnValue = msg;
        return msg;
      };
      const unlisten = onTransition && navigation.listen(onTransition);
      const blocker = typeof message === 'function' ? message : () => message;
      const unblock = message && navigation.block(blocker);
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
