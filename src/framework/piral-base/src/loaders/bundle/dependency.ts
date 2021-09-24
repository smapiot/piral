import { includeScript } from '../../utils';
import type { MultiPiletApp, PiletMetadataBundle } from '../../types';

/**
 * Includes the given bundle script via its URL with a dependency resolution.
 * @param meta The meta data of the dependency to include.
 * @param crossOrigin The override for the cross-origin attribute.
 * @returns The evaluated module.
 */
export function includeBundle(meta: PiletMetadataBundle, crossOrigin?: string) {
  return includeScript(
    meta.name ?? '(bundle)',
    meta.bundle,
    meta.link,
    meta.integrity,
    crossOrigin,
  ) as Promise<MultiPiletApp>;
}
