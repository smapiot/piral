import { includeScript } from '../../utils';
import type { SinglePiletApp, PiletMetadataV1 } from '../../types';

/**
 * Includes the given single pilet script via its URL with a dependency resolution.
 * @param meta The meta data of the dependency to include.
 * @param crossOrigin The override for the cross-origin attribute.
 * @returns The evaluated module.
 */
export function includeDependency(meta: PiletMetadataV1, crossOrigin?: string) {
  return includeScript(meta.name, meta.requireRef, meta.link, meta.integrity, crossOrigin) as Promise<SinglePiletApp>;
}
