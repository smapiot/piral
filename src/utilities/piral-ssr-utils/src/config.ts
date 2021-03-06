import { PiralConfiguration, PiletMetadata } from 'piral-core';

/**
 * Represents a requester for retrieving the embedded pilets.
 */
function requestEmbeddedPilets(): Promise<Array<PiletMetadata>> {
  const pilets = window.__pilets__;
  return Promise.resolve(pilets || []);
}

/**
 * Changes the configuration to accommodate for server-side-rendering.
 * This is achieved by telling the requestPilets method to use the embedded
 * pilets (or nothing).
 * @param config The existing configuration to augment, if anything.
 */
export function configForServerRendering(config: PiralConfiguration = {}): PiralConfiguration {
  return {
    ...config,
    requestPilets: requestEmbeddedPilets,
  };
}
