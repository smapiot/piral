import { PiletMetadata } from 'piral-base';

declare global {
  interface Window {
    /**
     * The location of the pilets on the page.
     */
    __pilets__?: Array<PiletMetadata>;
  }
}

export type MaybeAsync<T> = T | Promise<T>;

export interface PiralSsrExternalScript {
  /**
   * Creates an external script reference.
   * @param hash The hash of the content. Will be unique.
   * @param content The content to return.
   * @returns The path to the (virtual) script, which should be embedded.
   */
  (hash: string, content: string): string;
}

export interface PiralSsrOptions {
  /**
   * Gets a pilet by its URL. Either via a request, or from some cache.
   * If omitted only the metadata will be included. Pilets will still
   * need to be retrieved remotely.
   * @param url The URL of the pilet.
   * @returns If false is returned the pilet will still be retrieved remotely.
   */
  getPilet?(url: string): MaybeAsync<string | false>;
  /**
   * Gets the pilet metadata for the current request.
   * This can also statically resolve to a fixed set of pilets.
   */
  getPiletsMetadata(): MaybeAsync<Array<PiletMetadata>>;
  /**
   * Fills the HTML template using the rendered body and the data part.
   *
   * The body will resolve to the rendered Pilet instance, while the
   * data part will be a script containing the pilet information.
   *
   * The data part should be introduced before the actual runtime script
   * is included.
   * @param body The rendered body of the Piral instance.
   * @param dataScript The script containing the pilets.
   */
  fillTemplate(body: string, dataScript: string): MaybeAsync<string>;
  /**
   * Optionally, does not inline the script with the static data.
   * Instead, creates another external script, which will be requested
   * from the same server.
   */
  asExternal?: PiralSsrExternalScript;
}
