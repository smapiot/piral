/**
 * Defines the metadata used to describe a pilet.
 */
export interface PiletMetadata {
  /**
   * The name of the pilet.
   */
  name: string;
  /**
   * The version of the pilet.
   */
  version: string;
  /**
   * The hashcode of the pilet.
   */
  hash: string;
  /**
   * The link to the root module of the pilet.
   */
  link?: string;
  /**
   * Optionally, the content of the pilet.
   */
  content?: string;
  /**
   * The custom data supplied by the pilet.
   */
  custom?: any;
}
