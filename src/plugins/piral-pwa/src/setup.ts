import { PwaClient } from './types';

/**
 * Available configuration options for the PWA plugin.
 */
export interface PwaConfig {
  /**
   * Determines if notifications permissions should be requested immediately.
   * Otherwise, the permissions will be requested when used the first time.
   */
  notifications?: boolean;
  /**
   * Determines if the prompt for PWA installation should be shown automatically.
   * Otherwise, the installation request needs to be handled separately.
   */
  install?: boolean;
  /**
   * The scope of the service worker.
   */
  scope?: string;
  /**
   * Event to handle when an update should be applied.
   * By default the update is applied immediately.
   * @param apply Callback to trigger applying the update.
   */
  onUpdate?(apply: () => void): void;
  /**
   * Event to handle when the update has completed.
   * By default the website is reloaded.
   */
  onUpdated?(): void;
}

/**
 * Sets up a new PWA client by creating a service worker registration.
 * @param config
 */
export function setupPwaClient(config: PwaConfig = {}) {
  const {
    onUpdate = (apply) => apply(),
    onUpdated = () => window.location.reload(),
    scope,
    notifications,
    install,
  } = config;

  if (notifications) {
    Notification.requestPermission();
  }

  const sw = new Promise<ServiceWorkerRegistration | void>((resolve) => {
    if ('serviceWorker' in navigator) {
      let shouldInstall = install;

      window.addEventListener('beforeinstallprompt', (ev) => {
        ev.preventDefault();

        if (shouldInstall) {
          shouldInstall = false;

          const listener = () => {
            document.removeEventListener('click', listener);
            (ev as any).prompt();
          };
          document.addEventListener('click', listener);
        }
      });

      window.addEventListener('load', () => {
        resolve(
          require('../generators/worker.codegen')({
            scope,
          }),
        );
      });
    } else {
      resolve();
    }
  });

  const client: PwaClient = {
    use(action) {
      return sw.then((reg) => reg && action(reg));
    },
    update() {
      sw.then((reg) => reg && reg.update());
    },
  };

  const handleUpdating = (reg: ServiceWorkerRegistration) => {
    const sw = reg.installing || reg.waiting;

    if (sw && !sw.onstatechange) {
      let ignoreWaiting = false;

      const onUpdateStateChange = () => {
        switch (sw.state) {
          case 'installed':
            ignoreWaiting &&
              onUpdate(() =>
                sw.postMessage({
                  action: 'skipWaiting',
                }),
              );
          case 'installing':
            break;
          case 'activated':
            onUpdated();
          case 'redundant':
            sw.onstatechange = undefined;
            break;
        }
      };

      const onInstallStateChange = () => {
        switch (sw.state) {
          case 'activated':
          case 'redundant':
            sw.onstatechange = undefined;
            break;
          case 'installing':
          case 'installed':
            break;
        }
      };

      if (reg.active) {
        onUpdateStateChange();
        sw.onstatechange = onUpdateStateChange;
      } else {
        onInstallStateChange();
        sw.onstatechange = onInstallStateChange;
      }

      if (reg.waiting) {
        ignoreWaiting = true;
      }
    }
  };

  client.use((reg) => {
    handleUpdating(reg);
    reg.onupdatefound = () => handleUpdating(reg);
  });

  return client;
}
