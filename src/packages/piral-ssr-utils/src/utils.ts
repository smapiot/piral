import { PiletMetadata } from 'piral-core';
import { MaybeAsync } from './types';

const bundleUrlHead = 'var __bundleUrl__=';

/**
 * Transforms the URL leading to a file to an URL leading to a directory.
 * @param url The URL to use for deriving its base.
 * @returns The base URL of the given URL.
 */
export function baseUrl(url: string) {
  if (url.match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\\n]+/g)) {
    return url.replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^\/]+$/, '$1') + '/';
  }

  return '/';
}

/**
 * Modifies the provided content of a pilet to include a reference to its original URL.
 * @param content The content of the pilet.
 * @param link The link where the pilet was coming from.
 * @retuns The modified content including the right reference.
 */
export function modifyUrlReferences(content: string, link?: string) {
  if (typeof link === 'string') {
    const url = baseUrl(link);
    return content.split(bundleUrlHead).join(`${bundleUrlHead}${JSON.stringify(url)}||`);
  }

  return content;
}

/**
 * Loads all pilets described in the given metadata.
 * @param metadata The metadata containing references to different pilets.
 * @param getPilet Describes how pilets should be requested.
 * @returns A promise leading to an array of (embedded, i.e., pre-loaded) pilets.
 */
export function loadPilets(metadata: Array<PiletMetadata>, getPilet: (url: string) => MaybeAsync<string>) {
  return Promise.all(
    metadata.map(async pilet => {
      const originalContent = pilet.content || (await getPilet(pilet.link));
      const content = modifyUrlReferences(originalContent, pilet.link);
      return {
        custom: pilet.custom,
        hash: pilet.hash,
        name: pilet.name,
        version: pilet.version,
        content,
      };
    }),
  );
}

/**
 * Represents a requester for retrieving the embedded pilets.
 */
export function requestEmbeddedPilets(): Promise<Array<PiletMetadata>> {
  const pilets = window.__pilets__;
  return Promise.resolve(pilets || []);
}
