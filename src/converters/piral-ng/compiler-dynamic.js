import info from '@angular/compiler/package.json';

const url = new URL('.', __system_context__.meta.url);

if (typeof window.ngVersions === 'undefined') {
  window.ngVersions = {};
}

window.ngVersions[url.href] = info.version;

const existing = Object.getOwnPropertyDescriptor(window, 'ng');

if (existing?.get === undefined) {
  const defaultVersion = 'default';
  const ngs = {
    [defaultVersion]: existing?.value,
  };

  function getUrl() {
    const { stack } = new Error();
    const lines = stack?.split('\n') || [];

    if (lines[0] === 'Error') {
      // V8
      const line = lines[3] || '';
      return /\((.*):\d+:\d+\)$/.exec(line)?.[1] || '';
    } else {
      // SpiderMonkey and JavaScriptCore
      const line = lines[2] || '';
      return /@(.*):\d+:\d+$/.exec(line)?.[1] || '';
    }
  }

  function getNgVersion(url) {
    try {
      const baseUrl = new URL('.', url);
      const version = window.ngVersions[baseUrl];
      return version || defaultVersion;
    } catch {
      return defaultVersion;
    }
  }

  Object.defineProperty(window, 'ng', {
    configurable: true,
    get() {
      const url = getUrl();
      const version = getNgVersion(url);
      return ngs[version];
    },
    set(value) {
      const url = getUrl();
      const version = getNgVersion(url);
      ngs[version] = value;
    },
  });
}
