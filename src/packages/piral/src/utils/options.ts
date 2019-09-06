import { PiletRequester, GlobalState } from 'piral-core';
import { isfunc, ArbiterModule, ArbiterModuleMetadata } from 'react-arbiter';
import { PiralConfig, PiralLoader } from '../types';

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

export function getLoader<TApi, TState extends GlobalState = GlobalState>(
  loader: PiralLoader<TApi, TState>,
  oldConfig: PiralConfig<TApi, TState>,
): PiralLoader<TApi, TState> {
  return opts => loader(opts).then(newConfig => ({ ...oldConfig, ...newConfig }));
}

export function getPiletRequester(pilets: PiletRequester | Array<ArbiterModuleMetadata>) {
  return isfunc(pilets) ? pilets : () => Promise.resolve(pilets);
}

export function getAvailablePilets<TApi>() {
  const debugModules = (process.env.DEBUG_PILETS || '').split(',');
  const availableModules: Array<ArbiterModule<TApi>> = [];

  for (const debugModule of debugModules) {
    if (debugModule) {
      availableModules.push(require(debugModule));
    }
  }

  return availableModules;
}
