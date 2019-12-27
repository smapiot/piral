export function loadEmberApp(appName: string, appUrl: string, vendorUrl?: string) {
  return new Promise<any>((resolve, reject) => {
    if (vendorUrl) {
      const scriptVendor = document.createElement('script');
      scriptVendor.src = vendorUrl;
      scriptVendor.async = true;
      scriptVendor.onload = loadApp;
      scriptVendor.onerror = reject;
      document.head.appendChild(scriptVendor);
    } else {
      loadApp();
    }

    function loadApp() {
      const scriptEl = document.createElement('script');
      scriptEl.src = appUrl;
      scriptEl.async = true;
      scriptEl.onload = () => {
        resolve(window.require(appName + '/app'));
      };
      scriptEl.onerror = reject;
      document.head.appendChild(scriptEl);
    }
  });
}
