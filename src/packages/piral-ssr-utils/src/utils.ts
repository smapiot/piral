import { createHash } from 'crypto';
import { PiletMetadata } from 'piral-base';
import { MaybeAsync, PiralSsrExternalScript } from './types';

const bundleUrl = '__bundleUrl__';
const getBundleUrlExport = 'exports.getBundleURL=';
const bundleUrlDecl = `var ${bundleUrl}=`;

function sha256(x: string) {
  return createHash('sha256')
    .update(x, 'utf8')
    .digest('hex');
}

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
    return content
      .split(bundleUrlDecl)
      .join(`${bundleUrlDecl}${JSON.stringify(url)}||`)
      .split(getBundleUrlExport)
      .join(`${getBundleUrlExport}function(){return ${bundleUrl}}||`);
  }

  return content;
}

/**
 * Loads all pilets described in the given metadata.
 * @param metadata The metadata containing references to different pilets.
 * @param getPilet Describes how pilets should be requested. By default, pilets are still remotely included.
 * @returns A promise leading to an array of (embedded, i.e., pre-loaded) pilets.
 */
export function loadPilets(
  metadata: Array<PiletMetadata>,
  getPilet: (url: string) => MaybeAsync<string | false> = () => false,
) {
  return Promise.all(
    metadata.map(async pilet => {
      const originalContent = pilet.content || (await getPilet(pilet.link));

      if (typeof originalContent === 'string') {
        return {
          custom: pilet.custom,
          hash: pilet.hash,
          name: pilet.name,
          version: pilet.version,
          content: modifyUrlReferences(originalContent, pilet.link),
        };
      }

      return pilet;
    }),
  );
}

/**
 * Creates a script reference from the given embedded content.
 * @param embedded The embedded content to externalize.
 * @param asExternal The external script generator.
 */
export function createExternalScript(embedded: string, asExternal?: PiralSsrExternalScript) {
  if (typeof asExternal === 'function') {
    const hash = sha256(embedded);
    const externalPath = asExternal(hash, embedded);

    if (typeof externalPath === 'string') {
      return `<script src="${externalPath}"></script>`;
    }

    console.error('Expected "asExternal" to return a "string".');
  }

  return `<script>${embedded}</script>`;
}
