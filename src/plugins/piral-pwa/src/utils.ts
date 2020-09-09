export function useNotification(reg: ServiceWorkerRegistration, notify: () => Promise<void>) {
  return (
    reg &&
    Notification.requestPermission().then((permissions) => {
      if (permissions === 'granted') {
        return notify();
      }
    })
  );
}
