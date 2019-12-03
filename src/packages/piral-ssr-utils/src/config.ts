import { PiralConfiguration } from 'piral-core';
import { requestEmbeddedPilets } from './utils';

/**
 * Changes the configuration to accomodate for server-side-rendering.
 * In a nutshell just changes the requestPilets to use the embedded
 * pilets (or nothing).
 * @param config The existing configuration to augment, if anything.
 */
export function configForServerRendering(config: PiralConfiguration = {}): PiralConfiguration {
  return {
    ...config,
    requestPilets: requestEmbeddedPilets,
  };
}
