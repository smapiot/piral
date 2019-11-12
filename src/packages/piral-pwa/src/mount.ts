export function mount() {
  return new Promise<ServiceWorkerRegistration>(resolve => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        resolve(navigator.serviceWorker.register('/service-worker.js'));
      });
    } else {
      resolve();
    }
  });
}
