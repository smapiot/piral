export function getContainer(selector?: string | Element) {
  if (typeof selector === 'string') {
    return document.querySelector(selector);
  } else if (selector && selector instanceof Element) {
    return selector;
  } else {
    return document.body.appendChild(document.createElement('div'));
  }
}

export function getGateway(url?: string) {
  if (typeof url === 'string') {
    return url;
  } else {
    return document.location.origin;
  }
}

export function getAvailableModules() {
  const debugModules = (process.env.DEBUG_MODULE_PATHS || '').split(',');
  const availableModules = [];

  for (const debugModule of debugModules) {
    if (debugModule) {
      availableModules.push(require(debugModule));
    }
  }

  return availableModules;
}
