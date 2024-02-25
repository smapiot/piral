/**
 * Basic metadata for pilets using the v0 schema.
 */
export interface PiletV0BaseEntry {
  /**
   * The name of the pilet, i.e., the package id.
   */
  name: string;
  /**
   * The version of the pilet. Should be semantically versioned.
   */
  version: string;
  /**
   * Optionally provides the version of the specification for this pilet.
   */
  spec?: 'v0';
  /**
   * The computed hash value of the pilet's content. Should be
   * accurate to allow caching.
   */
  hash: string;
  /**
   * Optionally provides some custom metadata for the pilet.
   */
  custom?: any;
  /**
   * Optionally provides some configuration to be used in the pilet.
   */
  config?: Record<string, any>;
  /**
   * Additional shared dependency script files.
   */
  dependencies?: Record<string, string>;
}

/**
 * Metadata for pilets using the v0 schema with a content.
 */
export interface PiletV0ContentEntry extends PiletV0BaseEntry {
  /**
   * The content of the pilet. If the content is not available
   * the link will be used (unless caching has been activated).
   */
  content: string;
  /**
   * If available indicates that the pilet should not be cached.
   * In case of a string this is interpreted as the expiration time
   * of the cache. In case of an accurate hash this should not be
   * required or set.
   */
  noCache?: boolean | string;
}

/**
 * Metadata for pilets using the v0 schema with a link.
 */
export interface PiletV0LinkEntry extends PiletV0BaseEntry {
  /**
   * The link for retrieving the content of the pilet.
   */
  link: string;
}

/**
 * Metadata for pilets using the v0 schema.
 */
export type PiletV0Entry = PiletV0ContentEntry | PiletV0LinkEntry;

/**
 * Metadata for pilets using the v1 schema.
 */
export interface PiletV1Entry {
  /**
   * The name of the pilet, i.e., the package id.
   */
  name: string;
  /**
   * The version of the pilet. Should be semantically versioned.
   */
  version: string;
  /**
   * Optionally provides the version of the specification for this pilet.
   */
  spec?: 'v1';
  /**
   * The link for retrieving the content of the pilet.
   */
  link: string;
  /**
   * The reference name for the global require.
   */
  requireRef: string;
  /**
   * The computed integrity of the pilet. Will be used to set the
   * integrity value of the script.
   */
  integrity?: string;
  /**
   * Optionally provides some custom metadata for the pilet.
   */
  custom?: any;
  /**
   * Optionally provides some configuration to be used in the pilet.
   */
  config?: Record<string, any>;
  /**
   * Additional shared dependency script files.
   */
  dependencies?: Record<string, string>;
}

/**
 * Metadata for pilets using the v2 schema.
 */
export interface PiletV2Entry {
  /**
   * The name of the pilet, i.e., the package id.
   */
  name: string;
  /**
   * The version of the pilet. Should be semantically versioned.
   */
  version: string;
  /**
   * Provides the version of the specification for this pilet.
   */
  spec: 'v2';
  /**
   * The reference name for the global require.
   */
  requireRef: string;
  /**
   * The computed integrity of the pilet.
   */
  integrity?: string;
  /**
   * The link for retrieving the content of the pilet.
   */
  link: string;
  /**
   * Optionally provides some custom metadata for the pilet.
   */
  custom?: any;
  /**
   * Optionally provides some configuration to be used in the pilet.
   */
  config?: Record<string, any>;
  /**
   * Additional shared dependency script files.
   */
  dependencies?: Record<string, string>;
}

/**
 * Metadata for pilets using the v3 schema.
 */
export interface PiletV3Entry {
  /**
   * The name of the pilet, i.e., the package id.
   */
  name: string;
  /**
   * The version of the pilet. Should be semantically versioned.
   */
  version: string;
  /**
   * Provides the version of the specification for this pilet.
   */
  spec: 'v3';
  /**
   * The reference name for the global require.
   */
  requireRef: string;
  /**
   * The computed integrity of the pilet.
   */
  integrity?: string;
  /**
   * The fallback link for retrieving the content of the pilet.
   */
  link: string;
  /**
   * The links for specific variations of the pilet, e.g., "client", "server", ...
   */
  variations?: Record<string, string>;
  /**
   * Optionally provides some custom metadata for the pilet.
   */
  custom?: any;
  /**
   * Optionally provides some configuration to be used in the pilet.
   */
  config?: Record<string, any>;
  /**
   * Additional shared dependency script files.
   */
  dependencies?: Record<string, string>;
}

/**
 * Metadata for pilets using the v2 schema.
 */
export interface PiletMfEntry {
  /**
   * The name of the pilet, i.e., the package id.
   */
  name: string;
  /**
   * The version of the pilet. Should be semantically versioned.
   */
  version: string;
  /**
   * Provides the version of the specification for this pilet.
   */
  spec: 'mf';
  /**
   * The computed integrity of the pilet.
   */
  integrity?: string;
  /**
   * The fallback link for retrieving the content of the pilet.
   */
  link: string;
  /**
   * Optionally provides some custom metadata for the pilet.
   */
  custom?: any;
  /**
   * Optionally provides some configuration to be used in the pilet.
   */
  config?: Record<string, any>;
}

export interface PiletVxEntry {
  /**
   * The name of the pilet, i.e., the package id.
   */
  name: string;
  /**
   * The version of the pilet. Should be semantically versioned.
   */
  version: string;
  /**
   * Provides an identifier for the custom specification.
   */
  spec: string;
  /**
   * Optionally provides some custom metadata for the pilet.
   */
  custom?: any;
  /**
   * Optionally provides some configuration to be used in the pilet.
   */
  config?: Record<string, any>;
  /**
   * Additional shared dependency script files.
   */
  dependencies?: Record<string, string>;
}

/**
 * Metadata for pilets using the bundle schema.
 */
export interface PiletBundleEntry {
  /**
   * The name of the bundle pilet, i.e., the package id.
   */
  name?: string;
  /**
   * Optionally provides the version of the specification for this pilet.
   */
  spec?: 'v1';
  /**
   * The link for retrieving the bundle content of the pilet.
   */
  link: string;
  /**
   * The reference name for the global bundle-shared require.
   */
  bundle: string;
  /**
   * The computed integrity of the pilet. Will be used to set the
   * integrity value of the script.
   */
  integrity?: string;
  /**
   * Optionally provides some custom metadata for the pilet.
   */
  custom?: any;
  /**
   * Additional shared dependency script files.
   */
  dependencies?: Record<string, string>;
}

/**
 * The metadata response for a single pilet.
 */
export type SinglePiletEntry = PiletV0Entry | PiletV1Entry | PiletV2Entry | PiletV3Entry | PiletMfEntry | PiletVxEntry;

/**
 * The metadata response for a multi pilet.
 */
export type MultiPiletEntry = PiletBundleEntry;

/**
 * Pilet entry representing part of a response from the feed service.
 */
export type PiletEntry = MultiPiletEntry | SinglePiletEntry;

/**
 * The entries representing pilets from a feed service response.
 */
export type PiletEntries = Array<PiletEntry>;
