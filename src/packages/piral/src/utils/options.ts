import { PiletRequester, GlobalState } from 'piral-core';
import { isfunc, ArbiterModule, ArbiterModuleMetadata } from 'react-arbiter';
import { PiralAttachment, PiletApi, PiralConfig, PiralLoader } from '../types';

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
  loader: PiralConfig<TApi, TState> | PiralLoader<TApi, TState>,
) {
  return isfunc(loader) ? loader : () => Promise.resolve(loader);
}

export function getPiletRequester(pilets: PiletRequester | Array<ArbiterModuleMetadata>) {
  return isfunc(pilets) ? pilets : () => Promise.resolve(pilets);
}

export function getAvailablePilets(setup?: PiralAttachment) {
  const debugModules = (process.env.DEBUG_PILETS || '').split(',');
  const availableModules: Array<ArbiterModule<PiletApi>> = [];

  for (const debugModule of debugModules) {
    if (debugModule) {
      availableModules.push(require(debugModule));
    }
  }

  if (isfunc(setup)) {
    availableModules.push({
      setup,
      hash: '',
      version: process.env.BUILD_PCKG_VERSION || '0.0.0',
      name: 'app',
      dependencies: {},
    });
  }

  return availableModules;
}
