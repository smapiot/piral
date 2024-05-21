import info from '@angular/compiler/package.json';

if (typeof window.ngVersions === 'undefined') {
  window.ngVersions = {};
}

const defaultVersion = 'default';
const existing = Object.getOwnPropertyDescriptor(window, 'ng');

function setUrl(url, version) {
  if (version) {
    window.ngVersions[url] = version;
    return version;
  }

  return defaultVersion;
}

setUrl(new URL('.', __system_context__.meta.url).href, info.version);

if (existing?.get === undefined) {
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
    const version = window.ngVersions[url];

    if (!version) {
      try {
        const baseUrl = new URL('.', url);
        const baseVersion = window.ngVersions[baseUrl.href];
        return setUrl(url, baseVersion);
      } catch {
        return defaultVersion;
      }
    }
    
    return version;
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
